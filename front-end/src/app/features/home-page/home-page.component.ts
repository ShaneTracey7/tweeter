import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { AuthService } from '../../core/auth.service'; 
import { HttpClient } from '@angular/common/http';
import { TweetService } from '../../core/tweet-service';
import { FormBuilder, Validators } from '@angular/forms';
import { Post, Profile } from '../../core/data';

@Component({

  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  //encapsulation: ViewEncapsulation.None
/* HOPING the scope of this is just within home-page module, but it could be global */
})
export class HomePageComponent extends CoreComponent{
  
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

  DBFollowers: any [] = []; //raw array of User followers from DB
  followers: Profile [] = [] //array of Profile objs of followers

  DBFollowing: any [] = []; //raw array of User following from DB
  following: Profile [] = [] //array of Profile objs of following

constructor(authService: AuthService, route: ActivatedRoute, service: CoreService,public http: HttpClient, public tweetService: TweetService, public formBuilder: FormBuilder )
{
  super(authService,route,service);
  this.pic = "";
  this.service_acc_name = "";
  this.like_ids = [];
  this.retweet_ids = [];
  //this.last_like_ids = [];
}

//passed a hpc to post, so it's going off the correct instance

ngOnInit()
{
  console.log("ppg init service current page: " + this.service.current_page);
  this.pic = localStorage.getItem('pic') ?? "badToken";
  this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";
  this.setLiked();
  this.setRetweeted();
  this.setFUF();
}

//******************************************************* */

//gets all tweets(from DB) and adds them to DBfeed array
getDBForYouFeed()
{
    this.http.get("http://127.0.0.1:8000/tweet").subscribe((resultData: any)=>
    {
        //console.log(resultData);
        this.DBfeed = resultData;
    });
}

// Presets UserFeed (needed to make sure profiles are added at the proper index)
presetUserFeed()
{
  this.DBfeed.forEach(() => {
    var u = new Profile("", "", "", "", 0, 0);
    this.UserFeed.push(u)
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
      "num": tweet.user,
    };

    this.http.put("http://127.0.0.1:8000/tweet",requestBody).subscribe((resultData: any)=>
    {
        //var u = new Profile(resultData.pic, resultData.username, resultData.acc_name, "bio", 100, 200);
        var u = new Profile(resultData.pic, resultData.username, resultData.acc_name, resultData.bio, resultData.following_count, resultData.follower_count);
        this.UserFeed.splice(index, 1, u);

    });
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

setFUF()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.createForYouFeed();
            resolve('we got a response');
          }, 0) // 0 secs
        })

        const postPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            //globalObj.arrs = [globalObj.FEfeed];
            globalObj.arrs = [globalObj.FEfeed, globalObj.UserFeed];
            console.log("Arrs HP in ngOnoInit:" + globalObj.arrs[0])
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
  text_content: ['', [Validators.maxLength(181)]],
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
      "image_content": 'url',
      "likes": 0,
      "comments": 0,
      "retweets": 0,
      "engagements": 0,
      };
      this.http.post("http://127.0.0.1:8000/tweet",postData).subscribe((resultData: any)=>
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
