import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { AuthService } from '../../core/auth.service'; 
import { HttpClient } from '@angular/common/http';
import { TweetService } from '../../core/tweet-service';
import { FormBuilder, Validators } from '@angular/forms';
import { Post, Profile } from '../../core/data';
import { environment } from '../../../environments/environment'; //import environment for apiUrl

import { By, Builder, Browser } from 'selenium-webdriver';
@Component({

  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  /*styleUrls: ['./home-page.component.scss', 'home-page-styles2.scss'],*/
  //encapsulation: ViewEncapsulation.None
/* HOPING the scope of this is just within home-page module, but it could be global */
})
export class HomePageComponent extends CoreComponent{
  

  //home_pic_url: string = 
  //needed to ensure when logging into a different account, correct data displays
  service_acc_name: string;
  
  submit_flag: number  = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted
  pic: string;
  reaction: string = "";
  like_ids: number [];
  retweet_ids: number [];
  //last_like_ids: number [];

  arrs: any[] = []; //testing to feed into main component

  DBfeed: any [] = [];
  FEfeed: Post [] = [];
  UserFeed: Profile [] = [];

  DBFollowfeed: any [] = [];
  FEFollowfeed: Post [] = [];
  FollowUserFeed: Profile [] = [];

  DBFollowers: any [] = []; //raw array of User followers from DB
  followers: Profile [] = [] //array of Profile objs of followers

  DBFollowing: any [] = []; //raw array of User following from DB
  following: Profile [] = [] //array of Profile objs of following


