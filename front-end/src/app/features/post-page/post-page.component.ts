import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { HttpClient } from '@angular/common/http';
import { TweetService } from '../../core/tweet-service';
import { Notification, Post, Profile } from '../../core/data';
import { FormBuilder,Validators } from '@angular/forms';

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
  DBpost: any = '';
  post: Post = new Post(0,'','','', new Date(),'','',0,0,0,0);
  DBuser: any = '';
  user: Profile = new Profile('','','','','',0,0);
  DBUserfeed: any [] = [];
  DBPostfeed: any [] = [];

  comments: Post [] = [];
  commentUsers: Profile [] = [];
  arrs: any[] = []; //testing to feed into main component
  testArr: any[] = [];

  like_ids: number [];
  retweet_ids: number [];

  submit_flag: number  = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted
  
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
    this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";
    this.pic = localStorage.getItem('pic') ?? "badToken";
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
      this.setLikeAndRetweeted();
      // get post
      this.getDBPost();
    }
    
  }

  ngOnChanges()
  {

  }

  setLikeAndRetweeted()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            //globalObj.last_like_ids = globalObj.tweetService.DBlikes; //NEW
            globalObj.tweetService.getRetweetIDsDB(globalObj.service_acc_name);
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
            globalObj.retweet_ids = globalObj.tweetService.DBretweets;
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

  //gets all replies(from DB) and adds them to DBfeed array
  getDBCommentFeed()
  {
    let requestMessage =
    {
      'word': 'getReplies',
      'num': this.p_id, 
    };
      this.http.put("http://127.0.0.1:8000/tweet",requestMessage).subscribe((resultData: any)=>
      {
        if(resultData == 'Failed to Add' || resultData == 'No replies' || resultData == 'check is else')
          {
            console.log(resultData);
            this.DBUserfeed = [];
            this.DBPostfeed = [];
            console.log('Unsuccessful data base retrieval');
          }
          else //Successful
          {
            this.DBPostfeed = resultData[0];
            this.DBUserfeed = resultData[1];
            
            //this.DBfeed = resultData;
            //console.log(this.DBfeed);
            console.log(this.DBUserfeed);
            console.log(this.DBPostfeed);
            this.convertReplyFeed();
            console.log('Successful data base retrieval');
          }
      });
  }

  convertReplyFeed()
  {   
    let u = this.DBUserfeed;

    this.DBPostfeed.forEach((reply,index) => {

      var tweet = new Post(reply.id,u[index].pic,u[index].username,u[index].acc_name,reply.date_created,reply.text_content,'',reply.comments, reply.retweets,reply.likes, reply.engagements);
      this.comments.push(tweet);
      var user = new Profile(u[index].pic,u[index].header_pic,u[index].username,u[index].acc_name,u[index].bio,u[index].following_count,u[index].follower_count);
      this.commentUsers.push(user);
      });
  }

  createCommentFeed()
{
  let globalObj = this;

      const postPromise = new Promise<any>(function (resolve, reject) {
        setTimeout(() => {
          reject("We didn't get a response")
        }, 5000) // 5 secs

        setTimeout(() => {
          globalObj.getDBCommentFeed();
          resolve('we got a response');
        }, 500) // 0.5 secs
      })

      const checkPromise = new Promise<any>(function (resolve, reject) {
        setTimeout(() => {
          reject("We didn't check")
        }, 10000) //8 secs

        setTimeout(() => {
          globalObj.arrs = [globalObj.comments, globalObj.commentUsers];
          globalObj.testArr = [0]; //needed so profile modal works for post component instances created outside of loops
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

getDBPost()
{
  let requestMessage =
  {
    'word': 'getPost',
    'num': this.p_id, 
  };

    this.http.put("http://127.0.0.1:8000/tweet",requestMessage).subscribe((resultData: any)=>
    {
      if(resultData == 'Failed to Add' || resultData == 'No post')
        {
          console.log(resultData);
          this.DBpost = '';
          this.DBuser = '';
          console.log('Unsuccessful data base retrieval');
          this.service.router.navigate(['tweeter/Error']); //if no post, theres nothing to display
        }
        else //Successful
        {
          this.DBpost = resultData[0];
          this.DBuser = resultData[1];
          console.log(this.DBpost);
          this.convertPost();
          this.createCommentFeed();
          console.log('Successful data base retrieval');
        }
    });
}
convertPost()
{   
    let p = this.DBpost;
    let u = this.DBuser;
    var tweet = new Post(p.id,u.pic,u.username,u.acc_name,p.date_created,p.text_content,'',p.comments, p.retweets,p.likes, p.engagements)
    this.post = tweet;          
    var prof = new Profile(u.pic,u.header_pic,u.username,u.acc_name,u.bio,u.following_count,u.follower_count);
    //var prof = new Profile('pic','username','acc_name','bio',5,5);
    
    this.user = prof;

    console.log("u & p: " + u + " " + p);
    console.log("in convertPost: post: " + this.post + " user: " + this.user);
    //console.log("in convertPost: post: " + this.post + " user: " + this.user);
}


createPost()
{
  let globalObj = this;

      const postPromise = new Promise<any>(function (resolve, reject) {
        setTimeout(() => {
          reject("We didn't get a response")
        }, 5000) // 5 secs

        setTimeout(() => {
          //globalObj.setLiked();
          globalObj.setLikeAndRetweeted();
          resolve('we got a response');
        }, 0) // 0 secs
      })

      const postPromise2 = new Promise<any>(function (resolve, reject) {
        setTimeout(() => {
          reject("We didn't check")
        }, 10000) //8 secs

        setTimeout(() => {
          globalObj.getDBPost();
          resolve('we checked');
        }, 0) // 1 sec
      })
      
      async function myAsync(){
        //console.log("inside myAsync");
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

postClick(reply_id: number)
  {
    let image_content = "";
    this.tweetService.postTweet(this.service_acc_name,this.tweetForm.value.text_content?? '',image_content,reply_id);
    
    if(this.tweetService.tweetValidated(this.tweetForm.value.text_content?? '',image_content))
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

}
