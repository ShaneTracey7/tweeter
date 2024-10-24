import { Component, Input} from '@angular/core';
import { HomePageComponent } from '../home-page.component';
import { Post, Profile, createAllProfiles, getProfile } from '../../../core/data';
import { MainContentComponent } from '../../../shared/components/main-content/main-content.component';


@Component({

  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: '../home-page.component.scss',

})
export class PostComponent extends HomePageComponent{

@Input () post = new Post(0,'','','',new Date,'','',0,0,0,0);

@Input() mcc:MainContentComponent = new MainContentComponent(this.tweetService,this.service,this.authService,this.route);
//@Input() hpc: HomePageComponent = new HomePageComponent(this.authService,this.route,this.service,this.http,this.tweetService,this.formBuilder)
@Input() upc: any = '';
show_modal: boolean = false;
modal_profile = new Profile('','','','',0,0);
timer:any;
liked: boolean = false; // true: if post is liked, false: if post isn't liked
postLikeArr: number [] = [];

retweeted: boolean = false;
postRetweetArr: number [] = [];

like_count: number = 0; //test 

fromRefresh: boolean = false;

override ngOnInit(): void {
  //check if liked or retweeted
  //this.checkLiked()
  console.log("**ngOnInit**");

  this.setPost()

  console.log("POST: "+ this.post);
}

setPost()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.checkLiked();
            resolve('we got a response');
          }, 300) // 0 secs

        })
        const postPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.checkRetweeted();
            resolve('we got a response');
          }, 300) // 0 secs

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
          //console.log("end of myAsync");
        }
        myAsync();
  }

checkLiked()
{
  /*
  if (this.service.cp_style == "Home")
  {
  //trying to fix inaccurate like counts in posts between home and profile page tweet arrs
      console.log("this.upc.last_like_ids : " + this.upc.last_like_ids  + " this.upc.like_ids: " + this.upc.like_ids);
    if ((JSON.stringify(this.upc.last_like_ids)) != (JSON.stringify(this.upc.like_ids)) )
    {
      console.log(this.upc.last_like_ids  + " != " + this.upc.like_ids);
      //need to adjust like counter
      const dif1 = 
      this.upc.last_like_ids.filter((element:number) => !this.upc.like_ids.includes(element));

      const dif2 = 
      this.upc.like_ids.filter((element: number) => !this.upc.last_like_ids .includes(element));

      if (dif1.includes(this.post.id))
      {
        //increment post 'like' value in class 
        this.post.likes = String(Number(this.post.likes) - 1);
      }
      if (dif2.includes(this.post.id))
      {
        //increment post 'like' value in class 
        this.post.likes = String(Number(this.post.likes) + 1);
      }
    }
  }*/
  //console.log("post dblikes:" + this.tweetService.DBlikes);
  //console.log("post hpc like_ids:" + this.upc.like_ids);
 if(this.upc.like_ids.includes(this.post.id)) //result from DB check or check through list of users likes
 {
  this.liked = true;
 // console.log("this.liked: " + this.liked);
 }
 else
 {
  this.liked = false;
 // console.log("this.liked: " + this.liked);
 }

 this.postLikeArr = this.upc.like_ids;
 //console.log("this.postLikeArr: " + this.postLikeArr);

}

checkRetweeted()
{
  if(this.upc.retweet_ids.includes(this.post.id)) //result from DB check or check through list of users likes
 {
  this.retweeted = true;
 }
 else
 {
  this.retweeted = false;
 }

 this.postRetweetArr = this.upc.retweet_ids;
}

//called upon hitting retweet button
handleRetweet()
{ 
  if(this.service.current_tab == 'retweets')
  {
    return;
  }
  if (!this.retweeted) // not retweeted
  {
    //change 'retweet' icon to a filled in retweet
    this.retweeted = true;

    //increment post 'retweet' value in class 
    this.post.retweets = String(Number(this.post.retweets) + 1);
    
    //add retweet to DB & update 'retweet' column of 'tweet' in DB
    //& add retweet notification to DB
    let requestBody =
    {
      "word" : this.upc.service_acc_name, //user_from
      "num" : this.post.id, //tweet id
      //new 
      "word2" : this.post.acc_name, //user_to
    };
    console.log("this.hpc.service_acc_name: " +this.upc.service_acc_name);
    console.log("this.post.id: " + this.post.id);

    this.http.post("http://127.0.0.1:8000/retweet",requestBody).subscribe((resultData: any)=>
    {
        //console.log(resultData);
    
        if(resultData == "Failed to Add")
        {
          console.log(resultData);
        }
      else // "Added Successfully"
        {
          console.log(resultData);
        }
    });

  }
  else //undo retweet
  {
    //change 'retweet' icon to a filled in retweet
    this.retweeted = false;

    //decrement post 'retweet' value in class 
    this.post.retweets = String(Number(this.post.retweets) - 1);

    //delete like to DB & update 'retweet' column of 'tweet' in DB
    // & delete retweet notification to DB
    let requestBody =
    {
      "word" : 'delete',
      "word2" : this.upc.service_acc_name, //user_from
      "num" : this.post.id, //tweet id (set to 0 if follow)
      //new
      "word3" : this.post.acc_name, //user_to
    };
    console.log("this.post.id: " + this.post.id);

    this.http.put("http://127.0.0.1:8000/retweet",requestBody).subscribe((resultData: any)=>
    {
      //console.log(resultData);

      if(resultData == "Deleted Successfully")
      {
        console.log(resultData);
      }
      else // "Failed to Add"
      {
      console.log(resultData);
      }
  });
  }
}