  //only for testing 
  image_test: string = '';

constructor(authService: AuthService, route: ActivatedRoute, service: CoreService,public http: HttpClient, public tweetService: TweetService, public formBuilder: FormBuilder )
{
  super(authService,route,service);
  this.pic = "";
  this.service_acc_name = "";
  this.like_ids = [];
  this.retweet_ids = [];
  //this.last_like_ids = [];
}

//testing web scraping capabilities with selenium

/*selTest(){
  //const {By, Builder, Browser } = require('selenium-webdriver');
  
  (async function firstTest() {
    let driver;
    
    try {
      driver = await new Builder().forBrowser(Browser.CHROME).build();
      //await driver.get('https://www.selenium.dev/selenium/web/web-form.html');
    
      //let title = await driver.getTitle();
    
      //await driver.manage().setTimeouts({implicit: 500});
    
      //let textBox = await driver.findElement(By.name('my-text'));
      //let submitButton = await driver.findElement(By.css('button'));
    
      //await textBox.sendKeys('Selenium');
      //await submitButton.click();
    
      //let message = await driver.findElement(By.id('message'));
      //let value = await message.getText();
    } catch (e) {
      console.log(e)
    } finally {
      //await driver!.quit();
    }
  }())
}*/





//passed a hpc to post, so it's going off the correct instance

ngOnInit()
{
  console.log("ppg init service current page: " + this.service.current_page);
  this.pic = localStorage.getItem('pic') ?? "";
  this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";
  this.setLiked();
  this.setRetweeted();
  this.setFUF();
}

handleGetImage()
{
  let responseBody = { 
    "word": 'getImage',
    "word2": 'test_image2',//image name without file type
  }

  this.http.put(environment.apiUrl + "/image", responseBody).subscribe((resultData: any)=>
    {
        console.log(resultData);
        if(resultData == 'Check is false' || resultData == 'Failed to Add')
        {
          this.image_test = '';
        }
        else
        {
          let arr = resultData.split('=');
          let url_id = arr[1].replace('&export','');
          this.image_test = url_id;
          console.log(url_id);
          //return url_id;
        }

    });

}

//gets all tweets(from DB) and adds them to DBfeed array
getDBForYouFeed()
{
    this.http.get(environment.apiUrl + "/tweet").subscribe((resultData: any)=>
    {
        //console.log(resultData);
        console.log('getDBForYouFeed resultData: ' + resultData);
        this.DBfeed = resultData;
    });
}
//gets all tweets from following(from DB) and adds them to DBFollowfeed array
getDBFollowFeed()
{   
  let requestBody =
  {
    "word": 'getFollowFeed',
    "word2": this.service_acc_name,
  };

    this.http.put(environment.apiUrl + "/tweet", requestBody).subscribe((resultData: any)=>
    {
        console.log('getDBFollowFeed resultData: ' + resultData);
        console.log('getDBFollowFeed resultData: ' + resultData[0].text_content);
        
        if(resultData == "No tweets")
        {
          this.DBFollowfeed = [];
        }
        else
        {
          this.DBFollowfeed = resultData;
        }
    });
}

// Presets UserFeed (needed to make sure profiles are added at the proper index)
presetUserFeed()
{
  this.DBfeed.forEach(() => {
    var u = new Profile(null,null, "", "", "", 0, 0);
    this.UserFeed.push(u)
  });
}

// Presets FollowUserFeed (needed to make sure profiles are added at the proper index)
presetFollowUserFeed()
{
  this.DBFollowfeed.forEach(() => {
    var u = new Profile(null,null, "", "", "", 0, 0);
    this.FollowUserFeed.push(u)
    console.log('post')
  });
}

//gets all users from tweets(from DB) and creates a Profile object with them and adds them to UserFeed array
getDBForYouFeedUsers()
{
  this.presetUserFeed();
  //this goes in any order
  this.DBfeed.forEach((tweet,index) => {

    let requestBody =
    {
      "word": 'w',
      "num": tweet.user.id,//was just tweet.user
    };

    this.http.put( environment.apiUrl + "/tweet",requestBody).subscribe((resultData: any)=>
    {
        //var u = new Profile(resultData.pic, resultData.username, resultData.acc_name, "bio", 100, 200);
        var u = new Profile(resultData.pic?.image_url,resultData.header_pic?.image_url, resultData.username, resultData.acc_name, resultData.bio, resultData.following_count, resultData.follower_count);
        this.UserFeed.splice(index, 1, u);
        console.log('f index '+ index + ":" + resultData);

    });
    console.log('fy index: '+ index);
});
}

//gets all users from tweets(from DB) and creates a Profile object with them and adds them to FollowUserFeed array
getDBFollowFeedUsers()
{
  this.presetFollowUserFeed();
  //this goes in any order
  this.DBFollowfeed.forEach((tweet,index) => {

    let requestBody =
    {
      "word": 'w',
      "num": tweet.user.id,//was just tweet.user
    };

    this.http.put(environment.apiUrl + "/tweet",requestBody).subscribe((resultData: any)=>
    {
        //var u = new Profile(resultData.pic, resultData.username, resultData.acc_name, "bio", 100, 200);
        var u = new Profile(resultData.pic?.image_url,resultData.header_pic?.image_url, resultData.username, resultData.acc_name, resultData.bio, resultData.following_count, resultData.follower_count);
        this.FollowUserFeed.splice(index, 1, u);
        console.log('f index '+ index + ":" + resultData);
    });
    console.log('f index: '+ index);
});
}

//creates Post objects using data from DBFeed and UserFeed arrays and adds them to FEfeed array
convertForYouFeed()
{   
    this.DBfeed.forEach((tweet,index) => {
      
      //need to use 'this.DBfeed[index].image_content' when i figure out how to upload images
        var p = new Post(tweet.id,this.UserFeed[index].pic, this.UserFeed[index].username, this.UserFeed[index].acc_name,this.DBfeed[index].date_created, this.DBfeed[index].text_content, '', this.DBfeed[index].comments.toString(), this.DBfeed[index].retweets.toString(), this.DBfeed[index].likes.toString(), this.DBfeed[index].engagements.toString()); 
        this.FEfeed.push(p);       
    });
}

//creates Post objects using data from DBFeed and UserFeed arrays and adds them to FEfeed array
convertFollowFeed()
{   
    this.DBFollowfeed.forEach((tweet,index) => {
      
      //need to use 'this.DBfeed[index].image_content' when i figure out how to upload images
        var p = new Post(tweet.id,this.FollowUserFeed[index].pic, this.FollowUserFeed[index].username, this.FollowUserFeed[index].acc_name,this.DBFollowfeed[index].date_created, this.DBFollowfeed[index].text_content, '', this.DBFollowfeed[index].comments.toString(), this.DBFollowfeed[index].retweets.toString(), this.DBFollowfeed[index].likes.toString(), this.DBFollowfeed[index].engagements.toString()); 
        this.FEFollowfeed.push(p);       
    });
}


//gets data for 'ForYou'feed, calls the 3 above functions using delays to ensure all the data is available, when accessed
createForYouFeed()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.getDBForYouFeed();
            resolve('we got a response');
          }, 0) // 0 secs
        })

        const postPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getDBForYouFeedUsers();
            resolve('we got a response');
          }, 500) // 0.5 secs
        })

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't check")
          }, 10000) //8 secs

          setTimeout(() => {
            globalObj.convertForYouFeed();
            resolve('we checked');
          }, 1000) // 1 sec
        })
        
        async function myAsync(){
          //console.log("inside myAsync");
          try{
            postPromise;
            postPromise2;
            await checkPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
        }
        myAsync();
  }
  //gets data for 'Follow'feed, calls the 3 above functions using delays to ensure all the data is available, when accessed
createFollowFeed()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.getDBFollowFeed();
            resolve('we got a response');
          }, 0) // 0 secs
        })

        const postPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getDBFollowFeedUsers();
            resolve('we got a response');
          }, 500) // 0.5 secs
        })

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't check")
          }, 10000) //8 secs

          setTimeout(() => {
            globalObj.convertFollowFeed();
            resolve('we checked');
          }, 1000) // 1 sec
        })
        
        async function myAsync(){
          //console.log("inside myAsync");
          try{
            postPromise;
            postPromise2;
            await checkPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
        }
        myAsync();
  }

