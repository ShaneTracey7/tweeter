import { Injectable} from "@angular/core";
import { Profile, getImgUrl, getHeaderImgUrl, getProfileImgUrl } from "./data";
import { ActivatedRoute, Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

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

  //validUser: boolean = false; idk if this is in use

  DBUsers: any [] = []; //raw array of all Users from DB
  UserFeed: Profile [] = [];//array of Profile objs of all users

  DBFollowers: any [] = []; //raw array of User followers from DB
  followers: Profile [] = [] //array of Profile objs of followers

  DBFollowing: any [] = []; //raw array of User following from DB
  following: Profile [] = [] //array of Profile objs of following

  
  shareID: number = 0; //post id of tweet to send
  shareUser: string = ''; //acc_name of user to send tweet to

  constructor(public route: ActivatedRoute, public router: Router,public http: HttpClient) { 
  
    this.username = localStorage.getItem('username') ?? "badToken"; 
    this.acc_name = localStorage.getItem('acc_name') ?? "badToken";
    this.createUserFeed(false, "");

    //new
    this.getFollowers();
    this.getFollowing();
    console.log("inside core service constructor");

  }

  //don't think this is doing anything
  ngOnDestroy()
  {
    localStorage.clear();
    console.log("ngOnDestroy called in core service");
  }

  setUrl(str: string)
  {
    return getImgUrl(str);
  }
  setProfileUrl(str: string)
  {
    return getProfileImgUrl(str);
  }
  setHeaderUrl(str: string)
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
getAllDBUsers()
{
    this.http.get(environment.apiUrl + "/user").subscribe((resultData: any)=>
    {
        console.log(resultData);
        this.DBUsers = resultData;
    });
}

//creates Profile objects using data from DBUsers and adds them to UserFeed array
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
        var u = new Profile(user.pic,user.header_pic, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
        this.UserFeed.push(u);
        counter++;
      }
    if (counter == 3)
      {
        i = this.DBUsers.length; //breaks loop
      }
  }
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


//implementing global follow /following lists

//either 'following' or 'follower'
convertDBInfo(arr_type: string)
{   
  if( arr_type == 'following' && this.DBFollowing.length > 0)
  {
    for (let i = 0; i < this.DBFollowing.length;i++) {
      let user = this.DBFollowing[i];
      var u = new Profile(user.pic, user.header_pic,user.username, user.acc_name, user.bio, user.following_count, user.follower_count); //need to find where to keep bio, and counts in db
      this.following.push(u);
    }
    
  }
  if( arr_type == 'follower' && this.DBFollowers.length > 0)
  {
    for (let i = 0; i < this.DBFollowers.length;i++) {
      let user = this.DBFollowers[i];
      var u = new Profile(user.pic,user.header_pic, user.username, user.acc_name, user.bio, user.following_count, user.follower_count); //need to find where to keep bio, and counts in db
      this.followers.push(u);
    }
   
  }  
}

//sets DBFollowers with a list of followers that the logged-in user has
getFollowers()
  {

    let requestBody =
    {
      "word" : 'getFollowers',
      "word2" : this.acc_name,
    };

    this.http.put(environment.apiUrl + "/follow",requestBody).subscribe((resultData: any)=>
    {
      console.log(resultData);

      if(resultData == 'Failed to Add')
        {

        }
      else if(resultData == 'No followers')
        {

        }
      else
        {
          this.DBFollowers = resultData;
          this.convertDBInfo('follower');
        }
    });
  }

  //sets DBFollowing with a list of users that the logged-in user follows
  getFollowing()
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

        }
      else if(resultData == 'No following')
        {

        }
      else
        {
          this.DBFollowing = resultData;
          this.convertDBInfo('following');
        }
    });
  }

//check if 'acc_name' user is a follower
isFollower(acc_name: string)
{
  for(var i = 0; i < this.following.length; i++)
  {
    if(this.following[i].acc_name == acc_name)
    {
      return true;
    }
  }
  return false;
}

}