//called upon hitting like button
handleLike()
{ 
  if(this.service.current_tab == 'likes')
  {
    return;
  }
  if (!this.liked) // not liked 
  {
    //change like icon to a filled in red heart
    this.liked = true;

    //increment post 'like' value in class 
    this.post.likes = String(Number(this.post.likes) + 1);
    this.like_count = (this.like_count + 1);
    
    //add like to DB & update 'like' column of 'tweet' in DB
    //& add 'like' notification to DB
    let requestBody =
    {
      "word" : this.upc.service_acc_name,
      "num" : this.post.id, //tweet id
      //new
      "word2" : this.post.acc_name, //user_to
    };
    console.log("this.hpc.service_acc_name: " +this.upc.service_acc_name);
    console.log("this.post.id: " + this.post.id);

    this.http.post("http://127.0.0.1:8000/like",requestBody).subscribe((resultData: any)=>
    {
        //console.log(resultData);
    
        if(resultData == "Failed to Add")
        {
          console.log(resultData);
        }
      else // "Added Successfully"
        {
          console.log(resultData);
        }
    });
  }
  else //unlike
  {
    //change like icon to a filled in red heart
    this.liked = false;

    //decrement post 'like' value in class 
    this.post.likes = String(Number(this.post.likes) - 1);
    this.like_count = (this.like_count - 1);

    //delete like to DB & update 'like' column of 'tweet' in DB
    let requestBody =
    {
      "word" : 'delete',
      "word2" : this.upc.service_acc_name,
      "num" : this.post.id, //tweet id
      //new
      "word3" : this.post.acc_name, //user_to
    };
    console.log("this.post.id: " + this.post.id);

    this.http.put("http://127.0.0.1:8000/like",requestBody).subscribe((resultData: any)=>
    {
      //console.log(resultData);

      if(resultData == "Deleted Successfully")
      {
        console.log(resultData);
      }
      else // "Failed to Add"
      {
      console.log(resultData);
      }
  });

  }

   //add 'like' notitication to DB

}


showDeltaDate()
{

  // Time Difference in Milliseconds

let start = new Date(this.post.e_time).getTime()
let d = new Date(this.post.e_time);
let current = new Date().getTime();

const milliDiff: number = current - start;

const totalSeconds = Math.floor(milliDiff / 1000);
const totalMinutes = Math.floor(totalSeconds / 60);
const totalHours = Math.floor(totalMinutes / 60);
const totalDays = Math.floor(totalHours / 24);
if (totalMinutes < 60)
  {
    return totalMinutes + "m";
  }
else if(totalHours < 24)
  {
    return totalHours + "h";
  }
else if(totalDays < 7)
  {
    return totalDays + "d";
  }
else
  {
    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
  }
}

showModal(post: Post, obj:PostComponent)
  {
    obj.timer = setTimeout( function(){
      //insert logic here
      if(obj.show_modal || obj.mcc.openmodal)
        {
          console.log("show: " + obj.show_modal + " openModal: " + obj.mcc.openmodal);
        }
        else
        {
          obj.modal_profile = new Profile(post.profile, post.username,post.acc_name,'bio',0,0);
          obj.show_modal = true;
          obj.mcc.changeOpenModal(true);
        }

    }, 1000);

    //timer;
    // cancel it immediately so it will never run
    //clearTimeout(timer);

  }
  //prevents modal from appearing if mouse isnt over profile pic long enough
  hideModal(timer:any)
  {
    clearTimeout(timer);
  }

/*
showModal(username: string)
  {

   this.modal_profile = getProfile(username, createAllProfiles());
   this.show_modal = true;
  }

hideModal()
  {
    this.show_modal = false;
  }
*/
colorReactionBarHeart(str: string) {

  if(this.liked)
    {
      return this.service.setUrl(str + "-color-fill.png");
    }
  else if (this.reaction == str) 
    {
      return this.service.setUrl(str + "-color.png");
    }
  else
  {
    return this.service.setUrl(str + ".png");
  }
}
colorReactionBarRetweet(str: string) {

  if(this.retweeted)
    {
      return this.service.setUrl(str + "-color-fill.png");
    }
  else if (this.reaction == str) 
    {
      return this.service.setUrl(str + "-color.png");
    }
  else
  {
    return this.service.setUrl(str + ".png");
  }
}
colorReactionBarIcon(str: string) {

  if (this.reaction == str) {
    return this.service.setUrl(str + "-color.png");
  }
  else{
    return this.service.setUrl(str + ".png");
  }
}

  colorReaction(str: string)
  {
    this.reaction = str;
  }

grayReaction()
  {
    this.reaction = "";
  }
 
}
