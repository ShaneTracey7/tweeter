import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { createNewsSearchTopics, createSearchBarTopics, Post, Profile, SearchTopic } from "../../../core/data";
import { CoreService } from "../../../core/core-service.service";
import { HttpClient } from "@angular/common/http";
import { ProfilePageComponent } from "../../../features/profile-page/profile-page.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../core/auth.service";
import { environment } from "../../../../environments/environment";
import { firstValueFrom, map, Observable } from "rxjs";

@Component({

    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss',
    
  })
  export class SearchBarComponent {
  
/*
create a modal
-display up to 13 items ( 3 searches & 10 profiles)
-display a 14th option to visit " @'typed value' "

create a form
-submits only value/item that is selected in modal
-updates modal based upon input 
on submit, 
-go to selected profile/" @'typed value' " 
        OR
-to search page with populated feed based off search


*/
@Input() epc: any = '';
@Input() defaultValue: string = '';
@Input() inActiveSearch: boolean = false;
@Output() inActiveSearchChange = new EventEmitter<boolean>();

@Input() data: any = []; // [for you, trending, news, sports, entertainment] or [tweets, tweetsUsers, users, media]
@Output() dataChange = new EventEmitter<any>();

@Input() query: string = '';
@Output() queryChange = new EventEmitter<any>();

@Input() postFlag: boolean = false;
@Output() postFlagChange = new EventEmitter<boolean>(); //needing for loading spinner in explore page

@Input() ppg = new ProfilePageComponent(this.router,this.http,this.authService,this.route,this.service)

focus:boolean = false;
blur: boolean = true;
modalFlag:boolean = false;

prepFlag1:boolean = false;
prepFlag2:boolean = false;

//DBUserFeed: any [] = [];
userList: Profile [] = [];

queryList: SearchTopic [] = []; //tailored list of search topics inside of modal
service_acc_name: string = '';

searchForm = this.formBuilder.group({inquiry:[''],});
  
  constructor(private formBuilder: FormBuilder, public service: CoreService, public http: HttpClient, public router: Router, public authService: AuthService, public route: ActivatedRoute) 
  {}
  
  ngOnInit()
  {
   this.searchForm = this.formBuilder.group({
      inquiry: [this.defaultValue, [Validators.required]],
      });

    this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";  
    this.onChanges();
  }
 
  //when user input changes check DB
    onChanges(): void {
      this.searchForm.get('inquiry')?.valueChanges.subscribe(val => {
        if((val?.length?? 0 )> 2)
        {
          //insert logic to set userList and queryList
          this.addTopics(val?? '');
          this.getDBUserFeed(val?? '');
        }
        else
        {
          this.userList = [];
          this.queryList = [];
        }
        console.log("value: " + val);
      });
    }
  
    //setting value for seach bar input upon redirect (mainly inside of explorepage, not positive tho)
    ngOnChanges(changes: SimpleChanges){
      
        if (changes['defaultValue']) {
          console.log("**ngOnChanges**");
          if(this.defaultValue == '!@#$%^&*()_+')
          {
            this.focus = false;
            this.searchForm.reset();
            this.searchForm.value.inquiry = '';
          }
        }
        if (changes['query']) {
          if(this.query != '!@#$%^&*()_+')
          {
            this.searchForm.value.inquiry = this.query;
            let search_input = <HTMLInputElement>document.getElementById("search-searchbar");
            search_input!.value = this.query;
          }
          
        }
    }
    //handles hitting 'enter' of search bar
    onSubmit(){
  
      if(this.searchForm.valid)
      {
        //hide modal
        this.modalFlag = false;
        this.focus =false;

        this.inActiveSearch = true;
        this.inActiveSearchChange.emit(this.inActiveSearch);

        this.service.routeToChild('blank');

        this.userList = []; //clears user data of search modal

        var arr = window.location.pathname.split("/");
        let last_url_section = arr.pop();
        let second_last_url = arr.pop();
        if(last_url_section == 'Explore' || second_last_url == 'Explore') //on explore page
        {
          //set data arr and emit back to explore page [tweets, tweetsUsers, users, media]
          let searchQuery = this.searchForm.value.inquiry?? '';
          if(searchQuery != '')
          {
            this.postFlagChange.emit(true); //start loading spinner

            this.prepExplorePage(searchQuery).then(({ posts, postUsers, users }) => {

            console.log('posts:', posts);
            console.log('users:', users);
            console.log('postUsers:', postUsers);
            this.dataChange.emit([posts, postUsers, users, []])
            this.queryChange.emit(searchQuery);

            this.postFlagChange.emit(false); //stop loading spinnner
            //this.foryouLoadingFlag = false;
            });
          }
          else{
            this.dataChange.emit([[], [], [], []])
            this.queryChange.emit('');
          }
        }

        //none for media [3] is always empty
        this.router.navigate(['tweeter/Explore/' + this.searchForm.value.inquiry]); //new
        this.service.routeToChild('latest');
      
        console.log("submitted");
      }
      else
      {
        console.log("not submitted");
      }
    }

    //populates search bar modal with topics based off user input (used to be testCheck)
    addTopics(str: string)
    {
      this.queryList = [];

      let checkInput = str.toLowerCase()
      var count = 0;
      for(const t of this.service.SearchBarTopics) //this.DBTopicFeed
      {
        if(count == 3)
        {
          return;
        }
        let checkString = t.topic.toLowerCase();
        if(checkString.startsWith(checkInput))
          {
            this.queryList.push(t);
            count++;
          }
      }
    }

  //populates user suggestions in search modal
  getDBUserFeed(str:string)
  {
    if(str != '')
    {
      let requestBody =
          {
            "username" : 'getUserSearch',
            "email" : 'e',
            "acc_name" : this.service_acc_name, //logged in user's acc_name to exclude
            "password" : str.toLowerCase(),//current value of input
            "pic" : null, //new 
            "header_pic" : null,
            "bio" : "b",
            "follower_count" : 0,
            "following_count" : 0,
          };

        this.http.put(environment.apiUrl +"/user",requestBody).subscribe((resultData: any)=>
        {
          if(resultData == 'Failed to Add' || resultData == 'No users' || resultData == 'check is else')
            {
              console.log(resultData);
              this.userList = [];
              console.log('Unsuccessful data base retrieval');
            }
            else //Successful
            {
              this.convertUserFeed(resultData);
              console.log('Successful data base retrieval');
            }
        });
    }
  }

  convertUserFeed(feed: any [])
  {   
    //clear feed
    this.userList = [];

    for (let i = 0; i < feed.length;i++) 
      {
        let user = feed[i];
        var u = new Profile(user.pic?.image_url,user.header_pic?.image_url, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
        this.userList.push(u);
      }
  }

//called upon submission from explore page preps the data arr
async prepExplorePage(str:string): Promise<{posts: Post[] , postUsers: Profile[], users: Profile[]}> {

  let users: Profile [] = [];
  let posts: Post [] = [];
  let postUsers: Profile [] = [];

  try {
     const requestBody1 = {
        "username" : 'getUserSearch',
        "email" : 'e',
        "acc_name" : this.service_acc_name, //logged in user's acc_name to exclude
        "password" : str.toLowerCase(),//current value of input
        "pic" : null, //new 
        "header_pic" : null,
        "bio" : "b",
        "follower_count" : 0,
        "following_count" : 0,    
      };

    const userResponse = await firstValueFrom(this.http.put<any>(environment.apiUrl + "/user", requestBody1));

    if (userResponse == 'Failed to Add' || userResponse == 'No users' || userResponse == 'check is else') 
    {
      console.log("prep explore page getUserSearch: " + userResponse);
    }
    else
    {
      for (let i = 0; i < userResponse.length;i++) 
        {
          let user = userResponse[i];
          var u = new Profile(user.pic?.image_url,user.header_pic?.image_url, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
          users.push(u);
        }
    }

    const requestBody2 = {
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

    const postResponse = await firstValueFrom(this.http.put<any>(environment.apiUrl + "/user", requestBody2));

    if (postResponse == 'Failed to Add' || postResponse == 'No posts' || postResponse == 'check is else') 
    {
      console.log("prep explore page getUserSearch: " + postResponse);
    }
    else
    {
      for (let i = 0; i < postResponse[0].length;i++) 
        {
          let user = postResponse[1][i];
          let post = postResponse[0][i];
          var u = new Profile(user.pic?.image_url,user.header_pic?.image_url, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
          postUsers.push(u);
          var p = new Post(post.id,user.pic?.image_url, user.username, user.acc_name,post.date_created, post.text_content, '', post.comments.toString(), post.retweets.toString(), post.likes.toString(), post.engagements.toString()); 
          posts.push(p);
        }
    }

    return { posts: posts, postUsers: postUsers, users: users};
  } 
  catch (error) {
    console.error("Error loading For You feed:", error);
    return { posts: [], postUsers: [], users: []};
  }
}

  //when 'go to @<insert-inquiry-value>' is clicked
  handleGoTo()
  {
    if(this.service.current_page == "Profile" || this.service.current_page == "OtherProfile")
    {
      this.ppg.goToSearchProfile(this.searchForm.value.inquiry ?? ''/*, this*/);
       this.handleClear()//hide search bar modal and clear
    }
    else
    {
      let route = "/tweeter/Profile/" + this.searchForm.value.inquiry;
      this.service.setCurrentPage('OtherProfile');
      this.service.router.navigate([route]);
    }
  }

  //called when false (idk if this does much)
  handleMouseLeave()
  {
    console.log('mouseleave')
    this.modalFlag = false

    if(this.blur)
      {
        this.focus = false;
      }  
  }

  //when search bar unfocused(blurred)
  handleBlur()
  {
    this.blur =true;

    if(this.modalFlag)
    {
      this.focus = true;
      //this.modalFlag =false;
    }
    else
    {
      this.focus = false;
    }
  }

  //clears searchbar input when 'x' button is clicked
  handleClear()
    {
      this.focus = false;
      this.searchForm.reset();
      this.searchForm.value.inquiry = '';
    }
}
  