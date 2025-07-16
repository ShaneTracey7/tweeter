import { Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { HomePageComponent } from '../home-page.component';
import { Post, Profile, getProfile } from '../../../core/data';
import { MainContentComponent } from '../../../shared/components/main-content/main-content.component';
import { environment } from '../../../../environments/environment';

@Component({

  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: '../home-page.component.scss',

})
export class PostComponent extends HomePageComponent{

//new
@Input() inConvo = false; 




@Input () fparr = [0];
@Output() fparrChange = new EventEmitter<any[]>();

@Input () fp = new Post(0,'','','',new Date,'','',0,0,0,0); //focused post of post page component(only for reply thread posts)
@Output() fpChange = new EventEmitter<Post>();
@Input () fpuser = new Profile('','','','','',0,0); //NEW
@Output() fpuserChange = new EventEmitter<Profile>(); //NEW
@Input () comments: Post [] = []; //list of comments of post page component(only for reply thread posts)
@Output() commentsChange = new EventEmitter<Post[]>();
@Input () commentsusers: Profile [] = []; //NEW
@Output() commentsusersChange = new EventEmitter<Profile[]>(); //NEW
newComments: Post [] = [];
newCommentUsers: Profile [] = [];
DBUserfeed: any [] = [];
DBPostfeed: any [] = [];

@Input () user = new Profile(null,null,'','','',0,0);

@Input () post = new Post(0,'','','',new Date,'','',0,0,0,0);
@Input () focused = false; // true if post is being focused within post-page-component
@Input () inThread = false; // true if post is in thread within post-page-component
@Input() mcc:MainContentComponent = new MainContentComponent(this.tweetService,this.service,this.authService,this.route);
//@Input() hpc: HomePageComponent = new HomePageComponent(this.authService,this.route,this.service,this.http,this.tweetService,this.formBuilder)
@Input() upc: any = '';
show_modal: boolean = false;
modal_profile = new Profile('','','','','',0,0);
timer:any;
liked: boolean = false; // true: if post is liked, false: if post isn't liked
postLikeArr: number [] = [];

retweeted: boolean = false;
postRetweetArr: number [] = [];

like_count: number = 0; //test 

fromRefresh: boolean = false;

showShareModal: boolean = false;

showNewMessageModal: boolean = false;

//testArr: any [] = []; //needed to force profile modal to work right

override ngOnInit(): void {
  //check if liked or retweeted
  //this.checkLiked()
  console.log("**ngOnInit**");

  //this.testArr = [0];
  if(!this.inConvo)
  {
    this.setPost();
  }
  

  this.modal_profile = this.user; //NEW

  console.log("POST: "+ this.post);
  console.log("USER: " + this.user);
}

ngOnChanges(changes: SimpleChanges){
  
  if(!this.inConvo)
  {
    if (changes['post']) {
      console.log("**ngOnChanges**");
      this.setPost();
      console.log("POST: "+ this.post);
    }
    if (changes['user']){
      console.log("**ngOnChanges**");
      //this.testArr = [1];
      console.log("USER: "+ this.user);
    }
  }
}

setPost()
  {
    let extraTime = 0;
    if(this.focused)
    {
      extraTime = 200;
    }
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.checkLiked();
            resolve('we got a response');
          }, 300 + extraTime) // 0 secs

        })
        const postPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.checkRetweeted();
            resolve('we got a response');
          }, 300 + extraTime) // 0 secs

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
  console.log("this.liked: " + this.liked);
 }
 else
 {
  this.liked = false;
  console.log("this.liked: " + this.liked);
 }

 this.postLikeArr = this.upc.like_ids;
 //console.log("this.postLikeArr: " + this.postLikeArr);

}

