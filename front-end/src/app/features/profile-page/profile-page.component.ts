import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Post, Profile, elon} from '../../core/data'
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';
import { TweetService } from '../../core/tweet-service';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {shortenNum} from '../../core/data';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent extends CoreComponent{
  
  //figure out a way to make this view work for any user (currently defaults to logged in user)
  acc_name = ""; //need this for api calls when in other profile
  username = ""; //might phase this out
  isValid:boolean = true; //if the user exists
  user: Profile = new Profile("","", "", "", "", 0, 0);
  last_url_section: string;

  arrs: any[] = []; //[post,postUser,retweet,retweetuSER,likes,likesUsers,media,mediaUsers] OR [followers,following] to feed into main component

  isFollow: boolean = false; //if logged in user, is following user on profile page
  isVisible: boolean = false; //if follow/following button is visible
  inFollowLists: boolean = false; //if displaying following or follower lists

  followers: Profile [] = []; //array of Profile objs of followers
  following: Profile [] = []; //array of Profile objs of following

  posts: Post [] = []; //array of Post objs of following
  postsUsers: Profile [] = []; //needed for profile modal

  likes: Post [] = []; //array of Post objs of following
  likesUsers: Profile [] = []; //needed for profile modal

  retweets: Post [] = []; //array of Post objs of following
  retweetsUsers: Profile [] = []; //needed for profile modal

  media: Post [] = [] //array of Post objs of following
  mediaUsers: Profile [] = []; //needed for profile modal

  showep: boolean = false; //condition to show edit profile modal or not

  //flags to show spinner while data is being fetched
  postLoadingFlag: boolean = true; 
  likeLoadingFlag: boolean = true; 
  retweetLoadingFlag: boolean = true; 
  followerLoadingFlag: boolean = true;
  followingLoadingFlag: boolean = true;

  //needed to ensure when logging into a different account, correct data displays
  service_acc_name: string;
  service_username: string;
  service_page: string; //needed to change current_page
  service_tab: string; //needed to change current_tab

  backUrl: string; //url needed to go back to profile page from followers/following view

  constructor(private router: Router,private http: HttpClient,authService: AuthService, route: ActivatedRoute, service2: CoreService, public tweetService: TweetService) {
    super(authService,route,service2);

    this.service_acc_name = "";
    this.service_username = "";
    this.last_url_section = "";
    this.service_page = "";
    this.service_tab = "";
    this.backUrl = "";
  }

  ngOnInit()
  {
    console.log("profile page oninit");

    this.service_username = sessionStorage.getItem('username') ?? "badToken";
    this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";
 
    var arr = window.location.pathname.split("/");
    this.last_url_section = arr.pop() ??"error";
    let second_last = arr.pop() ??"error";

    var arr2 = window.location.pathname.split("/");
    console.log("arr2 length: " + arr2.length);
    if (arr2.length > 5) //error
    {
      this.router.navigate(['tweeter/Error']);
    } 
    else if (arr2.length > 4 && this.last_url_section != 'following' && this.last_url_section != 'followers')
    {
      this.router.navigate(['tweeter/Error']);
    }
    else if (this.last_url_section == "Profile") //main case (normal)
    {
        console.log("last_url_section == Profile");
        this.acc_name = this.service_acc_name;
        this.username = this.service_username;
        this.setUpProfileDataDB(this.service_acc_name,false);
        
        //set likes and retweets
        if (this.service.Likes == null )
        {
          this.service.getDBRetweets(this.service_acc_name).subscribe(ids => {
            console.log("retweet_ids: " + ids);
          });
          this.service.getDBLikes(this.service_acc_name).subscribe(ids => {
            console.log("like_ids: " + ids);
          });
          console.log("this.service.Likes == null");
        }
        else
        {
          console.log("this.service.Likes is not null");
        }
        //testing
        this.service.setCurrentPage('Profile'); //could be redundant
        this.service_page = 'Profile'; //cound be redundant
    }
    else if (this.last_url_section == "followers" || this.last_url_section == "following")
    {
        console.log("last_url_section == " + this.last_url_section);
        if(second_last == "Profile")
        {
          this.acc_name = this.service_acc_name; //might phase this out
          this.username = this.service_username;
          this.inFollowLists = true; 
          this.setUpProfileDataDB(this.service_acc_name,false);

          this.service.setCurrentPage('ProfileFollow');
          this.service_page = 'ProfileFollow';

          if(this.last_url_section == "followers" )
          {
            this.service.routeToChild('followers');
            this.service_tab = 'followers';
          }
          else
          {
            this.service.routeToChild('following');
            this.service_tab = 'following';
          }
        }
        else //otherProfile followers page
        {
          this.acc_name = second_last; 
          this.inFollowLists = true; 
          this.setUpProfileDataDB(second_last,true); //check that 'second_last' value exists and get data

          this.service.setCurrentPage('ProfileFollow');
          this.service_page = 'ProfileFollow';
          
          if(this.last_url_section == "followers" )
          {
            this.service.routeToChild('followers');
            this.service_tab = 'followers';
          }
          else
          {
            this.service.routeToChild('following');
            this.service_tab = 'following';
          }
        }
    }
    else //otherProfile case
    {
        console.log("last_url_section == else");
        this.service.setCurrentPage('OtherProfile');
        this.service_page = 'OtherProfile'; //NEW
        this.service.current_page = 'OtherProfile';
        this.service.cp_style = 'OtherProfile';
        this.acc_name = this.last_url_section; //might phase this out
        this.isVisible = true; //shows follow/following
        this.setUpProfileDataDB(this.last_url_section,true);
        
        //set likes and retweets
        if (this.service.Likes == null )
        {
          this.service.getDBRetweets(this.service_acc_name).subscribe(ids => {
            console.log("retweet_ids: " + ids);
          });
          this.service.getDBLikes(this.service_acc_name).subscribe(ids => {
            console.log("like_ids: " + ids);
          });
          console.log("this.service.Likes == null");
        }
        else
        {
          console.log("this.service.Likes is not null");
        }
    }
  }

  //checks if user exists and sets variable
  checkUserInDB(acc_name: string,otherProfile: boolean): Observable<boolean> {
  
    let requestBody =
    {
      "username" : 'getUser',
      "email" : 'e',
      "acc_name" : acc_name,
      "password" : 'p',
      "pic" : null, 
    };

    console.log("in checkUserInDB this.acc_name :" +  this.acc_name);  
    return this.http.put<any>(environment.apiUrl + "/user", requestBody).pipe(
      map(resultData => {
        console.log("resultData: " + resultData);

        if (!resultData ) {
          this.user = new Profile("","","",this.last_url_section,"",0,0)
          this.isValid = false;
          return false;
        }
        else if(resultData == "User doesn't exist" || resultData == "Failed to Add")
        {
          this.user = new Profile("","","",this.last_url_section,"",0,0)
          this.isValid = false;
          return false;
        }
        else
        {
          this.user = new Profile(resultData.pic?.image_url,resultData.header_pic?.image_url,resultData.username,resultData.acc_name,resultData.bio,resultData.following_count,resultData.follower_count)
          if(!otherProfile)
          {
            this.service.loggedInUser = this.user;
          }
          
          this.isValid = true;
          return true;
        }
      })
    );
  }

  //gets lists of user objects from db that are following loggedin user
  getFollowers(acc_name: string,otherProfile: boolean)
  {
    let requestBody =
    {
      "word" : 'getFollowers',
      "word2" : acc_name, //this.acc_name
    };

    this.http.put(environment.apiUrl + "/follow",requestBody).subscribe((resultData: any)=>
    {
      console.log(resultData);

      if(resultData == 'Failed to Add')
        {
          //this.user.follower_count = String(0);
          this.followers = []; //clear array
        }
      else if(resultData == 'No followers')
        {
          //this.user.follower_count = String(0);
          this.followers = []; //clear array
        }
      else
        {
          this.convertDBInfo('follower', resultData);
          //this.user.follower_count = (shortenNum(resultData.length));

          //var fc_html = <HTMLElement>document.getElementById("ppfrc");
          //fc_html.innerHTML = this.user.follower_count;

          //idk if this is necessary
          /*
          if(this.last_url_section == "followers" || this.last_url_section == "following")
          {
            this.inFollowLists = true; //idk if this is necessary
          }*/
        }

        if(!otherProfile)
        {
          //this.service.loggedInUser.follower_count = this.user.follower_count; //update globale variabale
        }

        if(this.inFollowLists)
        {
          //only do if in follow view
          this.arrs[0] = this.followers;  
        }
        this.isFollowing();
        this.followerLoadingFlag = false;
    });
  }

  //checks if user is following the profile page user
  isFollowing()
  {
    for (let i=0; i < this.followers.length; i++)
    {
      if (this.followers[i].acc_name == this.service_acc_name)
      {
        this.isFollow = true;
        return;
      }
    }
    this.isFollow = false;
  }

  //gets lists of user objects from db that are loggedin user is following
  getFollowing(acc_name: string,otherProfile: boolean)
  {
    let requestBody =
    {
      "word" : "getFollowing",
      "word2" : acc_name, //this.acc_name
    };

    this.http.put(environment.apiUrl +"/follow",requestBody).subscribe((resultData: any)=>
    {
      console.log(resultData);

      if(resultData == 'Failed to Add')
        {
          //this.user.follow_count = String(0);
          this.following = []; //clear array
        }
      else if(resultData == 'No following')
        {
          //this.user.follow_count = String(0);
          this.following = []; //clear array
        }
      else
        {
          this.convertDBInfo('following', resultData);
          //this.user.follow_count = (shortenNum(resultData.length));
         // var fc_html = <HTMLElement>document.getElementById("ppfgc");
         // fc_html.innerHTML = this.user.follow_count;

        }
        if(!otherProfile)
        {
          //this.service.loggedInUser.follow_count = this.user.follow_count; //update globale variabale
        }
        if(this.inFollowLists)
        {
          //only do if in follow view
          this.arrs[1] = this.following; 
        }
        console.log("this.arrs[1]: " + this.arrs[1])
        console.log("this.following: " + this.following);
        console.log("this.arrs: " + this.arrs);
        this.followingLoadingFlag = false;
    });
  }

  getPosts(acc_name: string, otherProfile: boolean)
  {
    let requestBody =
    {
      "word" : "getPosts",
      "word2" : acc_name, //this.acc_name
    };

    console.log("getPosts acc_name: " + acc_name);

    this.http.put(environment.apiUrl +"/tweet",requestBody).subscribe((resultData: any)=>
    {
      console.log('Response from getPosts :', JSON.stringify(resultData, null, 2));

      if(resultData == 'Failed to Add')
      {
        console.log("failed to add (getPosts)" );
        if(!otherProfile)
        { 
          //update global variables
          this.service.ProfilePostsFeed = []; 
           this.service.ProfilePostsUserFeed = []; 
        }
      }
      else if(resultData == 'No posts')
      {
        console.log("no posts (getPosts)" );
        if(!otherProfile)
        { 
           //update global variables
          this.service.ProfilePostsFeed = []; 
          this.service.ProfilePostsUserFeed = []; 
        }
      }
      else
      {
        console.log("good (getPosts)" );
        //clear arrs
        this.posts = []; 
        this.postsUsers = [];
        this.convertDBInfoPosts('posts', resultData[0], resultData[1]);
          if(!otherProfile)
          { 
            //update global variables
            this.service.ProfilePostsFeed = this.posts; 
            this.service.ProfilePostsUserFeed = this.postsUsers; 
          }
        }
        if(!this.inFollowLists)
        {
          //don't set unless not in followlists
          this.arrs[0] = this.posts;
          this.arrs[1] = this.postsUsers;
        }

        this.postLoadingFlag = false;
    });
  }

  //get array of tweet objs from db that loggedin user liked
  getLikes(acc_name: string, otherProfile: boolean)
  {
    
    let requestBody =
    {
      "word" : "getLikes",
      "word2" : acc_name, //this.acc_name
    };

    this.http.put(environment.apiUrl +"/tweet",requestBody).subscribe((resultData: any)=>
    {

      if(resultData == 'Failed to Add')
      {
        console.log("failed to add (getLikes)");
        if(!otherProfile)
        { 
          //update global variables
          this.service.ProfileLikesFeed = []; 
          this.service.ProfileLikesUserFeed = []; 
        }
        this.arrs[4] = [];
        this.arrs[5] = [];
      }
      else if(resultData == 'No likes')
      {
        console.log("no likes (getLikes)" );
        if(!otherProfile)
        { 
          //update global variables
          this.service.ProfileLikesFeed = []; 
          this.service.ProfileLikesUserFeed = []; 
        }
        this.arrs[4] = [];
        this.arrs[5] = [];
      }
      else
      {
        console.log("good (getLikes)" );
        //clear arrs
        this.likes = []; 
        this.likesUsers = [];
        this.convertDBInfoPosts('likes',resultData[0], resultData[1]);
        if(!otherProfile)
        { 
          //update global variables
          this.service.ProfileLikesFeed = this.likes; 
          this.service.ProfileLikesUserFeed = this.likesUsers; 
        }
        this.arrs[4] = this.likes;
        this.arrs[5] = this.likesUsers;
      }

      this.likeLoadingFlag = false;
    });
  }

  //get array of tweet objs from db that loggedin user retweeted
  getRetweets(acc_name: string, otherProfile:boolean)
  {
    
    let requestBody =
    {
      "word" : "getRetweets",
      "word2" : acc_name, //this.acc_name
    };

    this.http.put(environment.apiUrl +"/tweet",requestBody).subscribe((resultData: any)=>
    {

      if(resultData == 'Failed to Add')
        {
          console.log("failed to add (getRetweets)" );
          if(!otherProfile)
          { 
            //update global variables
            this.service.ProfileRetweetsFeed = []; 
            this.service.ProfileRetweetsUserFeed = []; 
          }
            this.arrs[2] = [];
            this.arrs[3] = [];
        }
      else if(resultData == 'No retweets')
        {
          console.log("no retweets (getRetweets" );
          if(!otherProfile)
          { 
            //update global variables
            this.service.ProfileRetweetsFeed = []; 
            this.service.ProfileRetweetsUserFeed = []; 
          }
            this.arrs[2] = [];
            this.arrs[3] = [];
        }
      else
        {
          console.log("good (getRetweets)" );
          //clear arrs
          this.retweets = []; 
          this.retweetsUsers = [];

          this.convertDBInfoPosts('retweets',resultData[0], resultData[1]);
          if(!otherProfile)
          { 
            //update global variables
            this.service.ProfileRetweetsFeed = this.retweets; 
            this.service.ProfileRetweetsUserFeed = this.retweetsUsers; 
          }
          this.arrs[2] = this.retweets;
          this.arrs[3] = this.retweetsUsers;
        }
        this.retweetLoadingFlag = false;
    });
  }

  //idk if this is in use
  getFollowerCount()
  {
    console.log(this.followers.length); //for testing
    this.user.follower_count == String(this.followers.length);
  }

  //styles follow/following button for otherProfile view
  styleButton()
  {
    if (this.isVisible)
    {
      return { display: 'block'};
    }
    else
    {
      return { display: 'none'};
    }
  }

  //idk if this is in use
  getFollowingCount()
  {
      //make follow/following button visible
    this.isVisible = true;

    console.log(this.following.length); //for testing
    this.user.follow_count == String(this.following.length);
  }

  //on click of follower link of Profile/otherProfile, gets list of followers and changes to ProfileFollow view
  showFollowerList()
  {
    this.followerLoadingFlag = true;
    this.followingLoadingFlag = true;
    console.log('follower button pressed');
    this.service.setCurrentPage('ProfileFollow');
    this.service_page = 'ProfileFollow';
    this.service_tab = 'followers'; //NEW
    this.service.routeToChild('followers');
   
    let url = window.location.pathname + "/followers"; 
    this.router.navigate([url]);
    this.inFollowLists = true;

    //add logic to ensure these lists are populated correctly
    var arr = window.location.pathname.split("/");
    this.last_url_section = arr.pop() ??"error";
    let second_last = arr.pop() ??"error";
    let otherProfile;
    if(second_last == "Profile")
    {
      otherProfile = false;
    } 
    else
    {
      otherProfile = true;
    }  
    this.getFollowers(this.acc_name,otherProfile);
    this.getFollowing(this.acc_name,otherProfile); 
  }

  //on click of following link of Profile/otherProfile, gets list of users following and changes to ProfileFollow view
  showFollowingList()
  {
    console.log("inside show following list function");
    this.followerLoadingFlag = true;
    this.followingLoadingFlag = true;
    console.log('following button pressed');
    this.service.setCurrentPage('ProfileFollow');
    this.service_page = 'ProfileFollow';
    this.service_tab = 'following'; //NEW
    this.service.routeToChild('following');

    let url = window.location.pathname + "/following"; 
    this.router.navigate([url]);
    this.inFollowLists = true;

    //add logic to ensure these lists are populated correctly
    var arr = window.location.pathname.split("/");
    this.last_url_section = arr.pop() ??"error";
    let second_last = arr.pop() ??"error";
    let otherProfile;
    if(second_last == "Profile")
    {
      otherProfile = false;
    } 
    else
    {
      otherProfile = true;
    }  
    this.getFollowers(this.acc_name,otherProfile);
    this.getFollowing(this.acc_name,otherProfile); 
  }

  //new (not tested) for short profile to call (doesn't work)
  shortProfileClick(acc_name: string, otherProfile: boolean)
  {
    this.acc_name = acc_name; //needed for setUpProfileDataDB functions to run properly
    this.postLoadingFlag = true;
    this.likeLoadingFlag = true;
    this.retweetLoadingFlag = true;
    this.followerLoadingFlag = true;
    this.followingLoadingFlag = true;

    this.inFollowLists = false;//this won't fire unless ppg instanced passed to component in main content component

    if(otherProfile)
    {
      this.service.setCurrentPage('OtherProfile') 
      this.service_page = 'OtherProfile';
      this.last_url_section = ""; //important
    } 
    else
    {
      this.service.setCurrentPage('Profile');
      this.service_page = 'Profile';
      this.last_url_section = "Profile"; //important
    }  
    this.service_tab = 'posts';
    this.service.routeToChild('posts');

    this.setUpProfileDataDB(acc_name,otherProfile);
  }
  
  // to go back to normal profile view from follow lists(PorfileFollow)
  goBack()
  {
    this.postLoadingFlag = true;
    this.likeLoadingFlag = true;
    this.retweetLoadingFlag = true;
    this.followerLoadingFlag = true;
    this.followingLoadingFlag = true;

    var arr = window.location.pathname.split("/");
    arr.pop();
    this.setBackUrl(arr);
    let check = arr.pop()
    this.inFollowLists = false;
    this.last_url_section = ""; //need to clear to avoid imporper setting of inFolllowLists

    if(check == 'Profile')
    {
      this.service.setCurrentPage('Profile') 
      this.service_page = 'Profile';
      this.service_tab = 'posts';
      this.setUpProfileDataDB(this.acc_name,false);
    }
    else
    {
      this.service.setCurrentPage('OtherProfile') 
      this.service_page = 'OtherProfile';
      this.service_tab = 'posts';
      //get data as new
      this.setUpProfileDataDB(this.acc_name,true);
    }

    //set likes and retweets
    if (this.service.Likes == null )
    {
      this.service.getDBRetweets(this.service_acc_name).subscribe(ids => {
        console.log("retweet_ids: " + ids);
      });
      this.service.getDBLikes(this.service_acc_name).subscribe(ids => {
        console.log("like_ids: " + ids);
      });
      console.log("this.service.Likes == null");
    }
    else
    {
      console.log("this.service.Likes is not null");
    }

    //navigate back to profile page
    this.router.navigate([this.backUrl]);
  }

  //error with media and likes not populating properly coming up
  //(i think it could be the timing of fucntions firing)
  //used in searchbar of profile page for 'Profile' or 'OtherProfile'
  //doesn't work atm
  ///still doesnt work
  goToSearchProfile(str: string)
  {
    console.log("in search profile")
    //implement case for if you go to the same profile you are already on
    var arr = window.location.pathname.split("/");
    let l_url_section = arr.pop() ??"error";
    if(str == this.service_acc_name && l_url_section == 'Profile')
    {
      //do nothing
      console.log('Already on page');
      //searchBar.focus = false;
      return;
    }
    else if(str == l_url_section)
    {
      //do nothing
      console.log('Already on page');
      //searchBar.focus = false;
      return;
    }

    var url = "/tweeter/Profile";
    this.acc_name = str; 

    if(this.service_acc_name == str)
    {
      this.service.setCurrentPage('Profile') 
      this.service_page = 'Profile';
      this.last_url_section = 'Profile';
    }
    else
    {
      url = url + "/" + str;
      this.service.setCurrentPage('OtherProfile') 
      this.service_page = 'OtherProfile';
      this.last_url_section = str;
    }

    this.service_tab = 'posts';
    this.inFollowLists = false;

    //clearing arrays before I append
    this.posts = [];
    this.postsUsers = [];
    this.retweets = [];
    this.retweetsUsers = [];
    this.likes = [];
    this.likesUsers = [];
    this.media = [];
    this.mediaUsers = [];
    this.followers = [];
    this.following = [];

    //navigate back to profile page
    this.router.navigate([url]);
    this.setUpProfileDataDB(str,false);
    
    //set likes and retweets
    if (this.service.Likes == null )
    {
      this.service.getDBRetweets(this.service_acc_name).subscribe(ids => {
        console.log("retweet_ids: " + ids);
      });
      this.service.getDBLikes(this.service_acc_name).subscribe(ids => {
        console.log("like_ids: " + ids);
      });
      console.log("this.service.Likes == null");
    }
    else
    {
      console.log("this.service.Likes is not null");
    }
  }

  //sets profile data either from DB or global variables
  setUpProfileDataDB(acc_name: string,otherProfile: boolean)
  {
    console.log("inFollowLists: " + this.inFollowLists);
    console.log("in setUpProfileDataDB");
    if(!this.service.setProfileDataFlag || otherProfile) 
    {
      console.log("in setUpProfileDataDB if case");
      this.checkUserInDB(acc_name,otherProfile).subscribe(check => {

        console.log("User in DB: " + check);
        if(check) //user in DB
        {
        
          this.getPosts(acc_name,otherProfile);
          this.getLikes(acc_name,otherProfile);
          this.getRetweets(acc_name,otherProfile);
          //this.getMedia(otherProfile) (not made yet)
          this.getFollowers(acc_name,otherProfile); //isFollowing is called here
          this.getFollowing(acc_name,otherProfile); //i may only have to call this if in followlist

          //because media isn't set up
          this.arrs[6] = [];
          this.arrs[7] = [];
          
          if(!otherProfile)
          {
            this.service.setProfileDataFlag = true;
          }
          
        }
        else //user not in DB
        {
          //set loading flag to false
          this.followerLoadingFlag = false;
          this.followingLoadingFlag = false;
          this.likeLoadingFlag = false;
          this.retweetLoadingFlag = false;
          this.postLoadingFlag = false;
        }
        console.log("setting profile data") 
      }); 
    }
    else //global variables already have been set and not in Profile
    { 
      this.user = this.service.loggedInUser;

      if(this.inFollowLists)
      {
        this.acc_name = this.user.acc_name; //necessary for following functions to work
        this.getFollowers(this.user.acc_name,otherProfile); //isFollowing is called here
        this.getFollowing(this.user.acc_name,otherProfile); //i may only have to call this if in followlist
      }
      else
      {
          //setting with global variables
        this.posts = this.service.ProfilePostsFeed ?? [];
        this.postsUsers = this.service.ProfilePostsUserFeed ?? [];

        this.likes = this.service.ProfileLikesFeed ?? [];
        this.likesUsers = this.service.ProfileLikesUserFeed ?? [];

        this.retweets = this.service.ProfileRetweetsFeed ?? [];
        this.retweetsUsers = this.service.ProfileRetweetsUserFeed ?? [];

        this.arrs= [this.posts,this.postsUsers,this.retweets,this.retweetsUsers,this.likes, this.likesUsers,this.media,this.mediaUsers];

          //set loading flag to false
        this.followerLoadingFlag = false;
        this.followingLoadingFlag = false;
      } 

      //set loading flag to false
      this.likeLoadingFlag = false;
      this.retweetLoadingFlag = false;
      this.postLoadingFlag = false;

      console.log("profile data has already been set")
    }  
  }

  //only when in OtherProfile upon 'follow' button click
  followUser(){

    let requestBody =
    {
      "word" : this.acc_name,
      "word2" : this.service_acc_name,
    };

    this.http.post(environment.apiUrl +"/follow",requestBody).subscribe((resultData: any)=>
    {
      console.log(resultData);
      this.user.follower_count = String(Number(this.user.follower_count) + 1); //idk if this will work
      this.service.loggedInUser.follow_count = shortenNum(Number(this.user.follower_count) + 1);
      this.service.UserFollowingList.push(this.acc_name);//adding to global list
    });
  }

  //only when in OtherProfile upon 'following' button click
  unfollowUser(){

    let requestBody =
    {
      "word" : 'delete',
      "word2" : this.service_acc_name,
      "word3": this.acc_name,
    };

    this.http.put(environment.apiUrl +"/follow",requestBody).subscribe((resultData: any)=>
    {
      console.log(resultData);
      this.user.follower_count = String(Number(this.user.follower_count) - 1); //idk if this will work
      this.service.loggedInUser.follow_count = shortenNum(Number(this.user.follower_count) - 1);
      const index = this.service.UserFollowingList.indexOf(this.acc_name); //removing from global list
      if (index !== -1) 
      {
        this.service.UserFollowingList.splice(index, 1)
      }
    });
  }

  //only when in OtherProfile
  handleFollowClick()
  {
    if(this.isFollow)
    {
      this.isFollow = false;
      this.unfollowUser(); //this causes tabs on profile page to populate inaccurately (for some reason)
    }
    else
    {
      this.isFollow = true;
      this.followUser();
    }
  }

  //either 'following' or 'follower' converts json db objects
convertDBInfo(arr_type: string, DBFollow: any [])
{   
  if( arr_type == 'following' && DBFollow.length > 0)
  {
    this.following = []; //clear array

    for (let i = 0; i < DBFollow.length;i++) {
      let user = DBFollow[i];
      var u = new Profile(user.pic?.image_url, user.header_pic?.image_url,user.username, user.acc_name, user.bio, user.following_count, user.follower_count); //need to find where to keep bio, and counts in db
      this.following.push(u);
    }
    
  }
  if( arr_type == 'follower' && DBFollow.length > 0)
  {
    this.followers = []; //clear array

    for (let i = 0; i < DBFollow.length;i++) {
      let user = DBFollow[i];
      var u = new Profile(user.pic?.image_url, user.header_pic?.image_url,user.username, user.acc_name, user.bio, user.following_count, user.follower_count); //need to find where to keep bio, and counts in db
      this.followers.push(u);
    }
  }  
}

 //either 'posts' or 'retweets' or 'likes'  converts json db objects
 convertDBInfoPosts(arr_type: string, DBPosts: any[], DBUsers: any[])
 {   
  
   if( arr_type == 'posts' && DBPosts.length > 0)
   {
     for (let i = 0; i < DBPosts.length;i++) {
       let post = DBPosts[i];
       let user = DBUsers[i]; //need to set this in dbcall
       var p = new Post(post.id,user.pic?.image_url,this.user.username,this.user.acc_name, post.date_created, post.text_content, "", post.comments, post.retweets, post.likes, post.engagements); //need to find where to keep bio, and counts in db
       this.posts.push(p);
       var u = new Profile(user.pic?.image_url,user.header_pic?.image_url,user.username,user.acc_name,user.bio,user.following_count,user.follower_count);
       this.postsUsers.push(u);
       console.log("in convert for posts, user: " + u);
     }
   }
   if( arr_type == 'retweets' && DBPosts.length > 0)
   {
     for (let i = 0; i < DBPosts.length;i++) {
       let post =  DBPosts[i];
       let user = DBUsers[i]
       var p = new Post(post.id,user.pic?.image_url,user.username,user.acc_name, post.date_created, post.text_content, "", post.comments, post.retweets, post.likes, post.engagements); //need to find where to keep bio, and counts in db
       this.retweets.push(p);
       var u = new Profile(user.pic?.image_url,user.header_pic?.image_url,user.username,user.acc_name,user.bio,user.following_count,user.follower_count);
       this.retweetsUsers.push(u);
     }
   }
   if( arr_type == 'likes' && DBPosts.length > 0)
    {
      for (let i = 0; i < DBPosts.length;i++) {
        let post = DBPosts[i];
        let user = DBUsers[i]
        var p = new Post(post.id,user.pic?.image_url,user.username,user.acc_name, post.date_created, post.text_content, "", post.comments, post.retweets, post.likes, post.engagements); //need to find where to keep bio, and counts in db
        this.likes.push(p);
        var u = new Profile(user.pic?.image_url,user.header_pic?.image_url,user.username,user.acc_name,user.bio,user.following_count,user.follower_count);
       this.likesUsers.push(u);
      }
    }
 }

 //'followers' or 'following' tab clicks in profilefollow
 handleTabClick(str: string)
 {
   var url = "";
   var arr = window.location.pathname.split("/");
   let check = arr.pop()
   if (check == str)
   {
     //do nothing already on that page
   }
   else
   {
     for (let i = 0; i < arr.length; i++) 
       {
         if(i == 0)
         {
           url = arr[i];
         }
         else
         {
           url = url + '/' + arr[i];
         }
       }  
     url = url + '/' + str;
     this.service_tab = str;//new
     this.service.routeToChild(str);
     this.router.navigate([url]);
   }
   
 }
 
 //sets back url used when hitting back arrow from profile follow 
 setBackUrl(arr: any [])
 {
   this.backUrl = "";
   for (let i = 0; i < arr.length; i++) 
     {
       if(i == 0)
       {
         this.backUrl = arr[i];
       }
       else
       {
         this.backUrl = this.backUrl + '/' + arr[i];
       }
     }  
     console.log('end of setBackUrl function');  
 }

 showEPModal()
 {
  this.showep = true;
  console.log('showing edit profile modal');
 }

 //tab clicks from within Profile or OtherProfile views
 handleProfileTabClick(tab: string)
 {
    this.service_tab = tab;
    this.service.routeToChild(tab);
 }

}