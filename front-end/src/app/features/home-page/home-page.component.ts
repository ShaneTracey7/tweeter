import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { AuthService } from '../../core/auth.service'; 
import { HttpClient } from '@angular/common/http';
import { TweetService } from '../../core/tweet-service';
import { FormBuilder, Validators } from '@angular/forms';

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
  last_like_ids: number [];

constructor(authService: AuthService, route: ActivatedRoute, service: CoreService,public http: HttpClient, public tweetService: TweetService, public formBuilder: FormBuilder )
{
  super(authService,route,service);
  this.pic = "";
  this.service_acc_name = "";
  this.like_ids = [];
  this.last_like_ids = [];
}

//passed a hpc to post, so it's going off the correct instance

ngOnInit()
{
  console.log("DBlikes: " + this.tweetService.DBlikes)
  this.pic = localStorage.getItem('pic') ?? "badToken";
  this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";
  //this.tweetService.getLikeIDsDB(this.service_acc_name);
  this.setLiked();
  //console.log("HOMEPAGE INITIALIZED");
}

setLiked()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.last_like_ids = globalObj.tweetService.DBlikes; //NEW
            globalObj.tweetService.getLikeIDsDB(globalObj.service_acc_name);
            resolve('we got a response');
          }, 0) // 0 secs

        })
        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.like_ids = globalObj.tweetService.DBlikes;
            console.log("like_ids = " + globalObj.like_ids);
            resolve('we got a response');
          }, 200) // 0 secs

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
          //console.log("end of myAsync");
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

  postClick()
  {
    let image_content = "";
    this.getTweetService().postTweet(this.service.acc_name,this.tweetForm.value.text_content?? '',image_content);
    
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
/*
  id: string;  
  constructor(private router: Router, private authService: AuthService, public override route: ActivatedRoute, public override service: CoreService) {
    super(route, service);

    this.id = "";
  }  
  ngOnInit() {  
    this.id = localStorage.getItem('token') ?? "badToken";  
    console.log(this.id);  
  } 

  logout() {  
    console.log('logout');  
    this.authService.logout();  
    this.router.navigate(['/Login']);  
  } 
  */

  //using function from post instead
  colorReactionBarIcon2(str: string) {

    if (this.reaction == str) {
      return this.service.setUrl(str + "-color.png");
    }
    else{
      return this.service.setUrl(str + ".png");
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
  //#17BD69 (green)
  //FF4086 (red)
  /*
    setReaction(str: string)
    {
      const tmp = str;
      this.reaction = tmp;
    }
    */
}
