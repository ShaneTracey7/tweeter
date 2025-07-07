import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { createNewsSearchTopics, createSearchBarTopics, Post, Profile, SearchTopic } from "../../../core/data";
import { CoreService } from "../../../core/core-service.service";
import { HttpClient } from "@angular/common/http";
import { ProfilePageComponent } from "../../../features/profile-page/profile-page.component";
import { TweetService } from "../../../core/tweet-service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../core/auth.service";
import { environment } from "../../../../environments/environment";

@Component({

    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss',
    
  })
  export class SearchBarComponent {
  
// My goal
/*
create an input 
-that is typeable
- that has a clear option

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

@Input() data: any = [];
@Output() dataChange = new EventEmitter<any>();

@Input() query: string = '';
@Output() queryChange = new EventEmitter<any>();

@Input() ppg = new ProfilePageComponent(this.router,this.http,this.authService,this.route,this.service,this.tweetService)

wordlist: string [] = ['hello','goodbye','good','dog','boy','toy','fleece','bacon','shake','hands','bands', 'bowl','hair', 'but', 'cut', 'what', 'shut', 'mutt', 'wear','orange','yellow',  'blue', 'green', 'red', 'purple', 'oval', 'office', 'olive', 'john', 'bear', 'cat', 'fish', 'salmon', 'burger', 'her', 'she', 'chocolate', 'milk', 'axe', 'zebra', 'mormon', 'harmonica', 'melody', 'arial', 'trival','beach', 'steak', 'street', 'sign'];


focus:boolean = false;
blur: boolean = true;
modalFlag:boolean = false;


DBUserFeed: any [] = [];
userList: Profile [] = [];

 DBFeed: any [] = [];
 postList: Post [] = [];
 postUserList: Profile [] = [];


DBTopicFeed: any [] = [];
queryList: SearchTopic [] = [];
queryList2: string [] = [];
service_acc_name: string = '';

searchForm = this.formBuilder.group({inquiry:[''],});
  
  constructor(private formBuilder: FormBuilder, public service: CoreService, public http: HttpClient, public router: Router, public authService: AuthService, public route: ActivatedRoute, public tweetService: TweetService) 
  {
    
  }
  
  ngOnInit()
  {
   this.searchForm = this.formBuilder.group({
      inquiry: [this.defaultValue, [Validators.required]],
      });

    this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";  
    this.onChanges();
    this.convertQueryFeed();
  }
 

    onChanges(): void {
      this.searchForm.get('inquiry')?.valueChanges.subscribe(val => {
        if((val?.length?? 0 )> 2)
        {
          //insert logic to set userList and queryList
          this.testCheck(val?? '');
          this.getDBUserFeed(val?? '');

        }
        else
        {
          this.userList = [];
          this.queryList = [];
          this.queryList2 = [];
        }
        console.log("value: " + val);
      });
    }
  
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

    onSubmit(){
  
      if(this.searchForm.valid)
      {
        
        //hide modal
        this.modalFlag = false;
        this.focus =false;

        this.inActiveSearch = true;
        this.inActiveSearchChange.emit(this.inActiveSearch);

        this.service.routeToChild('blank');
        //do all the db calls from here to populate the arrays

        //one for latest (get posts [0] and users [1])
        this.postList = [];
        this.postUserList = [];
        this.getDBPostFeed(this.searchForm.value.inquiry?? '')

        //one for people (get users [2])
        this.userList = [];
        this.getDBUserFeed(this.searchForm.value.inquiry?? '');

        //none for media [3] is always empty

        setTimeout(() => {
          this.dataChange.emit([this.postList,this.postUserList,this.userList,'']);
          this.queryChange.emit(this.searchForm.value.inquiry);
          this.router.navigate(['tweeter/Explore/' + this.searchForm.value.inquiry]); //new
          console.log("submitted");
        }, 1000) // 1 sec
        
        setTimeout(() => {
          this.service.routeToChild('latest');
        }, 2000) // 2 sec

        
      }
      else
      {
        console.log("not submitted");
      }
    
      
    }

    hideModal()
    {
    }

  /*
    testCheck2(str: string)
    {
      //this.queryList = [];
      this.queryList2 = [];
      this.wordlist.forEach(word =>{
        
        if(word.startsWith(str))
        {
          this.queryList2.push(word);
        }
      });
    }*/
    testCheck(str: string)
    {
      //this.queryList = [];
      this.queryList = [];
      /*this.DBTopicFeed.forEach((t) =>{
        
        if(t.topic.startsWith(str))
        {
          this.queryList.push(t);
        }
      });*/
      let checkInput = str.toLowerCase()
      var count = 0;
      for(const t of this.DBTopicFeed)
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
        this.http.put(environment.apiUrl +"/user",requestBody).subscribe((resultData: any)=>
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


  convertQueryFeed()
  {
    this.DBTopicFeed = createSearchBarTopics();
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
            this.http.put(environment.apiUrl + "/user",requestBody).subscribe((resultData: any)=>
            {
              if(resultData == 'Failed to Add' || resultData == 'No posts' || resultData == 'check is else')
                {
                  console.log(resultData);
                  this.postList = [];
                  this.postUserList = [];
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
            var u = new Profile(user.pic,user.header_pic, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
            this.postUserList.push(u);
            var p = new Post(post.id,user.pic, user.username, user.acc_name,post.date_created, post.text_content, '', post.comments.toString(), post.retweets.toString(), post.likes.toString(), post.engagements.toString()); 
            this.postList.push(p);
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

  //called when false 
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

  handleClear()
    {
      this.focus = false;
      this.searchForm.reset();
      this.searchForm.value.inquiry = '';
    }
}
  