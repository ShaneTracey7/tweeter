import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  last_url_section: string;

  arrs: any[] = []; //testing to feed into main component

  isFollow: boolean = false; //if logged in user, is following user on profile page
  isVisible: boolean = false; //if follow/following button is visible
  inFollowLists: boolean = false; //if displaying following or follower lists

  DBFollowers: any [] = [];
  followers: Profile [] = []

  DBFollowing: any [] = [];
  following: Profile [] = []

  //needed to ensure when logging into a different account, correct data displays
  service_acc_name: string;
  service_username: string;
  service_page: string; //needed to change current_page

  backUrl: string;

  //core_service: CoreService;

  constructor(private router: Router,private http: HttpClient,authService: AuthService, route: ActivatedRoute, service2: CoreService) {
    super(authService,route,service2);

    //this.core_service = new CoreService(route,router,http);
    this.service_acc_name = "";
    this.service_username = "";
    this.last_url_section = "";
    this.service_page = "";
    this.backUrl = "";
  }
  /*
    //will need to change checks for arr count for github pages upload
    var arr = window.location.pathname.split("/");
    var arr2 = window.location.pathname.split("/");
    if (arr2.length > 5) //error
    {
      this.router.navigate(['/Login']);  
        //redirect to 404 page

    }
    console.log("url" + arr);
    this.tmp = arr.pop()??"error";
    if (this.tmp == "Profile")
      {
        this.acc_name = this.service.acc_name; //might phase this out
        this.setUpProfileDataDB();//this.checkUserInDB(); //to get user data
         //testing
      }
     else if (this.tmp == "followers" || this.tmp == "followers")
     {

     }
    else
      {
        this.service.setCurrentPage('OtherProfile');
        this.acc_name = this.tmp; //might phase this out
        this.setUpProfileDataDB();//this.checkUserInDB(); //didn't work properly

      }
      console.log(this.acc_name); 
      console.log("url arr:" + arr + "length: " + arr.length);
      console.log("url arr2:" + arr2 + "length: " + arr2.length);
      */
  
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

  ngOnInit()
  {
    this.service_page = this.service.current_page;
    this.service_username = localStorage.getItem('username') ?? "badToken";
    this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";
 
    //will need to change checks for arr count for github pages upload
    var arr = window.location.pathname.split("/");
    this.last_url_section = arr.pop() ??"error";
    let second_last = arr.pop() ??"error";
    //this.setBackUrl(arr); idk of this is even necessary
    var arr2 = window.location.pathname.split("/");
    console.log("arr2 length: " + arr2.length);
    if (arr2.length > 5) //error
    {
      this.router.navigate(['tweeter/Error']);
    } 
    else if (arr2.length > 4 && this.last_url_section != 'following' && this.last_url_section != 'follower')
    {
      this.router.navigate(['tweeter/Error']);
    }
    //console.log("url" + arr);
    //this.tmp = arr.pop()??"error";
    if (this.last_url_section == "Profile")
      {
        this.acc_name = this.service_acc_name; //might phase this out
        this.setUpProfileDataDB();//this.checkUserInDB(); //to get user data
        //testing
      }
    else if (this.last_url_section == "followers" || this.last_url_section == "following")
    {
        this.acc_name = second_last; 
        this.setUpProfileDataDB(); //check that 'second_last' value exists and get data
        
        //this.inFollowLists = true;
    }
    else
      {
        this.service.setCurrentPage('OtherProfile');
        this.acc_name = this.last_url_section; //might phase this out
        this.setUpProfileDataDB();//this.checkUserInDB(); //didn't work properly
      }
    console.log(this.acc_name); 
    console.log("url arr:" + arr + "length: " + arr.length);
    console.log("url arr2:" + arr2 + "length: " + arr2.length);
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
          this.user = new Profile("","",this.last_url_section,"",0,0)
          this.isValid = false;
        }
      else
        {
          this.user = new Profile(resultData.pic,resultData.username,resultData.acc_name,"",0,0)
          this.isValid = true;
        }
    });
  }

  getFollowers()
  {
    if(!this.isValid)
      {
        return;
      }

    let requestBody =
    {
      "word" : 'getFollowers',
      "word2" : this.acc_name,
    };

    this.http.put("http://127.0.0.1:8000/follow",requestBody).subscribe((resultData: any)=>
    {
      console.log(resultData);

      if(resultData == 'Failed to Add')
        {

        }
      else if(resultData == 'No followers')
        {

        }
      else
        {
          this.DBFollowers = resultData;
          this.convertDBInfo('follower');
          this.user.follower_count = String(this.DBFollowers.length);

          var fc_html = <HTMLElement>document.getElementById("ppfrc");
          fc_html.innerHTML = this.user.follower_count;

          if(this.last_url_section == "followers" || this.last_url_section == "following")
          {
            this.inFollowLists = true;
          }
        }
    });
  }

  isFollowing()
  {
    console.log("length: " + this.followers.length)
    for (let i=0; i < this.followers.length; i++)
    {
      
      console.log("this.followers[i].acc_name: " + this.followers[i].acc_name + "this.service.acc_name:" + this.service_acc_name)
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
    if(!this.isValid)
      {
        return;
      }

    let requestBody =
    {
      "word" : "getFollowing",
      "word2" : this.acc_name,
    };

    this.http.put("http://127.0.0.1:8000/follow",requestBody).subscribe((resultData: any)=>
    {
      console.log(resultData);

      if(resultData == 'Failed to Add')
        {

        }
      else if(resultData == 'No following')
        {

        }
      else
        {
          this.DBFollowing = resultData;
          this.convertDBInfo('following');
          this.user.follow_count = String(this.DBFollowing.length);
          var fc_html = <HTMLElement>document.getElementById("ppfgc");
          fc_html.innerHTML = this.user.follow_count;

        }
    });
  }

  getFollowerCount()
  {
    if(!this.isValid)
      {
        return;
      }
      console.log(this.DBFollowers.length); //for testing
    this.user.follower_count == String(this.DBFollowers.length);
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

    if(!this.isValid)
      {
        return;
      }
      console.log(this.DBFollowing.length); //for testing
    this.user.follow_count == String(this.DBFollowing.length);
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
  goBack()
  {
    var arr = window.location.pathname.split("/");
    arr.pop();
    this.setBackUrl(arr);
    this.inFollowLists = false;
    this.service.setCurrentPage('OtherProfile') // or Profile (have to create condition for this)
    this.router.navigate([this.backUrl]);
  }

  setUpProfileDataDB()
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
            globalObj.getFollowers();
            resolve('we got a response');
          }, 500) // 0.5 secs

        })

        const postPromise3 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getFollowing();
            resolve('we got a response');
          }, 1000) // 1 secs

        })

        const checkPromise1 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.isFollowing();
            resolve('we got a response');
          }, 1500) // 1.5 secs

        })

        const checkPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getFollowerCount();
            resolve('we got a response');
          }, 2000) // 2 secs

        })

        const checkPromise3 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getFollowingCount();
            resolve('we got a response');
          }, 2500) // 2 secs

        })

        async function myAsync(){
          //console.log("inside myAsync");
          try{
            postPromise1;
            postPromise2;
            postPromise3;
            await checkPromise1;
            await checkPromise2;
            await checkPromise3;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
          //console.log("end of myAsync");
        }
        
        myAsync();
  }


  followUser(){

    let requestBody =
    {
      "word" : this.acc_name,
      "word2" : this.service_acc_name,
    };

    this.http.post("http://127.0.0.1:8000/follow",requestBody).subscribe((resultData: any)=>
    {
      console.log(resultData);
      this.user.follower_count = String(Number(this.user.follower_count) + 1); //idk if this will work
    });
  }

  //either 'following' or 'follower'
convertDBInfo(arr_type: string)
{   
  if( arr_type == 'following' && this.DBFollowing.length > 0)
  {
    for (let i = 0; i < this.DBFollowing.length;i++) {
      let user = this.DBFollowing[i];
      var u = new Profile(user.pic, user.username, user.acc_name, "bio", 0, 0); //need to find where to keep bio, and counts in db
      this.following.push(u);
    }
    //console.log("length: " + this.following.length)
  }
  if( arr_type == 'follower' && this.DBFollowers.length > 0)
  {
    for (let i = 0; i < this.DBFollowers.length;i++) {
      let user = this.DBFollowers[i];
      var u = new Profile(user.pic, user.username, user.acc_name, "bio", 0, 0); //need to find where to keep bio, and counts in db
      this.followers.push(u);
    }
    //console.log("testing: "+this.DBFollowers[0].follower); //test
  }

  

  
    
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