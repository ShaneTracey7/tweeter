import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service'; 
import { HttpClient } from '@angular/common/http';
import { TweetService } from '../../core/tweet-service';
import { createEntertainmentSearchTopics, createForYouSearchTopics, createNewsSearchTopics, createSportsSearchTopics, createTrendingSearchTopics, Post, Profile } from '../../core/data';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss'
})
export class ExplorePageComponent extends CoreComponent {
  
   inActiveSearch: boolean = false;
   //needed to ensure when logging into a different account, correct data displays
   service_acc_name: string;
   service_page: string; //needed to change current_page

   last_url_section: string;

   query: string = '';
   arr: any []; // [for you, trending, news, sports, entertainment] or [tweets, tweetsUsers, users, media]

   DBFeed: any [] = [];
   postList: Post [] = [];
   postUserList: Profile [] = [];

   DBUserFeed: any [] = [];
   userList: Profile [] = [];

   loadingPostFlag: boolean = true; //flag to show spinner while data is being fetched
   loadingUserFlag: boolean = true; //flag to show spinner while data is being fetched
   //explore page data
  forYouSearchTopics = createForYouSearchTopics();
  trendingSearchTopics = createTrendingSearchTopics();
  newsSearchTopics = createNewsSearchTopics();
  sportsSearchTopics = createSportsSearchTopics();
  entertainmentSearchTopics = createEntertainmentSearchTopics();

  constructor(public router: Router,public http: HttpClient,authService: AuthService, route: ActivatedRoute, service2: CoreService, public tweetService: TweetService) {
      super(authService,route,service2);
  
      //this.core_service = new CoreService(route,router,http);
      this.service_acc_name = "";
      //this.service_username = "";
      this.last_url_section = "";
      this.service_page = "";
      this.arr = ['','','',''];


      /* will need later 
      this.like_ids = [];
      this.retweet_ids = [];
  */

    }
  
    ngOnInit()
    {
      this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";

      //using url to make sense of what view of explore page to show (default or active search)
      var arr = window.location.pathname.split("/");
      this.last_url_section = arr.pop() ?? "error";
      let second_last_url = arr.pop() ?? "error";
      var arr2 = window.location.pathname.split("/");

      //error
      if (arr2.length > 4)
      {
        this.router.navigate(['tweeter/Error']);
      }
      //in an active search
      if(second_last_url != 'tweeter')
      {
        this.inActiveSearch = true;
      
        //getting query value
        let decodedUrl = this.last_url_section.replace(/-/g, ' '); //replaces dashes (-) with spaces
        this.query = decodedUrl;
        console.log('query'+ this.query);

        //setting searchbar value
        let search_input = <HTMLInputElement>document.getElementById("search-searchbar");
        search_input!.value = this.query;
        console.log('search_input!.value: '+ search_input!.value);

        //will need to change to OtherExplore
        this.service.setCurrentPage('OtherExplore'); //could be redundant
        this.service_page = 'OtherExplore'; //cound be redundant
        this.service.routeToChild('latest');

        //set arr data (for latest, people, and media tabs)
        this.getDBUserFeed(this.query)
        this.getDBPostFeed(this.query)

        /*
        setTimeout(() => {
          this.arr = [this.postList,this.postUserList,this.userList,''];
          this.loadingFlag = false; //hide spinner after data is loaded
        }, 1500) // 1 sec
        */
      }
      // in explore page (default view)
      else
      {
        this.service.setCurrentPage('Explore'); //could be redundant
        this.service_page = 'Explore'; //cound be redundant
        
        this.inActiveSearch = false;

        this.arr = [this.forYouSearchTopics,this.trendingSearchTopics, this.newsSearchTopics, this.sportsSearchTopics, this.entertainmentSearchTopics];
        this.loadingPostFlag = false; //hide spinner after data is loaded
        this.loadingUserFlag = false;
      }

    }

