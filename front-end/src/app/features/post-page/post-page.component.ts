import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { HttpClient } from '@angular/common/http';
import { TweetService } from '../../core/tweet-service';
import { Notification, Post, Profile } from '../../core/data';
import { FormBuilder,Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
})
export class PostPageComponent extends CoreComponent{
  
  //needed to ensure when logging into a different account, correct data displays
  service_acc_name: string;
  pic: string;
  p_id: number;

  post: Post = new Post(0,null,'','', new Date(),'','',0,0,0,0);
  user: Profile = new Profile(null,null,'','','',0,0);

  comments: Post [] = [];
  commentUsers: Profile [] = [];
  arrs: any[] = []; //testing to feed into main component
  testArr: any[] = []; //need for focused tweet

  like_ids: number [];
  retweet_ids: number [];

  submit_flag: number = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted
  loadingFlag: boolean = true; //true if loading, false if not
  show_more_count: number = 0; //how many times show more has been clicked (needed to load more replies)
  noRepliesFlag: boolean = false; //if no replies, set flag
  
  tweetForm = this.formBuilder.group({
    text_content: ['', [Validators.maxLength(181)]],
    });

  constructor(authService: AuthService, route: ActivatedRoute, service: CoreService,public http: HttpClient, public tweetService: TweetService, public formBuilder: FormBuilder )
  {
    super(authService,route,service);
    this.service_acc_name = "";
    this.p_id = 0;
    this.pic = "";
    this.like_ids = [];
    this.retweet_ids = [];
  }

  ngOnInit()
  {
    this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";
    this.pic = sessionStorage.getItem('pic') ?? "badToken";
    //get post
    var arr = window.location.pathname.split("/");
    this.p_id = Number(arr.pop()) ?? 0;
    console.log("this.p_id: " + this.p_id)

    if (this.p_id == 0) //error
    {
      this.service.router.navigate(['tweeter/Error']);
    }
    else
    {
      //get like and retweet arrs
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
      // get post
      this.getDBPost();
    }
  }

  //gets all replies(from DB) and adds them to DBfeed array
  getDBCommentFeed()
  {
    let requestMessage =
    {
      'word': 'getReplies',
      'num': this.p_id, 
      'word3': String(this.show_more_count),
    };
    console.log("count: " + String(this.show_more_count))
      this.http.put(environment.apiUrl + "/tweet",requestMessage).subscribe((resultData: any)=>
      {
        if(resultData == 'Failed to Add' || resultData == 'No replies' || resultData == 'check is else')
          {
            console.log(resultData);
            this.testArr = [0]; //needed so profile modal works for post component instances created outside of loops
            this.loadingFlag = false;
            if(resultData == 'No replies')
            {
              this.noRepliesFlag = true;
              this.arrs[0] = []; //necessary
            }
            console.log('Unsuccessful data base retrieval');
          }
          else //Successful
          {
            this.convertReplyFeed(resultData[0],resultData[1]); // Post, User
            console.log('Successful data base retrieval');
          }
      });
  }

  //converts raw DB data into reply feed data (Post & Profile)
  convertReplyFeed(DBPostfeed: any [],DBUserfeed: any [] )
  {   
    let u = DBUserfeed;

    DBPostfeed.forEach((reply,index) => {

      var tweet = new Post(reply.id,u[index].pic?.image_url,u[index].username,u[index].acc_name,reply.date_created,reply.text_content,'',reply.comments, reply.retweets,reply.likes, reply.engagements);
      this.comments.push(tweet);
      var user = new Profile(u[index].pic?.image_url,u[index].header_pic?.image_url,u[index].username,u[index].acc_name,u[index].bio,u[index].following_count,u[index].follower_count);
      this.commentUsers.push(user);
      });

      this.arrs = [this.comments, this.commentUsers];
      this.testArr = [0]; //needed so profile modal works for post component instances created outside of loops
      this.loadingFlag = false;
  }

//using post id, gets post from DB and calls convert function and getDBCommentFeed()
getDBPost()
{
  
  let requestMessage =
  {
    'word': 'getPost',
    'num': this.p_id, 
  };

    this.http.put(environment.apiUrl + "/tweet",requestMessage).subscribe((resultData: any)=>
    {
      if(resultData == 'Failed to Add' || resultData == 'No post')
        {
          console.log(resultData);
          console.log('Unsuccessful data base retrieval');
          this.service.router.navigate(['tweeter/Error']); //if no post, theres nothing to display
        }
        else //Successful
        {
          console.log(resultData[0]); //post
          this.convertPost(resultData[0], resultData[1]); // post, user
          this.getDBCommentFeed();// gets and sets comment feed   old function this.createCommentFeed();
          console.log('Successful data base retrieval');
        }
    });
}
convertPost(DBpost: any, DBuser: any)
{   
    let p = DBpost;
    let u = DBuser;
    var tweet = new Post(p.id,u.pic?.image_url,u.username,u.acc_name,p.date_created,p.text_content,'',p.comments, p.retweets,p.likes, p.engagements)
    this.post = tweet;          
    var prof = new Profile(u.pic?.image_url,u.header_pic?.image_url,u.username,u.acc_name,u.bio,u.following_count,u.follower_count);
    this.user = prof;
    console.log("in convertPost: post: " + this.post + " user: " + this.user);
}

//called upon 'reply' button click performs a form validation and sends tweet to backend, if it passes
postClick(reply_id: number)
  {
    let image_content = "";
    
    if(this.tweetService.tweetValidated(this.tweetForm.value.text_content?? '',image_content))
      {
        this.submit_flag = 2;
        this.tweetService.postTweet(this.service_acc_name,this.tweetForm.value.text_content?? '',image_content,reply_id);
        this.tweetForm.reset();
      }
    else
      {
        this.submit_flag = 1;
      }
  }

  //styles reply text input based upon validity
  isValidInput()
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
  //add up to 10 more reply tweets to thread
  handleMoreRepliesClick()
  {
    console.log("getting more replies");

    if(this.comments.length == (this.show_more_count+1)*10)
    {
      this.show_more_count++; //only increase if theres a mulitiple of 10
      this.getDBCommentFeed();
    }
    else
    {
      this.getDBCommentFeed();
    }   
  }
}
