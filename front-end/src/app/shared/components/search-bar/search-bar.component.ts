import { Component, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { createNewsSearchTopics, Profile, SearchTopic } from "../../../core/data";
import { CoreService } from "../../../core/core-service.service";
import { HttpClient } from "@angular/common/http";
import { ProfilePageComponent } from "../../../features/profile-page/profile-page.component";
import { TweetService } from "../../../core/tweet-service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../core/auth.service";

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
@Input() ppg = new ProfilePageComponent(this.router,this.http,this.authService,this.route,this.service,this.tweetService)

wordlist: string [] = ['hello','goodbye','good','dog','boy','toy','fleece','bacon','shake','hands','bands', 'bowl','hair', 'but', 'cut', 'what', 'shut', 'mutt', 'wear','orange','yellow',  'blue', 'green', 'red', 'purple', 'oval', 'office', 'olive', 'john', 'bear', 'cat', 'fish', 'salmon', 'burger', 'her', 'she', 'chocolate', 'milk', 'axe', 'zebra', 'mormon', 'harmonica', 'melody', 'arial', 'trival','beach', 'steak', 'street', 'sign'];


focus:boolean = false;
blur: boolean = true;
modalFlag:boolean = false;


DBUserFeed: any [] = [];
userList: Profile [] = [];
DBTopicFeed: any [] = [];
queryList: SearchTopic [] = [];
queryList2: string [] = [];

searchForm = this.formBuilder.group({
  inquiry: ['', [Validators.required]],
  });
  
  constructor(private formBuilder: FormBuilder, public service: CoreService, public http: HttpClient, public router: Router, public authService: AuthService, public route: ActivatedRoute, public tweetService: TweetService) {}
  //constructor(private formBuilder: FormBuilder, public service: CoreService, private http: HttpClient) {}
  
  
  
  ngOnInit()
  {
    this.onChanges();
    this.convertQueryFeed();
  }
 

    onChanges(): void {
      this.searchForm.get('inquiry')?.valueChanges.subscribe(val => {
        if((val?.length?? 0 )> 1)
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
  
    onSubmit(){
  
      if(this.searchForm.valid)
      {
  
          
        console.log("submitted");
      }
      else
      {
        console.log("not submitted");
      }
    
      
    }

    hideModal()
    {
    }

    


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
    }
    testCheck(str: string)
    {
      //this.queryList = [];
      this.queryList = [];
      this.DBTopicFeed.forEach(t =>{
        
        if(t.topic.startsWith(str))
        {
          this.queryList.push(t);
        }
      });
    }

  getDBUserFeed(str:string)
  {
    if(str != '')
    {
      let requestBody =
          {
            "username" : 'getUserSearch',
            "email" : 'e',
            "acc_name" : str,//current value of input
            "password" : 'p',
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


  convertQueryFeed()
  {
    this.DBTopicFeed = createNewsSearchTopics();
  }

  convertUserFeed()
  {   
    //clear feed
    this.userList = [];

    for (let i = 0; i < this.DBUserFeed.length;i++) 
      {
        let user = this.DBUserFeed[i];
        var u = new Profile(user.pic, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
        this.userList.push(u);
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
  