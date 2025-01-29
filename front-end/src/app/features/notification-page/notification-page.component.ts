import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { HttpClient } from '@angular/common/http';
import { TweetService } from '../../core/tweet-service';
import { Notification, Post, Profile } from '../../core/data';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.scss'
})
export class NotificationPageComponent extends CoreComponent{
  
  //needed to ensure when logging into a different account, correct data displays
  service_acc_name: string;
  arrs: any[] = []; //testing to feed into main component
  DBfeed: any [] = [];
  notificationFeed: Notification [] = [];

  constructor(authService: AuthService, route: ActivatedRoute, service: CoreService,public http: HttpClient, public tweetService: TweetService)
  {
    super(authService,route,service);
    this.service_acc_name = "";
  }

  ngOnInit()
  {
    this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";
    this.setNotificationFeed();
    console.log('inside notification page ngoninit');
  }

  setNotificationFeed()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.createNotificationFeed();
            resolve('we got a response');
          }, 0) // 0 secs
        })

        const postPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.arrs = [globalObj.notificationFeed];
            console.log("Arrs NP in ngOnoInit:" + globalObj.arrs[0]);
            resolve('we got a response');
          }, 2000) // 0 secs

        })
        async function myAsync(){
          try{
            postPromise;
           
            postPromise2;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
        }
        myAsync();
  }

  //gets all tweets(from DB) and adds them to DBfeed array
  getDBNotificationFeed()
  {
    let requestMessage =
    {
      'word': 'getNotifications',
      'word2': this.service_acc_name,
    };
      this.http.put("http://127.0.0.1:8000/notification",requestMessage).subscribe((resultData: any)=>
      {
        if(resultData == 'Failed to Add' || resultData == 'No notifications' || resultData == 'check is else')
          {
            console.log(resultData);
            this.DBfeed = [];
            console.log('Unsuccessful data base retrieval');
          }
          else //Successful
          {
            this.DBfeed = resultData;
            console.log(this.DBfeed);
            console.log('Successful data base retrieval');
          }
      });
  }

  //creates Post objects using data from DBFeed and UserFeed arrays and adds them to FEfeed array
  convertNotificationFeed()
  {   
    /*
    username = models.CharField(max_length = 35)
    acc_name = models.CharField(max_length = 35)
    password = models.CharField(max_length = 35)
    pic = models.CharField(max_length = 100)
    */
   /*
   pic: string; //url
    username: string;
    acc_name: string;
    bio: string;
    follow_count: string;
    follower_count: string;
   */
      for(let i = 0; i < this.DBfeed[0].length; i++)
      {
        var profile_from = new Profile(this.DBfeed[1][i].pic,this.DBfeed[1][i].header_pic,this.DBfeed[1][i].username,this.DBfeed[1][i].acc_name, this.DBfeed[1][i].bio, this.DBfeed[1][i].following_count,this.DBfeed[1][i].follower_count);
        var type = this.DBfeed[0][i];
        var tweetDB = this.DBfeed[2][i];
        var tweet = new Post(tweetDB.id,tweetDB.pic,tweetDB.username,tweetDB.acc_name,tweetDB.date_created,tweetDB.text_content,'',tweetDB.comments, tweetDB.retweets,tweetDB.likes, tweetDB.engagements)
        var text;
        if (type == 'like')
        {
          text = profile_from.username + " liked your post!";
        }
        else if (type == 'follow')
        {
          text = profile_from.username + " followed you!";
        }
        else //retweet
        {
          text = profile_from.username + " retweeted your post!";
        }
        //need to use 'this.DBfeed[index].image_content' when i figure out how to upload images
         var n = new Notification(type, profile_from, tweet);
         this.notificationFeed.push(n);      
      }
      /*
      this.DBfeed.forEach((element,index) => {
      
        var profile_from = new Profile(element[1][index].pic,element[1][index].username,element[1][index].acc_name, '', 0,0);
        var type = element[0][index];
        var text;
        if (type == 'like')
        {
          text = profile_from.username + " liked your post!";
        }
        else if (type == 'follow')
        {
          text = profile_from.username + " followed you!";
        }
        else //retweet
        {
          text = profile_from.username + " retweeted your post!";
        }
        //need to use 'this.DBfeed[index].image_content' when i figure out how to upload images
         var n = new Notification2(type, profile_from, text);
         this.notificationFeed.push(n);       
      });
      */
  }

  //gets data for 'ForYou'feed, calls the 3 above functions using delays to ensure all the data is available, when accessed
createNotificationFeed()
{
  let globalObj = this;

      const postPromise = new Promise<any>(function (resolve, reject) {
        setTimeout(() => {
          reject("We didn't get a response")
        }, 5000) // 5 secs

        setTimeout(() => {
          globalObj.getDBNotificationFeed();
          resolve('we got a response');
        }, 0) // 0 secs
      })

      const checkPromise = new Promise<any>(function (resolve, reject) {
        setTimeout(() => {
          reject("We didn't check")
        }, 10000) //8 secs

        setTimeout(() => {
          globalObj.convertNotificationFeed();
          resolve('we checked');
        }, 1000) // 1 sec
      })
      
      async function myAsync(){
        //console.log("inside myAsync");
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

}
