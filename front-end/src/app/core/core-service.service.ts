import { Injectable} from "@angular/core";
import { Profile, Post, getImgUrl, getHeaderImgUrl, getProfileImgUrl } from "./data";
import { ActivatedRoute, Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
//@Injectable()
@Injectable({
  providedIn: 'root',
})
export class CoreService {

  /*
  -Not having Notifications or Messages globally stored
  -need to store 4 profile feeds
  */



     //used for toolbar tabs
  marker1= true; //foryou/all/latest
  marker2= false; //following/trending/verified/people
  marker3= false;//mentions/news/media
  marker4= false;//sports
  marker5= false;//entertainment

  current_tab: string = ""; //tab that user is on
  current_page: string =  ""; //page that is being displayed
  cp_style: string = ""; //page that is being displayed (for styling purposes)

  username: string; //logged-in user's username
  acc_name: string; //logged-in user's account name (or @)

  //will need to rename this for 'who to follow' pane
  DBUsers: any [] = []; //raw array of all Users from DB
  UserFeed: Profile [] = [];//array of Profile objs of all users

  shareID: number = 0; //post id of tweet to send
  shareUser: string = ''; //acc_name of user to send tweet to

  /* * * *Global cache* * * */

  //Home
  ForYouFeed: Post [] = []; //array of Post objs of ForYou feed
  ForYouUserFeed: Profile [] = []; //array of Profile objs of users in ForYou feed
  FollowFeed: Post [] = []; //array of Post objs of Follow feed
  FollowUserFeed: Profile [] = []; //array of Profile objs of users in Follow feed

  //Profile,Explore, and Home
  Likes: any = null; //array of ids
  Retweets: any  = null; //array of ids

  //Home, Explore, Notification, Messages, and Profile
  UserFollowingList: string [] = []; //array of acc_names of accounts that the user is following

  //Profile (non of these are set yet)
  ProfilePostsFeed: Post [] = []; //array of Post objs of Profile Posts feed
  ProfilePostsUserFeed: Profile [] = []; //array of Profile objs of Profile Posts feed
  ProfileRetweetsFeed: Post [] = []; //array of Post objs of Profile Retweets feed
  ProfileRetweetsUserFeed: Profile [] = []; //array of Profile objs of Profile Retweets feed
  ProfileMediaFeed: Post [] = []; //array of Post objs of Profile Media feed
  ProfileMediaUserFeed: Profile [] = []; //array of Profile objs of Profile Media feed
  ProfileLikesFeed: Post [] = []; //array of Post objs of Profile Likes feed
  ProfileLikesUserFeed: Profile [] = []; //array of Profile objs of Profile Likes feed

  //runs only once until a page refresh
  constructor(public route: ActivatedRoute, public router: Router,public http: HttpClient) { 
  
    this.username = sessionStorage.getItem('username') ?? "badToken"; 
    this.acc_name = sessionStorage.getItem('acc_name') ?? "badToken";
    this.createUserFeed(false, "");

    this.getFollowingList();
    console.log("inside core service constructor");

  }
  //for notification but others as well (moving from main component)
  //to ensure only one modal is visible at a time (global variable)
  openmodal: boolean = false;

  changeOpenModal(newValue: boolean){
    this.openmodal = newValue;
    console.log(this.openmodal);
  }

  reset() {
  this.marker1= true; 
  this.marker2= false;
  this.marker3= false;
  this.marker4= false;
  this.marker5= false;
  this.current_tab = ""; 
  this.current_page =  ""; 
  this.cp_style = ""; 
  this.username = ""; 
  this.acc_name = ""; 
  this.DBUsers = []; 
  this.UserFeed = [];
  this.ForYouFeed = []; 
  this.ForYouUserFeed = []; 
  this.FollowFeed = []; 
  this.FollowUserFeed = []; 
  this.Likes= null; 
  this.Retweets = null;
  this.shareID = 0; 
  this.shareUser= ""; 
  this.UserFollowingList = [];
}
  //don't think this is doing anything
  ngOnDestroy()
  {
    sessionStorage.clear();
    console.log("ngOnDestroy called in core service");
  }

  setUrl(str: string | null)
  {
    return getImgUrl(str);
  }
  setProfileUrl(str: string | null)
  {
    return getProfileImgUrl(str);
  }
  setHeaderUrl(str: string | null)
  {
    return getHeaderImgUrl(str);
  }
  // sets the current page value and selects the first tab
  setCurrentPage(str: string)
  {
    const tmp = str;
    this.current_page = tmp;//new
    this.cp_style = tmp;
    this.marker1= true; 
    this.marker2= false;
    this.marker3= false; 
    this.marker4= false; 
    this.marker5= false; 

    console.log("logging page: " + this.current_page);
  }


  //sets correct image (bold or normal) for navbar buttons
  boldNavbarIcon(str: string) {
    var check;

    switch(str)
    {
      case "house": check="Home";break;
      case "magnifier": check="Explore";break;
      case "envelope": check="Messages";break;
      case "bell": check="Notifications";break;
      case "user": check="Profile";break;
    }

    //console.log("Check inside boldNavbarIcon cp_style: " + this.cp_style)
    if (this.cp_style == check) {
      return this.setUrl(str + "-fill.svg");
    }
    else if(this.cp_style == 'OtherExplore' && str == 'Explore')
      {
        return this.setUrl(str + "-fill.svg");
      }
    else{
      return this.setUrl(str + ".svg");
    }
  }

  //sets correct font styling (bold or normal) for navbar buttons
  boldNavbarItem(str: string) {
    if (this.cp_style == str) {
      return {
        fontWeight: 'bold',
      };
    }
    else if(this.cp_style == 'OtherExplore' && str == 'Explore')
      {
        return {
          fontWeight: 'bold',
        };
      }
    else{
      return{
        fontWeight: 'normal'
      }
    }
  }

//sets the current tab and which tab should be focused (has the blue marker visible)
routeToChild(str: string){
  
    this.current_tab = str;
    if (str == "foryou" || str == "all" || str == "posts" || str == 'followers'|| str == 'latest')
      {
        this.marker1= true; 
        this.marker2= false;
        this.marker3= false; 
        this.marker4= false; 
        this.marker5= false; 
      }
    else if(str == "following" || str == "trending" || str == "verified" || str == "retweets" || str == 'people')//|| str == "replies")
      {
        this.marker1= false; 
        this.marker2= true;
        this.marker3= false; 
        this.marker4= false; 
        this.marker5= false; 
      }
    else if(str == "mentions" || str == "news" || str == "media")
      {
        this.marker1= false; 
        this.marker2= false;
        this.marker3= true; 
        this.marker4= false; 
        this.marker5= false; 
      }
    else if(str == "sports" || str == "likes")
      {
        this.marker1= false; 
        this.marker2= false;
        this.marker3= false; 
        this.marker4= true; 
        this.marker5= false; 
      }
    else if(str == "entertainment")
      {
        this.marker1= false; 
        this.marker2= false;
        this.marker3= false; 
        this.marker4= false; 
        this.marker5= true; 
      }
    else
      {
        this.marker1= false; 
        this.marker2= false;
        this.marker3= false; 
        this.marker4= false; 
        this.marker5= false; 
      }
      
  }

  //styles tab text when selected
  getMarkerStyles(num: Number) {
    var marker;

    switch(num)
    {
      case 1: marker = this.marker1;break;
      case 2: marker = this.marker2;break;
      case 3: marker = this.marker3;break;
      case 4: marker = this.marker4;break;
      case 5: marker = this.marker5;break;
    }

    if (marker) {
      return {
        color: 'black',
        outline: 'none',
        fontWeight: 'bold',
      };
    }
    else{
      return{
        color: 'rgb(97, 110, 124)',
        fontWeight: 500
      }
    }
  }

  //displays tab marker (blue line) when selected
  displayMarker(num: Number)
  {
    var marker;

    switch(num)
    {
      case 1: marker = this.marker1;break;
      case 2: marker = this.marker2;break;
      case 3: marker = this.marker3;break;
      case 4: marker = this.marker4;break;
      case 5: marker = this.marker5;break;
    }

    if (marker) {
      return {
        display: 'block',
      };
    }
    else{
      return{
        display: 'none',
      }
    }
  }

//gets all users(from DB) and adds them to DBUsers array
/* * * * * * * Not in use inside this service * * * * * * */
getAllDBUsers()
{
    this.http.get(environment.apiUrl + "/user").subscribe((resultData: any)=>
    {
        //console.log(resultData);
        this.DBUsers = resultData;
    });
}

//creates Profile objects using data from DBUsers and adds them to UserFeed array
/* * * * * * * Not in use inside this service * * * * * * */
convertUserFeed(current_user_acc_name: string)
{   
  //current_user_acc_name

  //clear UserFeed
  this.UserFeed = [];

  //reverse order
  this.DBUsers.reverse();

  let counter = 0;

  for (let i = 0; i < this.DBUsers.length;i++) {
    let user = this.DBUsers[i];
    
    if(user.acc_name != current_user_acc_name) //this is issue current_user_acc_name =this.acc_name
      {
        var u = new Profile(user.pic?.image_url,user.header_pic?.image_url, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
        this.UserFeed.push(u);
        counter++;
      }
    if (counter == 3)
      {
        i = this.DBUsers.length; //breaks loop
      }
  }
}

async getDBFollowFeed(acc_name: string | null): Promise<{feed: Post[] , userFeed: Profile[] }> {

  try {
    const requestBody = {
        "word": 'getFollowFeed',
        "word2": acc_name,
      };
    const tweetResponse = await firstValueFrom(this.http.put<any>(environment.apiUrl + "/tweet", requestBody));//need to change

    if (tweetResponse === "No tweets") {
      this.FollowFeed = [];
      this.FollowUserFeed = [];
      return { feed: [], userFeed: [] };
    }

    let DBfeed = tweetResponse;
    //clear existing feeds
    this.FollowFeed = [];
    this.FollowUserFeed = [];

    const users = DBfeed.map((tweet:any) => {
      const requestBody2 = {
        word: 'w',
        num: tweet.user.id,
      };
      return firstValueFrom(this.http.put<any>(environment.apiUrl + "/tweet", requestBody2));
    });

    const userResults = await Promise.all(users);

    userResults.forEach((userData, index) => {

      const u = new Profile(userData.pic?.image_url,userData.header_pic?.image_url,userData.username,userData.acc_name,userData.bio,userData.following_count,userData.follower_count);
      this.FollowUserFeed.push(u);

      const p = new Post(DBfeed[index].id,u.pic ?? null,u.username,u.acc_name,DBfeed[index].date_created,DBfeed[index].text_content,'',DBfeed[index].comments.toString(),DBfeed[index].retweets.toString(),DBfeed[index].likes.toString(),DBfeed[index].engagements.toString());
      this.FollowFeed.push(p);
    });

    return { feed: this.FollowFeed, userFeed: this.FollowUserFeed};
  } 
  catch (error) {
    console.error("Error loading For You feed:", error);
    return { feed: [], userFeed: [] };
  }
}

async getDBForYouFeed(): Promise<{feed: Post[] , userFeed: Profile[] }> {

  try {
    const tweetResponse = await firstValueFrom(this.http.get<any>(environment.apiUrl + "/tweet"));

    if (tweetResponse === "No tweets") {
      this.ForYouFeed = [];
      this.ForYouUserFeed = [];
      return { feed: [], userFeed: [] };
    }

    let DBfeed = tweetResponse;
    //clear existing feeds
    this.ForYouFeed = [];
    this.ForYouUserFeed = [];

    const users = DBfeed.map((tweet:any) => {
      const requestBody = {
        word: 'w',
        num: tweet.user.id,
      };
      return firstValueFrom(this.http.put<any>(environment.apiUrl + "/tweet", requestBody));
    });

    const userResults = await Promise.all(users);

    userResults.forEach((userData, index) => {

      const u = new Profile(userData.pic?.image_url,userData.header_pic?.image_url,userData.username,userData.acc_name,userData.bio,userData.following_count,userData.follower_count);
      this.ForYouUserFeed.push(u);

      const p = new Post(DBfeed[index].id,u.pic ?? null,u.username,u.acc_name,DBfeed[index].date_created,DBfeed[index].text_content,'',DBfeed[index].comments.toString(),DBfeed[index].retweets.toString(),DBfeed[index].likes.toString(),DBfeed[index].engagements.toString());
      this.ForYouFeed.push(p);
    });

    return { feed: this.ForYouFeed, userFeed: this.ForYouUserFeed};
  } 
  catch (error) {
    console.error("Error loading For You feed:", error);
    return { feed: [], userFeed: [] };
  }
}


createUserFeed2(acc_name: string): Observable<any[]> {
  return this.http.get<any[]>(environment.apiUrl + "/user").pipe(
    map(resultData => {
      if (!resultData) {
        return [];
      }

      this.DBUsers = resultData;
      this.UserFeed = [];
      this.DBUsers.reverse();

      let counter = 0;
      for (let user of this.DBUsers) {
        if (user.acc_name !== acc_name) {
          const u = new Profile(
            user.pic?.image_url,
            user.header_pic?.image_url,
            user.username,
            user.acc_name,
            user.bio,
            user.following_count,
            user.follower_count
          );
          this.UserFeed.push(u);
          counter++;
        }
        if (counter === 3) break;
      }

      return this.UserFeed;
    })
  );
}

//NOT TESTED
getDBLikes(acc_name: string): Observable<any[]> {

  let requestMessage =
    {
      "word": 'getLikeIDs',
      "word2": acc_name, 
    }

  return this.http.put<any>(environment.apiUrl + "/like", requestMessage).pipe(
    map(resultData => {
      if (!resultData ) {
        this.Likes = [];
        return [];
      }
      else if (resultData == 'No like ids' || resultData == 'check is else'|| resultData == 'Failed to Add') {
        console.log("No like ids found");
        this.Likes = [];
        return [];
      }
      else
      {
        this.Likes = resultData;
        return resultData
      }
    })
  );
}
//NOT TESTED
getDBRetweets(acc_name: string): Observable<any[]> {

  let requestMessage =
    {
      "word": 'getRetweetIDs',
      "word2": acc_name, 
    }

  return this.http.put<any>(environment.apiUrl + "/retweet", requestMessage).pipe(
    map(resultData => {
      if (!resultData ) {
        this.Retweets = [];
        return [];
      }
      else if (resultData == 'No retweet ids' || resultData == 'check is else'|| resultData == 'Failed to Add') {
        console.log("No retweet ids found");
        this.Retweets = [];
        return [];
      }
      else
      {
        this.Retweets = resultData;
        return resultData
      }
    })
  );
}

//gets data for 'ForYou'feed, calls the 3 above functions using delays to ensure all the data is available, when accessed
createUserFeed(outsideOfService: boolean, acc_name: string)
  {
    var ac = "";
    if(outsideOfService)
    {
      ac = acc_name;
    }
    else
    {
      ac = this.acc_name;
    }
    if(ac == "" || ac == "badToken" || ac == null)
    {
        return; //if acc_name is not set, do not proceed
    }

    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.getAllDBUsers();
            resolve('we got a response');
          }, 0) // 0 secs
        })

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.convertUserFeed(ac);
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

  //gets array of accounts the user follows and create a list of their account names 
  getFollowingList()
  {
    if(this.acc_name != "" && this.acc_name != "badToken" && this.acc_name != null)
    {
      let requestBody =
      {
        "word" : "getFollowing",
        "word2" : this.acc_name,
      };

      this.http.put(environment.apiUrl + "/follow",requestBody).subscribe((resultData: any)=>
      {
        console.log(resultData);

        if(resultData == 'Failed to Add')
        {
          console.log("Error retrieving getFollowing info from DB")
        }
        else if(resultData == 'No following')
        {
          console.log("User isn't following any accounts")
        }
        else
        {
          resultData.forEach((user:any) => {
              this.UserFollowingList.push(user.acc_name)
            });
          
          console.log("this.UserFollowingList: " + this.UserFollowingList)
        }
      });
    }
    else
    {
      console.log("acc_name is not set, cannot get following");
    }
  }

//for components to call to check if their user is following an account
isFollower(acc_name: string)
{
  for(var i = 0; i < this.UserFollowingList.length; i++)
  {
    if(this.UserFollowingList[i] == acc_name)
    {
      return true;
    }
  }
  return false;
}

//gets all users from database (not in use, brought from signup modal)
  getAllUser()
  {
    this.http.get(environment.apiUrl + "/user")
    .subscribe((resultData: any)=>
    {
        console.log(resultData);
        //this.UserArray = resultData;
    });
  }


/* * * * * * * * * * * * * *functions for explore page * * * + * * * * * * * * * * */




}