checkRetweeted()
{
  if(this.upc.retweet_ids.includes(this.post.id)) //result from DB check or check through list of users likes
 {
  this.retweeted = true;
  console.log("this.retweeted: " + this.retweeted);
 }
 else
 {
  this.retweeted = false;
  console.log("this.retweeted: " + this.retweeted);
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

    //add retweet id to core service
    this.service.Retweets.push(this.post.id) //tweet id

    //increment retweets value on post in feeds
    const tweetFY = this.service.ForYouFeed.find(tweet => tweet.id === this.post.id);
    if(tweetFY)
    {
      tweetFY.retweets = String(Number(tweetFY.retweets) + 1);
    }
    const tweetF = this.service.FollowFeed.find(tweet => tweet.id === this.post.id);
    if(tweetF)
    {
      tweetF.retweets = String(Number(tweetF.retweets) + 1);
    }

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

    this.http.post(environment.apiUrl + "/retweet",requestBody).subscribe((resultData: any)=>
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

    //remove retweet id from core service
    const index = this.service.Retweets.indexOf(this.post.id); //tweet id
    if (index !== -1) {
      this.service.Retweets.splice(index, 1);
    }

    //decrement retweets value on post in feeds
    const tweetFY = this.service.ForYouFeed.find(tweet => tweet.id === this.post.id);
    if(tweetFY)
    {
      tweetFY.retweets = String(Number(tweetFY.retweets) - 1);
    }
    const tweetF = this.service.FollowFeed.find(tweet => tweet.id === this.post.id);
    if(tweetF)
    {
      tweetF.retweets = String(Number(tweetF.retweets) - 1);
    }

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

    this.http.put(environment.apiUrl + "/retweet",requestBody).subscribe((resultData: any)=>
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

    //add like id to core service
    this.service.Likes.push(this.post.id) //tweet id

    //increment likes value on post in feeds
    const tweetFY = this.service.ForYouFeed.find(tweet => tweet.id === this.post.id);
    if(tweetFY)
    {
      tweetFY.likes = String(Number(tweetFY.likes) + 1);
    }
    const tweetF = this.service.FollowFeed.find(tweet => tweet.id === this.post.id);
    if(tweetF)
    {
      tweetF.likes = String(Number(tweetF.likes) + 1);
    }
    

    //increment post 'like' value in class (needed to see temp change on page)
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

    this.http.post(environment.apiUrl + "/like",requestBody).subscribe((resultData: any)=>
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

    //remove like id from core service
    const index = this.service.Likes.indexOf(this.post.id); //tweet id
    if (index !== -1) {
      this.service.Likes.splice(index, 1);
    }

    //decrement likes value on post in feeds
    const tweetFY = this.service.ForYouFeed.find(tweet => tweet.id === this.post.id);
    if(tweetFY)
    {
      tweetFY.likes = String(Number(tweetFY.likes) - 1);
    }
    const tweetF = this.service.FollowFeed.find(tweet => tweet.id === this.post.id);
    if(tweetF)
    {
      tweetF.likes = String(Number(tweetF.likes) - 1);
    }

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

    this.http.put(environment.apiUrl + "/like",requestBody).subscribe((resultData: any)=>
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

showTimeAndDate()
{
  let date = new Date(this.post.e_time);
  let hours = date.getHours();
  let mins =date.getMinutes();
  let month = date.getMonth();
  let day = date.getDate();
  let year = date.getFullYear();
  
  let month_str;
  switch(month)
  {
    case 0: month_str = "Jan ";break;
    case 1: month_str = "Feb " ;break;
    case 2: month_str = "Mar " ;break;
    case 3: month_str = "Apr " ;break;
    case 4: month_str = "May " ;break;
    case 5: month_str = "Jun " ;break;
    case 6: month_str = "Jul " ;break;
    case 7: month_str = "Aug " ;break;
    case 8: month_str = "Sep " ;break;
    case 9: month_str = "Oct " ;break;
    case 10: month_str = "Nov " ;break;
    case 11: month_str = "Dec " ;break;
  }

  let meridiem;
  if(hours > 11)
  {
    meridiem = " PM";
    if (hours != 12)
    {
      hours = hours - 12;
    }
  }
  else
  {
    if (hours == 0)
    {
      hours = 12;
    }
    
    meridiem = " AM";
  }

  return hours + ":" + (mins > 9 ? mins : "0"+ mins) + meridiem + " . " + month_str + day + ", " + year + " . ";
}

showDeltaDate()
{

  // Time Difference in Milliseconds

let start = new Date(this.post.e_time).getTime();
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

    let globalObj =this;

    obj.timer = setTimeout( function(){
      //insert logic here
      if(obj.show_modal || obj.mcc.openmodal)
        {
          console.log("show: " + obj.show_modal + " openModal: " + obj.mcc.openmodal);
        }
        else
        {
          console.log("obj.user: " + obj.user); //new
          console.log("this.user: " + globalObj.user); //new
          //obj.modal_profile = new Profile(post.profile, post.username,post.acc_name,'bio',0,0);
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
 
  handlePostClick()
  {
    if(this.focused)
    {
      console.log("Already on post page");
    }
    else if(this.inThread)
    {
      //increment post views in db
      this.incrementPostView()

      console.log("switching focused post");
      this.inThread = false;
      //this.focused = true;
      this.setNewPostPageData();
    }
    else
    {
      //increment post views in db
      this.incrementPostView()

      console.log("going to post page");
      var route = '/tweeter/Post/' + this.post.id;
      this.service.router.navigate([route]); 
    }
    
  }
  handleCommentClick()
  {
    if(this.focused)
      {
        console.log("Already on post page");
      }
      else if(this.inThread)
      {
        console.log("switching focused post");
        this.inThread = false;
        //this.focused = true;
        this.setNewPostPageData();
      }
      else
      {
        console.log("going to post page");
        var route = '/tweeter/Post/' + this.post.id;
        this.service.router.navigate([route]); 
      }
  }

  handleSendDMClick()
  {
    //needs to open new message modal
    this.showNewMessageModal = true;
    this.showShareModal = false;
    
  }
  handleCopyTextClick()
  {
    //will not work when i host on github pages(would need to fix then)
    let url = environment.frontEndUrl + '/tweeter/Post/' + this.post.id
    // Copy the text inside the text field
    navigator.clipboard.writeText(url);
  }

  handleShareClick()
  {
    this.showShareModal = !this.showShareModal;
  }


  setNewPostPageData()
  {
    let globalObj = this;

      const postPromise = new Promise<any>(function (resolve, reject) {
        setTimeout(() => {
          reject("We didn't get a response")
        }, 5000) // 5 secs

        setTimeout(() => {
          //globalObj.setLiked();
          globalObj.getDBCommentFeed();
          resolve('we got a response');
        }, 0) // 0 secs
      })

      const postPromise2 = new Promise<any>(function (resolve, reject) {
        setTimeout(() => {
          reject("We didn't check")
        }, 10000) //8 secs

        setTimeout(() => {
          globalObj.commentsChange.emit(globalObj.newComments);
          globalObj.commentsusersChange.emit(globalObj.newCommentUsers); //NEW
          globalObj.fpChange.emit(globalObj.post);
          globalObj.fpuserChange.emit(globalObj.user); //NEW
          globalObj.fparrChange.emit([1]);
          var route = '/tweeter/Post/' + globalObj.post.id;
          globalObj.service.router.navigate([route]); 
          resolve('we checked');
        }, 1000) // 1 sec
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
  //gets all replies(from DB) and adds them to DBfeed array
  getDBCommentFeed()
  {
    let requestMessage =
    {
      'word': 'getReplies',
      'num': this.post.id, 
    };
      this.http.put(environment.apiUrl + "/tweet",requestMessage).subscribe((resultData: any)=>
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
  incrementPostView()
  {
    let requestMessage =
    {
      'word': 'incrementPostView',
      'num': this.post.id, 
    };
      this.http.put(environment.apiUrl + "/tweet",requestMessage).subscribe((resultData: any)=>
      {
        console.log(resultData);
      });
  }

  convertReplyFeed()
  {   
    let u = this.DBUserfeed;

    this.DBPostfeed.forEach((reply,index) => {

      var tweet = new Post(reply.id,u[index].pic?.image_url,u[index].username,u[index].acc_name,reply.date_created,reply.text_content,'',reply.comments, reply.retweets,reply.likes, reply.engagements);
        this.newComments.push(tweet);
      var user = new Profile(u[index].pic?.image_url,u[index].header_pic?.image_url,u[index].username,u[index].acc_name,u[index].bio,u[index].following_count,u[index].follower_count);
        this.newCommentUsers.push(user);
      });
  }


}
