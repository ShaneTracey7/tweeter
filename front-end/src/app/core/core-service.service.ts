import { Injectable} from "@angular/core";
import { Profile, getImgUrl } from "./data";
import { ActivatedRoute, Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CoreService {

     //used for toolbar tabs
  marker1= true; //foryou/all
  marker2= false; //following/trending/verified
  marker3= false;//mentions/news
  marker4= false;//sports
  marker5= false;//entertainment

  current_tab: string = "";
  current_page: string =  "";
  cp_style: string = "";

  username: string; 
  acc_name: string;

  validUser: boolean = false;

  
  DBUsers: any [] = [];
  UserFeed: Profile [] = [];


  constructor(public route: ActivatedRoute, public router: Router,private http: HttpClient) { 
    //this.current_page = this.route.snapshot.url.toString();
    //window.location.reload();
    this.username = localStorage.getItem('username') ?? "badToken"; 
    this.acc_name = localStorage.getItem('acc_name') ?? "badToken";
    this.createUserFeed(false, "");
    //console.log("current user acc_name: "+ this.acc_name);
  }

  //don't think this is doing anything
  ngOnDestroy()
  {
    localStorage.clear();
    console.log("ngOnDestroy called in core service");
  }

  setUrl(str: string)
  {
    return getImgUrl(str);
  }

  setCurrentPage(str: string)
  {
    const tmp = str;
    this.current_page = tmp;//new
    this.cp_style = tmp;
    this.marker1= true; 
    this.marker2= false;
    this.marker3= false; 
    this.marker4= false; 
    this.marker5= false; 

    console.log("logging page: " + this.cp_style);
  }

  boldNavbarIcon(str: string) {
    var check;

    switch(str)
    {
      case "house": check="Home";break;
      case "magnifier": check="Explore";break;
      case "envelope": check="Messages";break;
      case "bell": check="Notifications";break;
      case "user": check="Profile";break;
    }

    //console.log("Check inside boldNavbarIcon cp_style: " + this.cp_style)
    if (this.cp_style == check) {
      return this.setUrl(str + "-fill.svg");
    }
    else{
      return this.setUrl(str + ".svg");
    }
  }

  boldNavbarItem(str: string) {
    if (this.cp_style == str) {
      return {
        fontWeight: 'bold',
      };
    }
    else{
      return{
        fontWeight: 'normal'
      }
    }
  }
  
routeToChild(str: string){
  
  /*
    if(str != "foryou" && str != "all")
      {
        this.router.navigate([str], {relativeTo:this.route});
      }
    */
  
    this.current_tab = str;
    if (str == "foryou" || str == "all" || str == "posts" || str == 'followers')
      {
        this.marker1= true; 
        this.marker2= false;
        this.marker3= false; 
        this.marker4= false; 
        this.marker5= false; 
      }
    else if(str == "following" || str == "trending" || str == "verified" || str == "replies")
      {
        this.marker1= false; 
        this.marker2= true;
        this.marker3= false; 
        this.marker4= false; 
        this.marker5= false; 
      }
    else if(str == "mentions" || str == "news" || str == "media")
      {
        this.marker1= false; 
        this.marker2= false;
        this.marker3= true; 
        this.marker4= false; 
        this.marker5= false; 
      }
    else if(str == "sports" || str == "likes")
      {
        this.marker1= false; 
        this.marker2= false;
        this.marker3= false; 
        this.marker4= true; 
        this.marker5= false; 
      }
    else if(str == "entertainment")
      {
        this.marker1= false; 
        this.marker2= false;
        this.marker3= false; 
        this.marker4= false; 
        this.marker5= true; 
      }
    else
      {
        this.marker1= false; 
        this.marker2= false;
        this.marker3= false; 
        this.marker4= false; 
        this.marker5= false; 
      }
      
  }

  getMarkerStyles(num: Number) {
    var marker;

    switch(num)
    {
      case 1: marker = this.marker1;break;
      case 2: marker = this.marker2;break;
      case 3: marker = this.marker3;break;
      case 4: marker = this.marker4;break;
      case 5: marker = this.marker5;break;
    }

    if (marker) {
      return {
        color: 'black',
        outline: 'none',
        fontWeight: 'bold',
      };
    }
    else{
      return{
        color: 'rgb(97, 110, 124)',
        fontWeight: 500
      }
    }
  }

  displayMarker(num: Number)
  {
    var marker;

    switch(num)
    {
      case 1: marker = this.marker1;break;
      case 2: marker = this.marker2;break;
      case 3: marker = this.marker3;break;
      case 4: marker = this.marker4;break;
      case 5: marker = this.marker5;break;
    }

    if (marker) {
      return {
        display: 'block',
      };
    }
    else{
      return{
        display: 'none',
      }
    }
  }

//gets all users(from DB) and adds them to DBUsers array
getAllDBUsers()
{
    this.http.get("http://127.0.0.1:8000/user").subscribe((resultData: any)=>
    {
        console.log(resultData);
        this.DBUsers = resultData;
    });
}

//creates Post objects using data from DBFeed and UserFeed arrays and adds them to FEfeed array
convertUserFeed(current_user_acc_name: string)
{   
  //current_user_acc_name

  //clear UserFeed
  this.UserFeed = [];

  let counter = 0;

  for (let i = 0; i < this.DBUsers.length;i++) {
    let user = this.DBUsers[i];
    
    if(user.acc_name != current_user_acc_name) //this is issue current_user_acc_name =this.acc_name
      {
        var u = new Profile(user.pic, user.username, user.acc_name, "bio", 0, 0);
        this.UserFeed.push(u);
        counter++;
      }
    if (counter == 3)
      {
        i = this.DBUsers.length; //breaks loop
      }
  }
}


//gets data for 'ForYou'feed, calls the 3 above functions using delays to ensure all the data is available, when accessed
createUserFeed(outsideOfService: boolean, acc_name: string)
  {
    var ac = "";
    if(outsideOfService)
    {
      ac = acc_name;
    }
    else
    {
      ac = this.acc_name;
    }

    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.getAllDBUsers();
            resolve('we got a response');
          }, 0) // 0 secs
        })

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.convertUserFeed(ac);
            resolve('we got a response');
          }, 500) // 0 secs
        })

        async function myAsync(){
          try{
            postPromise;
            await checkPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
        }
        
        myAsync();
  }

















  }
