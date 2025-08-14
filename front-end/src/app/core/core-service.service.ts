import { Injectable} from "@angular/core";
import { Profile, Post, getImgUrl, getHeaderImgUrl, getProfileImgUrl, SearchTopic,createSearchBarTopics } from "./data";
import { ActivatedRoute, Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

//@Injectable()
@Injectable({
  providedIn: 'root',
})
export class CoreService {

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
  //UserFeed: Profile [] = [];//array of Profile objs of all users

  shareID: number = 0; //post id of tweet to send
  shareUser: string = ''; //acc_name of user to send tweet to

  //needed to make sure navbar styling updates properly
  private cpStyleSubject = new BehaviorSubject<string>('');
  cp_style$ = this.cpStyleSubject.asObservable();

  /* * * *Global cache* * * */
  loggedInUser: Profile = new Profile(null,null,'','','',0,0);

  //Secondary Content
  WhoToFollowFeed: Profile [] = [];//array of Profile objs of suggested users who to follow users

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

  //Profile
  ProfilePostsFeed: Post [] | null= null; //array of Post objs of Profile Posts feed
  ProfilePostsUserFeed: Profile [] = []; //array of Profile objs of Profile Posts feed
  ProfileRetweetsFeed: Post [] = []; //array of Post objs of Profile Retweets feed
  ProfileRetweetsUserFeed: Profile [] = []; //array of Profile objs of Profile Retweets feed
  ProfileMediaFeed: Post [] = []; //array of Post objs of Profile Media feed
  ProfileMediaUserFeed: Profile [] = []; //array of Profile objs of Profile Media feed
  ProfileLikesFeed: Post [] = []; //array of Post objs of Profile Likes feed
  ProfileLikesUserFeed: Profile [] = []; //array of Profile objs of Profile Likes feed

  setProfileDataFlag: boolean = false; //set when setProfileData() runs in profile page

  openmodal: boolean = false; //keeps track of any modals that are open

  //SearchBar
  SearchBarTopics: SearchTopic [] = []

  //runs only once until a page refresh
  constructor(public route: ActivatedRoute, public router: Router,public http: HttpClient,/*, private auth: AuthService*/) { 

    this.username = sessionStorage.getItem('username') ?? "badToken"; 
    this.acc_name = sessionStorage.getItem('acc_name') ?? "badToken";

    this.getFollowingList();
    this.SearchBarTopics = createSearchBarTopics();
    console.log("inside core service constructor");
  }

  //to ensure only one modal is visible at a time (global variable)
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
  this.WhoToFollowFeed = [];
  this.ForYouFeed = []; 
  this.ForYouUserFeed = []; 
  this.FollowFeed = []; 
  this.FollowUserFeed = []; 
  this.Likes= null; 
  this.Retweets = null;
  this.shareID = 0; 
  this.shareUser= ""; 
  this.UserFollowingList = [];
  this.ProfilePostsFeed = null; 
  this.ProfilePostsUserFeed = []; 
  this.ProfileRetweetsFeed = []; 
  this.ProfileRetweetsUserFeed = []; 
  this.ProfileMediaFeed = []; 
  this.ProfileMediaUserFeed = []; 
  this.ProfileLikesFeed = []; 
  this.ProfileLikesUserFeed = []; 
  this.setProfileDataFlag = false;
  this.openmodal = false;
  this.SearchBarTopics = [];
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

  //needed so navbar styling updates properly
  setCpStyle(style: string): void {
    this.cpStyleSubject.next(style);
  }

  getCpStyle(): string {
    return this.cpStyleSubject.getValue();
  }

  // sets the current page value and selects the first tab
  setCurrentPage(str: string)
  {
    const tmp = str;
    this.current_page = tmp;//new
    this.setCpStyle(tmp)
    this.setCpStyle(tmp);
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
    let cp_style = this.getCpStyle();
    if (cp_style == check) 
    {
      return this.setUrl(str + "-fill.svg");
    }
    else if(cp_style == 'OtherExplore' && str == 'Explore')
    {
       return this.setUrl(str + "-fill.svg");
    }
    else
    {
      return this.setUrl(str + ".svg");
    }
  }

  //sets correct font styling (bold or normal) for navbar buttons
  boldNavbarItem(str: string) {
    let cp_style = this.getCpStyle();
    if (cp_style == str) 
    {
      return {fontWeight: 'bold'};
    }
    else if(cp_style == 'OtherExplore' && str == 'Explore')
    {
      return { fontWeight: 'bold'};
    }
    else
    {
      return{fontWeight: 'normal'};
    }
  }

//sets the current tab and which tab should be focused (has the blue marker visible)
routeToChild(str: string){
  
    this.current_tab = str;
    console.log("in route to child str: " + str);
    if (str == "foryou" || str == "all" || str == "posts" || str == "followers"|| str == 'latest')
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

    if (marker) 
    {
      return {display: 'block'};
    }
    else
    {
      return{display: 'none'}
    }
  }

async getDBFollowFeed(acc_name: string | null, more_count: string): Promise<{feed: Post[] , userFeed: Profile[] }> {

  try {
    const requestBody = {
        "word": 'getFollowFeed',
        "word2": acc_name,
        "word3": more_count,//new
      };
    const tweetResponse = await firstValueFrom(this.http.put<any>(environment.apiUrl + "/tweet", requestBody));//need to change

    if (tweetResponse === "No tweets") {

      if(more_count == "0")
      {
        this.FollowFeed = [];
        this.FollowUserFeed = [];
        return { feed: [], userFeed: [] };
      }
      else //tweets in db are exactly a factor of 20, so no more tweets to load
      {
        return { feed: this.FollowFeed, userFeed: this.FollowUserFeed};
      }
    }

    let DBfeed = tweetResponse[0];
    let userResults = tweetResponse[1];

    userResults.forEach((userData: any, index: any) => {

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
      
async getDBForYouFeed(more_count: string): Promise<{feed: Post[] , userFeed: Profile[] }> {

  try {
    const requestBody = {
        "word": 'getForYouFeed',
        "word3": more_count,
      };
    const tweetResponse = await firstValueFrom(this.http.put<any>(environment.apiUrl + "/tweet", requestBody));

    if (tweetResponse === "No tweets") {

      if(more_count == "0")
      {
        this.ForYouFeed = [];
        this.ForYouUserFeed = [];
        return { feed: [], userFeed: [] };
      }
      else //tweets in db are exactly a factor of 20, so no more tweets to load
      {
        return { feed: this.ForYouFeed, userFeed: this.ForYouUserFeed};
      }
    }

    let DBfeed = tweetResponse[0];
    let userResults = tweetResponse[1];

    userResults.forEach((userData: any, index: any) => {

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

//used in secondary content to get and set who to follow pane user arr
createWhoToFollowFeed(acc_name: string): Observable<any[]> 
{
  let requestBody =
    {
      "username" : 'getWhoToFollow',
      "email" : 'email@gmail.com',
      "acc_name" : acc_name,
      "password" : 'password',
      "pic" : null, //new
      "header_pic" : null,
      "bio" : "b",
    };

  return this.http.post<any[]>(environment.apiUrl + "/user", requestBody).pipe(
    map(resultData => {
      if (!resultData) {
        return [];
      }

      this.DBUsers = resultData;
      this.WhoToFollowFeed = [];
      this.DBUsers.reverse();

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
          this.WhoToFollowFeed.push(u);
        }
      }

      return this.WhoToFollowFeed;
    })
  );
}

//sets array of tweet ids of liked tweets by logged in user
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

//sets array of tweet ids of retweeted tweets by logged in user
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
        return resultData;
      }
    })
  );
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
          
          //console.log("this.UserFollowingList: " + this.UserFollowingList)
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
  console.log("this.UserFollowingList: " + this.UserFollowingList);
  for(var i = 0; i < this.UserFollowingList.length; i++)
  {
    if(this.UserFollowingList[i] == acc_name)
    {
      return true;
    }
  }
  return false;
}

/* * * * * * * * * * * * * *functions from tweet service * * * + * * * * * * * * * * */

//validates tweet (in use on home page, post page)
tweetValidated(text_content:string,image_content: string | null)
{
  if(text_content == "")
    {
      if(image_content == "empty" || image_content == "")
        {
          console.log("no content, tweet invalid!")
          return false;
        }
      else
      {
        console.log("tweet valid, only picture")
          return true;
      }
    }
    else
    {
      if(text_content.length < 180)
        {
          console.log("tweet valid")
          return true;
        }
      else
        {
          console.log("tweet too long, tweet invalid!")
          return false;
        }
    }
}

//adds tweet to database (in use on home page, post page)
postTweet2(acc_name: string, text_content: string, image_content: string | null, reply_id: number)
{


/* IN BACKEND I NEED TO MAKE A RESTRICTION THAT A USER CANNOT HAVE MORE THAN 10 TWEETS */



  if (image_content == "")
    {
      image_content = null
    }

  let requestMessage =
    {
      "word": acc_name,
      "word2": text_content,
      "word3": image_content,
      "num": reply_id,
    }
  
  this.http.post(environment.apiUrl +"/tweet",requestMessage).subscribe((resultData: any)=>
    {
        console.log(resultData);
    });
}

postTweet(acc_name: string, text_content: string, image_content: string | null, reply_id: number): Observable<string> {

  if (image_content == "")
  {
    image_content = null
  }

  let requestMessage =
    {
      "word": acc_name,
      "word2": text_content,
      "word3": image_content,
      "num": reply_id,
    }

  return this.http.post<any>(environment.apiUrl + "/tweet", requestMessage).pipe(
    map(resultData => {
      if (!resultData ) {
        return 'error';
      }
      else if (resultData == 'Failed to Add') {
        return 'error';
      }
      else if (resultData == 'Too many tweets') {
        return 'Too many tweets';
      } 
      else
      {
        return 'good';
      }
    })
  );
}



}
