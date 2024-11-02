import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { HttpClient } from '@angular/common/http';
import { TweetService } from '../../core/tweet-service';
import { Notification2, Post, Profile } from '../../core/data';
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
  
  DBfeed: any [] = [];
  comments: Post [] = [];
  arrs: any[] = []; //testing to feed into main component

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
      // get post
      this.getDBPost();
    }
    
  }



  //gets all replies(from DB) and adds them to DBfeed array
  //**** NOT IMPLEMENTED YET IN BACKEND */
  getDBCommentFeed()
  {
    let requestMessage =
    {
      'word': 'getComments',
      'word2': this.post.id, 
    };
      this.http.put("http://127.0.0.1:8000/tweet",requestMessage).subscribe((resultData: any)=>
      {
        if(resultData == 'Failed to Add' || resultData == 'No comments' || resultData == 'check is else')
          {
            console.log(resultData);
            this.DBfeed = [];
            console.log('Unsuccessful data base retrieval');
          }
          else //Successful
          {
            this.DBfeed = resultData;
            console.log(this.DBfeed);
            this.convertCommentFeed();
            console.log('Successful data base retrieval');
          }
      });
  }


  convertCommentFeed()
  {   
    this.DBfeed.forEach(comment => {
      var tweet = new Post(comment.id,comment.pic,comment.username,comment.acc_name,comment.date_created,comment.text_content,'',comment.comments, comment.retweets,comment.likes, comment.engagements)
        this.comments.push(tweet);
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
          globalObj.arrs = [globalObj.comments];
          resolve('we checked');
        }, 100) // 1 sec
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
          console.log('Unsuccessful data base retrieval');
          this.service.router.navigate(['tweeter/Error']); //if no post, theres nothing to display
        }
        else //Successful
        {
          this.DBpost = resultData;
          console.log(this.DBpost);
          this.convertPost();
          //this.createCommentFeed();
          console.log('Successful data base retrieval');
        }
    });
}
convertPost()
{   
    let p = this.DBpost[0];
    let u = this.DBpost[1];
    var tweet = new Post(p.id,u.pic,u.username,u.acc_name,p.date_created,p.text_content,'',p.comments, p.retweets,p.likes, p.engagements)
    this.post = tweet;
}

//i dont think i need this
createPost()
{
  let globalObj = this;

      const postPromise = new Promise<any>(function (resolve, reject) {
        setTimeout(() => {
          reject("We didn't get a response")
        }, 5000) // 5 secs

        setTimeout(() => {
          globalObj.getDBPost();
          resolve('we got a response');
        }, 0) // 0 secs
      })

      const postPromise2 = new Promise<any>(function (resolve, reject) {
        setTimeout(() => {
          reject("We didn't check")
        }, 10000) //8 secs

        setTimeout(() => {
          globalObj.convertPost();
          resolve('we checked');
        }, 500) // 0.5 sec
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

postClick()
  {
    let image_content = "";
    this.tweetService.postTweet(this.service.acc_name,this.tweetForm.value.text_content?? '',image_content);
    
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
