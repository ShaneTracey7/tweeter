import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import {Profile, elon} from '../../core/data'
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent extends CoreComponent{
  
  //figure out a way to make this view work for any user (currently defaults to logged in user)
  elon = elon;
  acc_name = ""; //might phase this out
  isValid:boolean = true;
  user: Profile = new Profile("", "", "", "", 0, 0);
  tmp: string;
  //isValid2 = false;
  /*
  ngOnInit(): void {

    let tmp = window.location.pathname.split("/").pop()??"error";
    if (tmp == "Profile")
      {
        this.acc_name = this.service.acc_name;
      }
    else
      {
        this.acc_name = tmp;
        this.checkUserInDB();
      }
    console.log(this.acc_name); 

    
  }*/

  constructor(private http: HttpClient,authService: AuthService, route: ActivatedRoute, service: CoreService) {
    super(authService,route,service);

    this.tmp = window.location.pathname.split("/").pop()??"error";
    if (this.tmp == "Profile")
      {
        this.acc_name = this.service.acc_name; //might phase this out
        this.checkUserInDB(); //to get user data
         //testing
      }
    else
      {
        this.service.setCurrentPage('OtherProfile');
        this.acc_name = this.tmp; //might phase this out
        this.checkUserInDB();
      }
      console.log(this.acc_name); 
  }
  
  checkUserInDB()
  {
  let requestBody =
    {
      "username" : 'getUser',
      "email" : 'e',
      "acc_name" : this.acc_name,
      "password" : 'p',
      "pic" : 'url', //new
    };

    this.http.put("http://127.0.0.1:8000/user",requestBody).subscribe((resultData: any)=>
    {
        console.log(resultData);
    
        if(resultData == "User doesn't exist" || resultData == "Failed to Add")
        {
          this.user = new Profile("","",this.tmp,"",0,0)
          this.isValid = false;
        }
      else
        {
          this.user = new Profile(resultData.pic,resultData.username,resultData.acc_name,"",0,0)
          this.isValid = true;
        }
    });
  }

  checkUserInDB2()
  {
  let requestBody =
    {
      "username" : 'credentialsCheck',
      "email" : 'e',
      "acc_name" : this.acc_name,
      "password" : 'p',
      "pic" : 'url', //new
    };

    this.http.put("http://127.0.0.1:8000/user",requestBody).subscribe((resultData: any)=>
    {
        console.log(resultData);
    
        if(resultData == "AC exists, P incorrect")
        {
          this.isValid = true;
        }
      else
        {
          this.isValid = false;
        }
    });
  }

/*
  profileExists()
  {

    let obj = this;

    const postPromise = new Promise<any>(function (resolve, reject) {
      setTimeout(() => {
        reject("We didn't get a response")
      }, 5000) // 5 secs

      setTimeout(() => {
        obj.checkUserInDB()
        resolve('we got a response');
      }, 1000) // 0 secs

    })

    const checkPromise = new Promise<any>(function (resolve, reject) {
      setTimeout(() => {
        reject("We didn't check")
      }, 8000) //8 secs

      setTimeout(() => {
        
        resolve('we checked');
      }, 2000) // 2 sec

    })

    async function myAsync(){
      //console.log("inside myAsync");
      var result;
      try{
        postPromise;
        await checkPromise ;
      }
      catch (error) {
        console.error('Promise rejected with error: ' + error);
      }
      //console.log("end of myAsync");
    }
    
    myAsync();

    return ;
  }*/
  
}