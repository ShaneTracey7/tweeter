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

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent extends CoreComponent{
  
  //figure out a way to make this view work for any user (currently defaults to logged in user)
  elon = elon;
  acc_name = ""; //might phase this out
  username = ""; //might phase this out
  isValid:boolean = true;
  user: Profile = new Profile("","", "", "", "", 0, 0);
  last_url_section: string;

  arrs: any[] = []; //testing to feed into main component

  isFollow: boolean = false; //if logged in user, is following user on profile page
  isVisible: boolean = false; //if follow/following button is visible
  inFollowLists: boolean = false; //if displaying following or follower lists

  followers: Profile [] = []; //array of Profile objs of followers

  following: Profile [] = []; //array of Profile objs of following

  /* posts NOT BEING UPDATED*/
  posts: Post [] = []; //array of Post objs of following
  postsUsers: Profile [] = []; //needed for profile modal

  likes: Post [] = []; //array of Post objs of following
  likesUsers: Profile [] = []; //needed for profile modal
  like_ids: number [];
  //last_like_ids: number [];

  retweets: Post [] = []; //array of Post objs of following
  retweetsUsers: Profile [] = []; //needed for profile modal
  retweet_ids: number [];

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

  backUrl: string; //url needed to go back to profile page from followers/following view

  constructor(private router: Router,private http: HttpClient,authService: AuthService, route: ActivatedRoute, service2: CoreService, public tweetService: TweetService) {
    super(authService,route,service2);

    //this.core_service = new CoreService(route,router,http);
    this.service_acc_name = "";
    this.service_username = "";
    this.last_url_section = "";
    this.service_page = "";
    this.backUrl = "";
    this.like_ids = [];
    this.retweet_ids = [];
    //this.last_like_ids = [];
  }

  ngOnInit()
  {
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
    
    else if (this.last_url_section == "Profile")
    {
        console.log("last_url_section == Profile");
        this.acc_name = this.service_acc_name; //might phase this out
        this.username = this.service_username;
        this.setUpProfileDataDB(false);//this.checkUserInDB(); //to get user data
        //this.arrs = [this.posts,this.postsUsers,this.retweets,this.retweetsUsers,this.likes,this.likesUsers, this.media,this.mediaUsers];
        
        //set likes and retweets
        if (this.service.Likes == null )
        {
          this.service.getDBRetweets(this.service_acc_name).subscribe(ids => {
            console.log("retweet_ids: " + ids);
            this.retweet_ids = ids;
          });
          this.service.getDBLikes(this.service_acc_name).subscribe(ids => {
            console.log("like_ids: " + ids);
            this.like_ids = ids;
          });
          console.log("this.service.Likes == null");
        }
        else
        {
          this.retweet_ids = this.service.Retweets;
          this.like_ids = this.service.Likes;
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
          this.inFollowLists = true; //NEW
          this.setUpProfileDataDB(false);

          this.service.setCurrentPage('ProfileFollow');
          this.service_page = 'ProfileFollow';

          
          //this.arrs = [this.followers,this.following];
          if(this.last_url_section == "followers" )
            {
              this.service.routeToChild('followers');
            }
            else
            {
              this.service.routeToChild('following');
            }
        }
        else
        {
          this.acc_name = second_last; 
          this.inFollowLists = true; //NEW
          this.setUpProfileDataDB(true); //check that 'second_last' value exists and get data

          this.service.setCurrentPage('ProfileFollow');
          this.service_page = 'ProfileFollow';
          
          //this.arrs = [this.followers,this.following];
          if(this.last_url_section == "followers" )
          {
            this.service.routeToChild('followers');
          }
          else
          {
            this.service.routeToChild('following');
          }
          
        }
        //this.inFollowLists = true;
    }
    else
    {
        console.log("last_url_section == else");
        this.service.setCurrentPage('OtherProfile');
        this.service_page = 'OtherProfile'; //NEW
        this.service.current_page = 'OtherProfile';
        this.service.cp_style = 'OtherProfile';
        this.acc_name = this.last_url_section; //might phase this out
        this.setUpProfileDataDB(true);//this.checkUserInDB(); //didn't work properly
        //this.arrs = [this.posts,this.postsUsers,this.retweets,this.retweetsUsers,this.likes,this.likesUsers, this.media,this.mediaUsers];
        
        //set likes and retweets
        if (this.service.Likes == null )
        {
          this.service.getDBRetweets(this.service_acc_name).subscribe(ids => {
            console.log("retweet_ids: " + ids);
            this.retweet_ids = ids;
          });
          this.service.getDBLikes(this.service_acc_name).subscribe(ids => {
            console.log("like_ids: " + ids);
            this.like_ids = ids;
          });
          console.log("this.service.Likes == null");
        }
        else
        {
          this.retweet_ids = this.service.Retweets;
          this.like_ids = this.service.Likes;
          console.log("this.service.Likes is not null");
        }
    }
  }
/*
  checkUserInDB2()
  {
  let requestBody =
    {
      "username" : 'getUser',
      "email" : 'e',
      "acc_name" : this.acc_name,
      "password" : 'p',
      "pic" : null, 
      //may need to add hedaer pic and other attributes
    };

    this.http.put(environment.apiUrl +"/user",requestBody).subscribe((resultData: any)=>
    {
        console.log(resultData);
        console.log("resultData: " + resultData.pic?.image_url);
        console.log("resultData: " + resultData.header_pic?.image_url);
    
        if(resultData == "User doesn't exist" || resultData == "Failed to Add")
        {
          this.user = new Profile("","","",this.last_url_section,"",0,0)
          this.isValid = false;
        }
      else
        {
          this.user = new Profile(resultData.pic?.image_url,resultData.header_pic?.image_url,resultData.username,resultData.acc_name,resultData.bio,resultData.following_count,resultData.follower_count)
          this.isValid = true;
        }
    });
  }*/

  checkUserInDB(): Observable<boolean> {
  
    let requestBody =
    {
      "username" : 'getUser',
      "email" : 'e',
      "acc_name" : this.acc_name,
      "password" : 'p',
      "pic" : null, 
      //may need to add hedaer pic and other attributes
    };
  
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
          this.isValid = true;
          return true;
        }
      })
    );
  }

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
          this.user.follower_count = String(0);
        }
      else if(resultData == 'No followers')
        {
          this.user.follower_count = String(0);
        }
      else
        {
          this.convertDBInfo('follower', resultData);
          this.user.follower_count = String(resultData.length);

          var fc_html = <HTMLElement>document.getElementById("ppfrc");
          fc_html.innerHTML = this.user.follower_count;

          if(this.last_url_section == "followers" || this.last_url_section == "following")
          {
            this.inFollowLists = true;
          }
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

  getFollowing()
  {
    let requestBody =
    {
      "word" : "getFollowing",
      "word2" : this.acc_name,
    };

    this.http.put(environment.apiUrl +"/follow",requestBody).subscribe((resultData: any)=>
    {
      console.log(resultData);

      if(resultData == 'Failed to Add')
        {
          this.user.follow_count = String(0);
        }
      else if(resultData == 'No following')
        {
          this.user.follow_count = String(0);
        }
      else
        {
          this.convertDBInfo('following', resultData);
          this.user.follow_count = String(resultData.length);
          var fc_html = <HTMLElement>document.getElementById("ppfgc");
          fc_html.innerHTML = this.user.follow_count;

        }
        if(this.inFollowLists)
        {
          //only do if in follow view
          this.arrs[1] = this.following; 
        }
        this.followingLoadingFlag = false;
    });
  }

  getPosts(otherProfile: boolean)
  {
    let requestBody =
    {
      "word" : "getPosts",
      "word2" : this.acc_name, //confirm this is accurate
    };

    console.log("getPosts acc_name: " + this.acc_name);

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
          this.arrs[0] = [];
          this.arrs[1] = [];
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
          this.arrs[0] = [];
          this.arrs[1] = [];
        }
      else
        {
          console.log("good (getPosts)" );
          this.convertDBInfoPosts('posts', resultData[0], resultData[1]);
          if(!otherProfile)
          { 
            //update global variables
            this.service.ProfilePostsFeed = this.posts; 
            this.service.ProfilePostsUserFeed = this.postsUsers; 
          }

          this.arrs[0] = this.posts;
          this.arrs[1] = this.postsUsers;
        }

        this.postLoadingFlag = false;
    });
  }

  getLikes(otherProfile: boolean)
  {
    
    let requestBody =
    {
      "word" : "getLikes",
      "word2" : this.acc_name,
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

  getRetweets(otherProfile:boolean)
  {
    
    let requestBody =
    {
      "word" : "getRetweets",
      "word2" : this.acc_name,
    };

    this.http.put(environment.apiUrl +"/tweet",requestBody).subscribe((resultData: any)=>
    {
      //console.log("get retweets result data: " + resultData[0].text_content);

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

  getFollowerCount()
  {
    console.log(this.followers.length); //for testing
    this.user.follower_count == String(this.followers.length);
  }

  styleButton()
  {
    if (this.isVisible)
    {
      return {
        display: 'block',
      };
    }
    else
    {
      return {
        display: 'none',
      };
    }
  }

  getFollowingCount()
  {
      //make follow/following button visible
    this.isVisible = true;

    console.log(this.following.length); //for testing
    this.user.follow_count == String(this.following.length);
  }

  showFollowerList()
  {
    console.log('follower button pressed');
    this.service.setCurrentPage('ProfileFollow');
    this.service_page = 'ProfileFollow';
    this.service.routeToChild('followers');
    //maybe set tab too
    let url = window.location.pathname + "/followers"; 
    this.router.navigate([url]);
    this.inFollowLists = true;
    this.arrs = [this.followers,this.following];

  }
  showFollowingList()
  {
    console.log('following button pressed');
    this.service.setCurrentPage('ProfileFollow');
    this.service_page = 'ProfileFollow';
    this.service.routeToChild('following');
    //maybe set tab too
    let url = window.location.pathname + "/following"; 
    this.router.navigate([url]);
    this.inFollowLists = true;
    this.arrs = [this.followers,this.following];
  }

  // to go back to normal profile view
  goBack()//************************************************************************************************************* */
  {
    var arr = window.location.pathname.split("/");
    arr.pop();
    this.setBackUrl(arr);
    let check = arr.pop()
    if(check == 'Profile')
    {
      this.service.setCurrentPage('Profile') 
      this.service_page = 'Profile';
    }
    else
    {
      this.service.setCurrentPage('OtherProfile') 
      this.service_page = 'OtherProfile';
    }
    this.inFollowLists = false;

    //set arrs again
    //this.setUpProfileDataDB(); //might have to call this
    this.arrs = [this.posts,this.postsUsers,this.retweets,this.retweetsUsers,this.likes,this.likesUsers, this.media,this.mediaUsers];
    
    this.setLiked();
    this.setRetweeted();

    //navigate back to profile page
    this.router.navigate([this.backUrl]);
  }

  //error with media and likes not populating properly coming up
  //(i think it could be the timing of fucntions firing)
  goToSearchProfile(str: string/*, searchBar: SearchBarComponent*/)
  {
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
    this.last_url_section = str;

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
    }

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
    this.setUpProfileDataDB(false);
    this.arrs = [this.posts,this.postsUsers,this.retweets,this.retweetsUsers,this.likes,this.likesUsers, this.media,this.mediaUsers];
    //this.arrs = [this.posts,this.retweets,this.likes, this.media];
    this.setLiked();
    this.setRetweeted();
  }

  /*
  setUpProfileDataDB2()
  {
    let globalObj = this;

        const postPromise1 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.checkUserInDB();
            resolve('we got a response');
          }, 0) // 0 secs

        })

        const postPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getPosts();
            resolve('we got a response');
          }, 500) // 0.5 secs

        })

        const postPromise3 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getLikes();
            resolve('we got a response');
          }, 1000) // 0.5 secs

        })
        const postPromise6 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getRetweets();
            resolve('we got a response');
          }, 1500) // 0.5 secs

        })

        const postPromise4 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getFollowers();
            resolve('we got a response');
          }, 2000) // 0.5 secs

        })

        const postPromise5 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getFollowing();
            resolve('we got a response');
          }, 2500) // 1 secs

        })

        const checkPromise1 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.isFollowing();
            resolve('we got a response');
          }, 3000) // 1.5 secs

        })

        const checkPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getFollowerCount();
            resolve('we got a response');
          }, 3500) // 2 secs

        })

        const checkPromise3 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getFollowingCount();
            globalObj.loadingFlag = false; //set loading flag to false
            resolve('we got a response');
          }, 4000) // 2 secs

        })

        async function myAsync(){
          //console.log("inside myAsync");
          try{
            postPromise1;
            postPromise2;
            postPromise3;
            postPromise4;
            postPromise5;
            postPromise6;
            await checkPromise1;
            await checkPromise2;
            await checkPromise3;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
        }
        myAsync();
  }*/
  setUpProfileDataDB(otherProfile: boolean)
  {
    this.checkUserInDB().subscribe(check => {

      console.log("User in DB: " + check);
      if(check) //user in DB
      {
        //clear arrs (only need this here until i save in core service)
        this.arrs = [];

        this.getPosts(otherProfile);
        this.getLikes(otherProfile);
        this.getRetweets(otherProfile);
        //this.getMedia(otherProfile) (not made yet)
        this.getFollowers(); //isFollowing is called here
        this.getFollowing(); //i may only have to call this if in followlist

        //beacuse media isn't set up
        this.arrs[6] = [];
        this.arrs[7] = [];
        //need to have a flag for each process that has to set to false when done (replace loading flag)
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
    });
   
    
       
  }


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

      this.service.UserFollowingList.push(this.acc_name);//adding to global list
    });
  }

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

      const index = this.service.UserFollowingList.indexOf(this.acc_name); //removing from global list
      if (index !== -1) 
      {
        this.service.UserFollowingList.splice(index, 1)
      }

    });
  }
  handleFollowClick()
  {
    if(this.isFollow)
    {
      //do nothing (just atm)
      this.isFollow = false;
      this.unfollowUser(); //this causes tabs on profile page to populate inaccurately (for some reason)

      //consider updating arrs
     // let temp = this.followers.filter((user) => user.acc_name != this.user.acc_name);
      //this.arrs = [temp,this.following];
    }
    else
    {
      this.isFollow = true;
      this.followUser();

      //consider updating arrs
      //this.followers.push(this.user);
      //this.arrs = [this.followers,this.following];

    }
  }

  //either 'following' or 'follower'
