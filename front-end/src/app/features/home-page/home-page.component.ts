import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { AuthService } from '../../core/auth.service'; 
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Post, Profile } from '../../core/data';
import { environment } from '../../../environments/environment'; //import environment for apiUrl

//import { By, Builder, Browser } from 'selenium-webdriver';
@Component({

  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
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
  
  followLoadingFlag: boolean = true; //true if loading, false if not
  foryouLoadingFlag: boolean = true; //true if loading, false if not
  feedFlag: boolean = false; //true if a feed has been set (needed to time when arrs is set properly)
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

  //needed to limit foryou & following feeds
  //[data]="[FEfeed, UserFeed, FEFollowfeed, FollowUserFeed]"
   show_more_fy_count: number = 0; //for foryou
   show_more_f_count: number = 0; // for following

constructor(authService: AuthService, route: ActivatedRoute, service: CoreService,public http: HttpClient, public formBuilder: FormBuilder )
{
  super(authService,route,service);
  this.pic = "";
  this.service_acc_name = "";
  this.like_ids = [];
  this.retweet_ids = [];
  
}
//passed a hpc to post, so it's going off the correct instance

ngOnInit()
{
  this.pic = sessionStorage.getItem('pic') ?? "";
  this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";
  
  //if foryou is null or empty, get it AND follow from DB
  if (this.service.ForYouFeed == null || this.service.ForYouFeed.length < 1)
    {
      console.log("this.service.ForYouFeed == null");

      this.service.getDBForYouFeed("0").then(({ feed, userFeed }) => {

        console.log('feed:', feed);
        this.FEfeed = feed;
        console.log('users:', userFeed);
        this.UserFeed = userFeed;
        this.foryouLoadingFlag = false;
      });
        
      this.service.getDBFollowFeed(this.service_acc_name, "0").then(({ feed, userFeed }) => {

        console.log('feed:', feed);
        this.FEFollowfeed = feed;
        console.log('users:', userFeed);
        this.FollowUserFeed = userFeed;
        this.followLoadingFlag = false;
      });
    }
  else
    {
      this.FEfeed = this.service.ForYouFeed;
      this.UserFeed = this.service.ForYouUserFeed;
      this.FEFollowfeed = this.service.FollowFeed;
      this.FollowUserFeed = this.service.FollowUserFeed;
      this.foryouLoadingFlag = false;
      this.followLoadingFlag = false;
      console.log("this.service.ForYouFeed is not null");
    }

  if (this.service.Likes == null )
  {
    this.service.getDBRetweets(this.service_acc_name).subscribe(ids => {
          console.log("retweet_ids: " + ids);
          this.retweet_ids = ids;
        });
    this.service.getDBLikes(this.service_acc_name).subscribe(ids => {
          console.log("like_ids: " + ids);
          this.like_ids = ids;
        });
    
    console.log("this.service.Likes == null");
  }
  else
  {
    this.retweet_ids = this.service.Retweets;
    this.like_ids = this.service.Likes;
    console.log("this.service.Likes is not null");
  }

  //this.setLiked();
  //this.setRetweeted();
  
  //sets the feed to the ForYou tab 
  //this.getDBForYouFeed();
  //sets the feed to the Following tab 
  //this.getDBFollowFeed();
}

tweetForm = this.formBuilder.group({
  text_content: ['', [Validators.maxLength(100)]],//181
  });

  isValidInput2()
  {
    if(this.tweetForm.controls['text_content'].errors?.['maxlength'])
    {
      return { backgroundColor: 'rgba(255, 0, 0, 0.6)'};
    }
    else
    {
      return { backgroundColor: 'white'};
    }
  }

  //handles a post button click
  postClick(reply_id: number) //reply_id is always 0 to my knowledge
  {
    let image_content = "";
    
    if(this.service.tweetValidated(this.tweetForm.value.text_content?? '',image_content))
      {
        this.submit_flag = 2;
        this.service.postTweet(this.service_acc_name,this.tweetForm.value.text_content ?? '',image_content, reply_id);
        this.tweetForm.reset();
        console.log("submit flag: " +this.submit_flag)
      }
    else
      {
        this.submit_flag = 1;
        console.log("submit flag: " +this.submit_flag)
      }
  }

  colorReactionBarText(str:string)
  {
    if (this.reaction == str) 
    {
      if( str == 'heart')
      {
        return { color: '#FF4086'}
      }
      else if ( str == 'retweet')
      {
        return { color: '#17BD69'}
      }
      else
      {
        return { color: '#1DA1F2'}
      }
    }
    else
    {
      return {color: '#808080'}
    }
  }

  colorReactionBarBG(str:string)
  {
    if (this.reaction == str) 
    {
      if( str == 'heart')
      {
        return { backgroundColor: '#ff40862b'}
      }
      else if ( str == 'retweet')
      {
        return { backgroundColor: '#17bd6a29'}
      }
      else
      {
        return { backgroundColor: '#1da0f22f'}
      }
    }
    else
    {
      return { backgroundColor: 'transparent'}
    }
  }

  //NEW testing authenticated api calls
  getTweetsTest()
  {
    this.http.get(environment.apiUrl + '/api/tweet/', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('access')}`
      }
    }).subscribe((resultData: any)=>
      {
        console.log("this.getTweetsTest resultdata: " + resultData);
      });
  }




  //NOTE TESTED
    //needed to limit foryou & following feeds
  handleMoreForYouClick()
  {
    console.log("getting more for you");

    if(this.FEfeed.length == (this.show_more_fy_count+1)*20)
    {
      this.show_more_fy_count++; //only increase if theres a mulitiple of 20
      this.service.getDBForYouFeed(String(this.show_more_fy_count)).then(({ feed, userFeed }) => {
        //update data[]
        this.FEfeed = feed;
        this.UserFeed = userFeed;
        this.followLoadingFlag = false;
      });
    }
    else
    {
      this.service.getDBForYouFeed(String(this.show_more_fy_count)).then(({ feed, userFeed }) => {
        //update data[]
        this.FEfeed = feed;
        this.UserFeed = userFeed;
        this.followLoadingFlag = false;
      });
    }   
  }


  //add up to 20 more tweets to thread
  handleMoreFollowingClick()
  {
    console.log("getting more for you");

    if(this.FEFollowfeed.length == (this.show_more_fy_count+1)*20)
    {
      this.show_more_fy_count++; //only increase if theres a mulitiple of 20
      this.service.getDBFollowFeed(this.service_acc_name, String(this.show_more_f_count)).then(({ feed, userFeed }) => {
        //update data[
        this.FEFollowfeed = feed;
        this.FollowUserFeed = userFeed;
        this.followLoadingFlag = false;
      });
      
    }
    else
    {
      this.service.getDBFollowFeed(this.service_acc_name, String(this.show_more_f_count)).then(({ feed, userFeed }) => {
        //update data[]
        this.FEFollowfeed = feed;
        this.FollowUserFeed = userFeed;
        this.followLoadingFlag = false;
      });
    }   
  }
  /*
      let requestMessage =
      {
        'word': 'getReplies',
        'num': this.p_id, 
        'word3': String(this.show_more_count),
      };
    */

}

/* These 6 functions have been moved to core-service.service.ts and converted to return promises

setRetweeted()
  {
    let requestMessage =
    {
      "word": 'getRetweetIDs',
      "word2": this.service_acc_name, 
    }
    
  this.http.put(environment.apiUrl +"/retweet",requestMessage).subscribe((resultData: any)=>
    {
        //console.log(resultData);

        if(resultData == 'Failed to Add' || resultData == 'No retweet ids' || resultData == 'check is else')
        {
          console.log("Did not get ID's");
          console.log(resultData);
          this.retweet_ids = [];
        }
        else //Successful
        {
          this.retweet_ids = resultData;
          console.log(this.retweet_ids);
        }
    });
  }

setLiked()
  {
    let requestMessage =
    {
      "word": 'getLikeIDs',
      "word2": this.service_acc_name, 
    }
    
  this.http.put(environment.apiUrl + "/like",requestMessage).subscribe((resultData: any)=>
    {
        //console.log(resultData);

        if(resultData == 'Failed to Add' || resultData == 'No like ids' || resultData == 'check is else')
        {
          console.log("Did not get ID's");
          console.log(resultData);
          this.like_ids = [];
        }
        else //Successful
        {
          this.like_ids = resultData;
          console.log(this.like_ids);
        }
    });
  }

//gets all tweets(from DB) and adds them to DBfeed array
getDBForYouFeed()
{
    this.http.get(environment.apiUrl + "/tweet").subscribe((resultData: any)=>
    {
        console.log('getDBForYouFeed resultData: ' + resultData);
        if(resultData == "No tweets")
        {
          this.DBfeed = [];
          this.foryouLoadingFlag = false;
        }
        else
        {
          this.DBfeed = resultData;
          this.getDBForYouFeedUsers();
        }
    });
}

//gets user data for each tweet in DBfeed and adds them to UserFeed array and creates Post objects for FEfeed and sets flag
getDBForYouFeedUsers()
{
  let iteration = 0;
  this.DBfeed.forEach((tweet,index) => {

    let requestBody =
    {
      "word": 'w',
      "num": tweet.user.id,//was just tweet.user
    };

    this.http.put( environment.apiUrl + "/tweet",requestBody).subscribe((resultData: any)=>
    {
        var u = new Profile(resultData.pic?.image_url,resultData.header_pic?.image_url, resultData.username, resultData.acc_name, resultData.bio, resultData.following_count, resultData.follower_count);
        this.UserFeed.push(u);
        var p = new Post(tweet.id,u.pic ?? null, u.username, u.acc_name,this.DBfeed[index].date_created, this.DBfeed[index].text_content, '', this.DBfeed[index].comments.toString(), this.DBfeed[index].retweets.toString(), this.DBfeed[index].likes.toString(), this.DBfeed[index].engagements.toString()); 
        this.FEfeed.push(p); 

        iteration++;
        //console.log('f index '+ index + ":" + JSON.stringify(resultData));

        //new
        if(iteration == this.DBfeed.length) //arrays are set
        {
          this.foryouLoadingFlag = false;
          //this.convertForYouFeed();
        }
    });
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
        console.log('getDBFollowFeed resultData: ' + JSON.stringify(resultData));
        if(resultData == "No tweets")
        {
          this.DBFollowfeed = [];
          this.followLoadingFlag = false;
        }
        else
        {
          this.DBFollowfeed = resultData;
          this.getDBFollowFeedUsers();
        }
    });
}

//gets user data for each tweet in DBFollowfeed and adds them to FollowUserFeed array and creates Post objects for FEFollowfeed and sets flag
getDBFollowFeedUsers()
{
  let iteration = 0;
  this.DBFollowfeed.forEach((tweet,index) => {

    let requestBody =
    {
      "word": 'w',
      "num": tweet.user.id,//was just tweet.user
    };

    this.http.put(environment.apiUrl + "/tweet",requestBody).subscribe((resultData: any)=>
    {
        var u = new Profile(resultData.pic?.image_url,resultData.header_pic?.image_url, resultData.username, resultData.acc_name, resultData.bio, resultData.following_count, resultData.follower_count);
        this.FollowUserFeed.push(u);
        var p = new Post(tweet.id,u.pic ?? null, u.username, u.acc_name,this.DBFollowfeed[index].date_created, this.DBFollowfeed[index].text_content, '', this.DBFollowfeed[index].comments.toString(), this.DBFollowfeed[index].retweets.toString(), this.DBFollowfeed[index].likes.toString(), this.DBFollowfeed[index].engagements.toString()); 
        this.FEFollowfeed.push(p); 

        iteration++;
        //console.log('f index '+ index + ":" + JSON.stringify(resultData));

        //new
        if(iteration == this.DBFollowfeed.length) //arrays are set
        {
          this.followLoadingFlag = false;
          //this.convertFollowFeed();
        }
    });
});
}
*/

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