import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Profile } from "../../../core/data";
import { CoreService } from "../../../core/core-service.service";
import { HttpClient } from "@angular/common/http";

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
wordlist: string [] = ['hello','goodbye','good','dog','boy','toy','fleece','bacon','shake','hands','bands', 'bowl','hair', 'but', 'cut', 'what', 'shut', 'mutt', 'wear','orange','yellow',  'blue', 'green', 'red', 'purple', 'oval', 'office', 'olive', 'john', 'bear', 'cat', 'fish', 'salmon', 'burger', 'her', 'she', 'chocolate', 'milk', 'axe', 'zebra', 'mormon', 'harmonica', 'melody', 'arial', 'trival','beach', 'steak', 'street', 'sign'];


focus:boolean = false;

DBUserFeed: any [] = [];
userList: Profile [] = [];
queryList: string [] = [];

searchForm = this.formBuilder.group({
  inquiry: ['', [Validators.required]],
  });
  
  constructor(private formBuilder: FormBuilder, public service: CoreService, private http: HttpClient) {}
  
  ngOnInit()
  {
    this.onChanges();
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

    handleClear()
    {
      this.searchForm.reset();
      this.searchForm.value.inquiry = '';
    }


    testCheck(str: string)
    {
      this.queryList = [];
      this.wordlist.forEach(word =>{
        
        if(word.startsWith(str))
        {
          this.queryList.push(word);
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

}
  