convertDBInfo(arr_type: string, DBFollow: any [])
{   
  if( arr_type == 'following' && DBFollow.length > 0)
  {
    for (let i = 0; i < DBFollow.length;i++) {
      let user = DBFollow[i];
      var u = new Profile(user.pic?.image_url, user.header_pic?.image_url,user.username, user.acc_name, user.bio, user.following_count, user.follower_count); //need to find where to keep bio, and counts in db
      this.following.push(u);
    }
    
  }
  if( arr_type == 'follower' && DBFollow.length > 0)
  {
    for (let i = 0; i < DBFollow.length;i++) {
      let user = DBFollow[i];
      var u = new Profile(user.pic?.image_url, user.header_pic?.image_url,user.username, user.acc_name, user.bio, user.following_count, user.follower_count); //need to find where to keep bio, and counts in db
      this.followers.push(u);
    }
   
  }  
}

 //either 'posts' or 'retweets' or 'likes'
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

 setRetweeted()
 {
   let globalObj = this;

       const postPromise = new Promise<any>(function (resolve, reject) {
         setTimeout(() => {
           reject("We didn't get a response")
         }, 5000) // 5 secs

         setTimeout(() => {
           //globalObj.last_like_ids = globalObj.tweetService.DBlikes; //NEW
           globalObj.tweetService.getRetweetIDsDB(globalObj.service_acc_name);
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

 setLiked()
 {
   let globalObj = this;

       const postPromise = new Promise<any>(function (resolve, reject) {
         setTimeout(() => {
           reject("We didn't get a response")
         }, 5000) // 5 secs

         setTimeout(() => {
           //globalObj.last_like_ids = globalObj.tweetService.DBlikes; //NEW
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
         }, 500) // 0 secs

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
     
     this.service.current_tab = str; //new
     this.service.routeToChild(str);
     this.router.navigate([url]);
   }
   
 }
 
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

 /* currently not pursing this implementation
 profileStyle()
 {
  console.log("this.service.current_page:" + this.service.current_page + " this.service.other_profile_flag: " +this.service.other_profile_flag);
  if(this.service.current_page == 'Profile' || this.service.other_profile_flag == true)
  {
    return {
        display: 'block',
      };
  }
  else
  {
    return{
        display: 'none',
      };
  }
 }
 otherProfileStyle()
 {
  if(this.service.current_page == 'OtherProfile' && this.service.other_profile_flag == false)
    {
      return {
          display: 'block',
        };
    }
    else
    {
      return{
          display: 'none',
        };
    }
 }
  */

 showEPModal()
 {
  this.showep = true;
  console.log('showing edit profile modal');
 }

}