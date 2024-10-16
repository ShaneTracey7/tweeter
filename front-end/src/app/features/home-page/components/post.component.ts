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
liked: boolean = false;
retweeted: boolean = false;
postLikeArr: number [] = []

override ngOnInit(): void {
  //check if liked or retweeted
  //this.checkLiked()

  this.setLiked2()
}

setLiked2()
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
        async function myAsync(){
          //console.log("inside myAsync");
          try{
            postPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
          //console.log("end of myAsync");
        }
        myAsync();
  }


  //maybe the answer is here for like count not updating between profile and home
checkLiked()
{/*
  //trying to fix inaccurate like counts in posts between home and profile page tweet arrs
    console.log("this.upc.last_like_ids : " + this.upc.last_like_ids  + " this.upc.like_ids: " + this.upc.like_ids);
  if (this.upc.last_like_ids != this.upc.like_ids )
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

  }*/
  console.log("post dblikes:" + this.tweetService.DBlikes);
  console.log("post hpc like_ids:" + this.upc.like_ids);
 if(this.upc.like_ids.includes(this.post.id)) //result from DB check or check through list of users likes
 {
  this.liked = true;
  console.log("this.liked: " + this.liked);
 }
 else
 {
  this.liked = false;
  console.log("this.liked: " + this.liked);
 }

 this.postLikeArr = this.upc.like_ids;
 console.log("this.postLikeArr: " + this.postLikeArr);

}

//called upon hitting like button
handleLike()
{ 
  if (!this.liked) // not liked 
  {
    //change like icon to a filled in red heart
    this.liked = true;

    //increment post 'like' value in class 
    this.post.likes = String(Number(this.post.likes) + 1);
    
    //add like to DB & update 'like' column of 'tweet' in DB
    let requestBody =
    {
      "word" : this.upc.service_acc_name,
      "num" : this.post.id, //tweet id
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

    //delete like to DB & update 'like' column of 'tweet' in DB
    let requestBody =
    {
      "word" : 'delete',
      "word2" : this.upc.service_acc_name,
      "num" : this.post.id, //tweet id
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
