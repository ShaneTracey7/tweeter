import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { HttpClient } from '@angular/common/http';
import { TweetService } from '../../core/tweet-service';
import { Notification, Post, Profile } from '../../core/data';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.scss'
})
export class NotificationPageComponent extends CoreComponent{
  
  service_acc_name: string; //needed to ensure when logging into a different account, correct data displays
  arrs: any[] = []; //feed into main component
  notificationFeed: Notification [] = [];

  loadingFlag: boolean = true; //flag to show spinner while data is being fetched

  constructor(authService: AuthService, route: ActivatedRoute, service: CoreService,public http: HttpClient, public tweetService: TweetService)
  {
    super(authService,route,service);
    this.service_acc_name = "";
  }

  ngOnInit()
  {
    this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";
    this.setNotificationFeed();
    console.log('inside notification page ngoninit');//testing
  }

  //gets all tweets(from DB) and adds them to DBfeed array
  setNotificationFeed()
  {
    console.log("this.service_acc_name: " + this.service_acc_name);
    let requestMessage =
    {
      'word': 'getNotifications',
      'word2': this.service_acc_name,
      'num': 0 //random
    };
      this.http.put(environment.apiUrl + "/notification",requestMessage).subscribe((resultData: any)=>
      {
        if(resultData == 'Failed to Add' || resultData == 'No notifications' || resultData == 'check is else')
          {
            console.log(resultData);
            this.loadingFlag = false; 
            this.arrs = [[]];
            console.log('Unsuccessful data base retrieval');
          }
          else //Successful
          {
            console.log(resultData);
            this.convertNotificationFeed(resultData);

            this.arrs = [this.notificationFeed];
            this.loadingFlag = false; //hide spinner after data is loaded
            console.log('Successful data base retrieval');
          }
      });
  }

  //creates Post objects using data from DBFeed and UserFeed arrays and adds them to FEfeed array
  convertNotificationFeed(DBfeed : any [])
  {   
      for(let i = 0; i < DBfeed[0].length; i++)
      {
        var profile_from = new Profile(DBfeed[1][i].pic?.image_url,DBfeed[1][i].header_pic?.image_url,DBfeed[1][i].username,DBfeed[1][i].acc_name, DBfeed[1][i].bio, DBfeed[1][i].following_count,DBfeed[1][i].follower_count);
        var type = DBfeed[0][i];
        var tweetDB = DBfeed[2][i];
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
  }

}