    getDBUserFeed(str:string)
      {
        if(str != '')
        {
          let requestBody =
              {
                "username" : 'getUserSearch',
                "email" : 'e',
                "acc_name" : this.service_acc_name, //logged in user's acc_name to exclude
                "password" : str,//current value of input
                "pic" : null, //new 
                "header_pic" : null,
                "bio" : "b",
                "follower_count" : 0,
                "following_count" : 0,
              };
          /*
          let requestMessage =
          {
            'word': 'getUserSearch',
            'word2': str, //current value of input
          };
          */
            this.http.put(environment.apiUrl + "/user",requestBody).subscribe((resultData: any)=>
            {
              if(resultData == 'Failed to Add' || resultData == 'No users' || resultData == 'check is else')
                {
                  console.log(resultData);
                  this.userList = [];
                  this.DBUserFeed = [];
                  console.log('Unsuccessful data base retrieval');
                }
                else //Successful
                {
                  this.DBUserFeed = resultData;
                  console.log(this.DBUserFeed);
                  this.convertUserFeed();
                  
                  console.log('Successful data base retrieval');
                }
                this.loadingUserFlag = false;
            });
        }
      }
    
      convertUserFeed()
      {   
        //clear feed
        this.userList = [];
    
        for (let i = 0; i < this.DBUserFeed.length;i++) 
          {
            let user = this.DBUserFeed[i];
            var u = new Profile(user.pic?.image_url,user.header_pic?.image_url, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
            this.userList.push(u);
          }
          this.arr[2] = this.userList;
          this.arr[3] = "";
      }

      //only returns tweets that contain 'str'
      getDBPostFeed(str:string)
      {
        if(str != '')
        {
          let requestBody =
              {
                "username" : 'getPostSearch',
                "email" : 'e',
                "acc_name" : this.service_acc_name, //idk if this is needed anymore
                "password" : str,//current value of input
                "pic" : null, //new 
                "header_pic" : null,
                "bio" : "b",
                "follower_count" : 0,
                "following_count" : 0,
              };
          /*
          let requestMessage =
          {
            'word': 'getUserSearch',
            'word2': str, //current value of input
          };
          */
            this.http.put(environment.apiUrl + "/user",requestBody).subscribe((resultData: any)=>
            {
              if(resultData == 'Failed to Add' || resultData == 'No posts' || resultData == 'check is else')
                {
                  console.log(resultData);
                  this.postList = [];
                  this.postUserList = [];
                  this.arr[0] = [];
                  this.arr[1] = [];
                  this.DBFeed = [];
                  console.log('Unsuccessful data base retrieval');
                }
                else //Successful
                {
                  this.DBFeed = resultData;
                  console.log(this.DBFeed);
                  this.convertPostFeed();
                  console.log('Successful data base retrieval');
                }
                this.loadingPostFlag = false;
            });
        }
      }
      convertPostFeed()
      {   
        //clear feed
        this.postList = [];
        this.postUserList = [];
    
        for (let i = 0; i < this.DBFeed[0].length;i++) 
          {
            let user = this.DBFeed[1][i];
            let post = this.DBFeed[0][i];
            var u = new Profile(user.pic?.image_url,user.header_pic?.image_url, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
            this.postUserList.push(u);
            var p = new Post(post.id,user.pic?.image_url, user.username, user.acc_name,post.date_created, post.text_content, '', post.comments.toString(), post.retweets.toString(), post.likes.toString(), post.engagements.toString()); 
            this.postList.push(p);
          }
          this.arr[0] = this.postList;
          this.arr[1] = this.postUserList;
      }

    //fired upon click of arrow, when user has an active search, will redirect to default explore page view
    goBack()
    {
      this.last_url_section = 'Explore';
      this.inActiveSearch = false;
      this.query = '!@#$%^&*()_+';
      
      
      //run stuff for default view
      this.arr = [this.forYouSearchTopics,this.trendingSearchTopics, this.newsSearchTopics, this.sportsSearchTopics, this.entertainmentSearchTopics];

      this.router.navigate(['tweeter/Explore']);


      this.service.routeToChild('foryou');
    }
}
