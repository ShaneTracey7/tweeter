import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { Profile } from "../../../core/data";
import { FormBuilder, Validators } from "@angular/forms";
import { CoreService } from "../../../core/core-service.service";
import { HttpClient } from "@angular/common/http";
import { MessagePageComponent } from "../message-page.component";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";

@Component({

    selector: 'new-message-modal',
    templateUrl: './new-message-modal.component.html',
    styleUrl: '../message-page.component.scss',
  })
  export class NewMessageModalComponent {
  
 @Input() postID: number = 0;
 @Input() inPost: boolean = false;
 @Input() show: boolean = false;
 @Output() showChange = new EventEmitter<boolean>(); //not in use rn
 @Input() mpc: MessagePageComponent = new MessagePageComponent(this.formBuilder, this.route, this.service); //need for only createDB function
  selectedUser: string = ''; //account name of selected user
  
  DBUserFeed: any [] = [];
  userList: Profile [] = []; //list of users to show in search

  DBDefaultFeed: any [] = []; 
  defaultList: Profile []; //default list of users to show when no value in search input

  service_acc_name: string;
  
  searchForm = this.formBuilder.group({
    inquiry: ['', [Validators.required]],
    });
    
    constructor(private formBuilder: FormBuilder, public service: CoreService, public http: HttpClient, public route: ActivatedRoute) 
    {
        this.service_acc_name = '';
        this.defaultList = [];
    }
    
    ngOnInit()
    {
      this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";
      this.onChanges();
    }

    //only makes api call when component is shown
    ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']) {
      
      const showCurrent = changes['show'].currentValue;
      if(showCurrent)
      {
        this.getDBDefaultFeed();
      }
    }
  }
   //when input value changes, get users from db
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
        this.selectedUser = ''; //necessary
        console.log("value: " + val);
      });
    }

      onSubmit(){
  
        if(/*this.searchForm.valid && */this.selectedUser != '')
        {
          //hide modal
          this.hideModal();

          if(this.inPost) //sharing a tweet
          {
            this.service.shareID = this.postID;
            this.service.shareUser = this.selectedUser;
            this.service.router.navigate(['tweeter/Messages']);  
          }
          else
          {
          //create convo in Db
          this.mpc.createDBConvo(this.service_acc_name,this.selectedUser, false);

          //set new convo to selected, so secondary component shows view of convo
          this.selectedUser = ''; //necessary
          console.log("submitted");
          }
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
        this.http.put(environment.apiUrl + "/follow",requestBody).subscribe((resultData: any)=>
        {
          if(resultData == 'Failed to Add' || resultData == 'No following' || resultData == 'check is else')
            {
              console.log(resultData);
              this.defaultList = [];
              this.DBDefaultFeed = [];
              console.log('Unsuccessful data base retrieval');
            }
            else //Successful
            {
              this.DBDefaultFeed = resultData;
              //console.log(this.DBDefaultFeed);
              this.convertUserFeed(true);
              console.log('Successful data base retrieval');
            }
        });
  }

  //get users from db based on search input
  //if str is empty, it will return default list
  getDBUserFeed(str:string)
  {
    if(str != '')
    {
      let requestBody =
          {
            "username" : 'getUserSearch',
            "email" : 'email@gmail.com',
            "acc_name" : this.service_acc_name,
            "password" : str,//current value of input  /* need to change this (backend needs min 8 char for password*/  
            "pic" : null, //new 
            "header_pic" : null,
            "bio" : "b",
          };

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
              //console.log(this.DBUserFeed);
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
            var u = new Profile(user.pic?.image_url,user.header_pic?.image_url, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
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
            var u = new Profile(user.pic?.image_url,user.header_pic?.image_url, user.username, user.acc_name, user.bio, user.following_count, user.follower_count);
            this.userList.push(u);
        }
    }
  }
  hideModal()
  {
    this.show = false;
    this.showChange.emit(false);
  }
}