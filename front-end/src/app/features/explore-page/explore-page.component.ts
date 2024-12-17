import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service'; 
import { HttpClient } from '@angular/common/http';
import { TweetService } from '../../core/tweet-service';
import { createEntertainmentSearchTopics, createForYouSearchTopics, createNewsSearchTopics, createSportsSearchTopics, createTrendingSearchTopics, Profile } from '../../core/data';

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
   arr: any [];

   DBUserFeed: any [] = [];
   userList: Profile [] = [];

   //explore page data
  forYouSearchTopics = createForYouSearchTopics();
  trendingSearchTopics = createTrendingSearchTopics();
  newsSearchTopics = createNewsSearchTopics();
  sportsSearchTopics = createSportsSearchTopics();
  entertainmentSearchTopics = createEntertainmentSearchTopics();

  constructor(private router: Router,private http: HttpClient,authService: AuthService, route: ActivatedRoute, service2: CoreService, public tweetService: TweetService) {
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
      //get last_url_section from url
      var arr = window.location.pathname.split("/");
      this.last_url_section = arr.pop() ??"error";
      let second_last_url = arr.pop() ??"error";
      //this.setBackUrl(arr); idk of this is even necessary
      var arr2 = window.location.pathname.split("/");
      console.log("arr2 length: " + arr2.length);
      if (arr2.length > 4) //error
      {
        this.router.navigate(['tweeter/Error']);
      //get second_last_url from url
      }
      if(second_last_url != 'tweeter')
      {
        //still need to implement inSearch in html
        this.inActiveSearch = true;
        this.query = this.last_url_section;
        console.log('query'+ this.query);

        //setting searchbar 
        //this.searchForm.value.inquiry = 'hanna';
        let search_input = <HTMLInputElement>document.getElementById("search-searchbar");
        search_input!.value = this.query;
        console.log('search_input!.value: '+ search_input!.value);

        //will need to change to OtherExplore
        this.service.setCurrentPage('OtherExplore'); //could be redundant
        this.service_page = 'OtherExplore'; //cound be redundant

        //set arr data
        this.getDBUserFeed(this.query)

        setTimeout(() => {
          this.arr = ['','',this.userList,''];
        }, 1000) // 1 sec
        
      }
      else
      {
        this.service.setCurrentPage('Explore'); //could be redundant
        this.service_page = 'Explore'; //cound be redundant
        this.inActiveSearch = false;

        this.arr = [this.forYouSearchTopics,this.trendingSearchTopics, this.newsSearchTopics, this.sportsSearchTopics, this.entertainmentSearchTopics];
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
                "pic" : "p", //new 
                "header_pic" : "p",
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
            this.http.put("http://127.0.0.1:8000/user",requestBody).subscribe((resultData: any)=>
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
            var u = new Profile(user.pic,user.header_pic, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
            this.userList.push(u);
          }
      }

    //fired upon click of arrow, when user has an active search, will redirect to default explore page view
    goBack()
    {
      this.last_url_section = 'Explore';
      this.inActiveSearch = false;
      this.query = '!@#$%^&*()_+';
      //unselect tab
      this.service.routeToChild('');
      //run stuff for default view
      this.arr = [this.forYouSearchTopics,this.trendingSearchTopics, this.newsSearchTopics, this.sportsSearchTopics, this.entertainmentSearchTopics];

      this.router.navigate(['tweeter/Explore']);
    }
}