setFUF()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.createForYouFeed();
            globalObj.createFollowFeed(); //new
            resolve('we got a response');
          }, 0) // 0 secs
        })

        const postPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            //globalObj.arrs = [globalObj.FEfeed];
            globalObj.arrs = [globalObj.FEfeed.reverse(), globalObj.UserFeed.reverse(), globalObj.FEFollowfeed, globalObj.FollowUserFeed];
            //reverse FEfeed and UserFeed
            
            //console.log("Arrs HP1 in ngOnoInit:" + globalObj.arrs[0])
            //console.log("Arrs HP2 in ngOnoInit:" + globalObj.arrs[1])
            //console.log("Arrs HP3 in ngOnoInit:" + globalObj.arrs[2])
            //console.log("Arrs HP4 in ngOnoInit:" + globalObj.arrs[3])
            resolve('we got a response');
          }, 2000) // 0 secs

        })
        async function myAsync(){
          try{
            //set FEFeed in tweet service
            postPromise;
            //set forYouFeed to FEFeed
            postPromise2;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
        }
        myAsync();
  }

  setRetweeted()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            //globalObj.last_like_ids = globalObj.tweetService.DBlikes; //NEW
            globalObj.tweetService.getRetweetIDsDB(globalObj.service_acc_name);
            //console.log("last_like_ids = " + globalObj.last_like_ids);
            resolve('we got a response');
          }, 0)
        })
        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.retweet_ids = globalObj.tweetService.DBretweets;
            //console.log("like_ids = " + globalObj.like_ids);
            resolve('we got a response');
          }, 500) // 0 secs
        })

        async function myAsync(){
          try{
            postPromise;
            await checkPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
        }
        myAsync();
  }

setLiked()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            //globalObj.last_like_ids = globalObj.tweetService.DBlikes; //NEW
            globalObj.tweetService.getLikeIDsDB(globalObj.service_acc_name);
            //console.log("last_like_ids = " + globalObj.last_like_ids);
            resolve('we got a response');
          }, 0)
        })
        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.like_ids = globalObj.tweetService.DBlikes;
            //console.log("like_ids = " + globalObj.like_ids);
            resolve('we got a response');
          }, 500) // 0 secs
        })

        async function myAsync(){
          try{
            postPromise;
            await checkPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
        }
        myAsync();
  }

tweetForm = this.formBuilder.group({
  text_content: ['', [Validators.maxLength(100)]],//181
  });

  isValidInput2()
  {
    if(this.tweetForm.controls['text_content'].errors?.['maxlength'])
      {
        return {
          backgroundColor: 'rgba(255, 0, 0, 0.6)',
        };
      }
      else
      {
        return {
          backgroundColor: 'white',
        };
      }
  }

  getTweetService()
  {
    return this.tweetService;
  }

  postClick(reply_id: number)
  {
    let image_content = "";
    this.getTweetService().postTweet(this.service_acc_name,this.tweetForm.value.text_content?? '',image_content, reply_id);
    
    if(this.getTweetService().tweetValidated(this.tweetForm.value.text_content?? '',image_content))
      {
        this.submit_flag = 2;
        this.tweetForm.reset();
        console.log("submit flag: " +this.submit_flag)
      }
    else
      {
        this.submit_flag = 1;
        console.log("submit flag: " +this.submit_flag)
      }
  }
  //*****not in use****    called upon successful submit of create account form
  addPost()
  {
    //get id value for user using acc_name
    let text_input = (<HTMLInputElement>document.getElementById("e-post-input")).value;

    if (text_input != "")
    {  
      let postData = {
      "user": 20, //fake value
      "date_created": new Date(),
      "text_content": text_input,
      "image_content": null, //will be null once set up
      "likes": 0,
      "comments": 0,
      "retweets": 0,
      "engagements": 0,
      };
      this.http.post(environment.apiUrl + "/tweet",postData).subscribe((resultData: any)=>
      {
          console.log(resultData);
      });
    }
  }

  colorReactionBarText(str:string)
  {
    if (this.reaction == str) {

      if( str == 'heart')
        {
          return {
            color: '#FF4086',
          }
        }
      else if ( str == 'retweet')
        {
          return {
            color: '#17BD69',
          }
        }
      else
        {
          return {
            color: '#1DA1F2',
          }
        }
    }
    else{

      return {
        color: '#808080',
      }
    }
  }

  colorReactionBarBG(str:string)
  {
    if (this.reaction == str) {

      if( str == 'heart')
        {
          return {
            backgroundColor: '#ff40862b',
          }
        }
      else if ( str == 'retweet')
        {
          return {
            backgroundColor: '#17bd6a29',
          }
        }
      else
        {
          return {
            backgroundColor: '#1da0f22f',
          }
        }
    }
    else{
      return {
        backgroundColor: 'transparent',
      }
    }
  }

}
function selTest() {
  throw new Error('Function not implemented.');
}

