import { Component, EventEmitter, Input, Output } from "@angular/core";
import { createAllProfiles, Profile } from "../../../core/data";
import { FormBuilder, Validators } from "@angular/forms";
import { CoreService } from "../../../core/core-service.service";
import { HttpClient } from "@angular/common/http";

@Component({

    selector: 'new-message-modal',
    templateUrl: './new-message-modal.component.html',
    styleUrl: '../message-page.component.scss',
  
  })
  export class NewMessageModalComponent {
  
 @Input() show: boolean = false;
 @Output() showChange = new EventEmitter<boolean>(); //not in use rn

  DBUserFeed: any [] = [];
  userList: Profile [] = [];

  DBDefaultFeed: any [] = [];
  defaultList: Profile []; 

  service_acc_name: string;
  
  searchForm = this.formBuilder.group({
    inquiry: ['', [Validators.required]],
    });
    
    constructor(private formBuilder: FormBuilder, public service: CoreService, public http: HttpClient) 
    {
        this.service_acc_name = '';
        this.defaultList = [];
        //this.defaultList = createAllProfiles(); only used for testing
    }
    
    ngOnInit()
    {
      this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";
      this.getDBDefaultFeed();
      this.onChanges();
    }
   
  
      onChanges(): void {
        this.searchForm.get('inquiry')?.valueChanges.subscribe(val => {
          if((val?.length?? 0 )> 1)
          {
            //insert logic to set userList and queryList
            this.getDBUserFeed(val?? '');
  
          }
          else
          {
            this.userList = [];
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

  // get top 10 followers or less
  getDBDefaultFeed()
  {
      let requestBody =
          {
            'word': 'getDefaultList',
            'word2': this.service_acc_name,
          };
        this.http.put("http://127.0.0.1:8000/follow",requestBody).subscribe((resultData: any)=>
        {
          if(resultData == 'Failed to Add' || resultData == 'No users' || resultData == 'check is else')
            {
              console.log(resultData);
              this.defaultList = [];
              this.DBDefaultFeed = [];
              console.log('Unsuccessful data base retrieval');
            }
            else //Successful
            {
              this.DBDefaultFeed = resultData;
              console.log(this.DBDefaultFeed);
              this.convertUserFeed(true);
              console.log('Successful data base retrieval');
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
              this.convertUserFeed(false);
              console.log('Successful data base retrieval');
            }
        });
    }
  }

  convertUserFeed(isDefault: boolean)
  {   
    if(isDefault)
    {
        this.defaultList = [];

        for (let i = 0; i < this.DBDefaultFeed.length;i++) 
        {
            let user = this.DBDefaultFeed[i];
            var u = new Profile(user.pic, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
            this.defaultList.push(u);
        }
    }
    else
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
  
}