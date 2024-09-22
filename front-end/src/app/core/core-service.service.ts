import { Injectable} from "@angular/core";
import { getImgUrl } from "./data";
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

  constructor(public route: ActivatedRoute, public router: Router,private http: HttpClient,) { 
    this.current_page = this.route.snapshot.url.toString();
    this.username = localStorage.getItem('username') ?? "badToken"; 
    this.acc_name = localStorage.getItem('acc_name') ?? "badToken";;
  }

  /*
  ngOnInit() {  
    this.username = localStorage.getItem('username') ?? "badToken";
    this.acc_name = localStorage.getItem('acc_name') ?? "badToken";  
    console.log(this.username); 
  } */
 
/*
  checkUserResult()
  {
    return this.validUser;
  }

  checkUserInDB()
  {
  let requestBody =
    {
      "username" : 'credentialsCheck',
      "email" : 'e',
      "acc_name" : this.acc_name,
      "password" : 'p',
    };

    this.http.put("http://127.0.0.1:8000/user",requestBody).subscribe((resultData: any)=>
    {
        console.log(resultData);
    
        if(resultData == "AC exists, P incorrect")
        {
          this.validUser = true;
        }
      else
        {
          this.validUser = false;
        }
    });
  }

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
        let r = obj.checkUserResult()
        resolve(r);
      }, 2000) // 2 sec

    })

    async function myAsync(){
      //console.log("inside myAsync");
      
      try{
        await postPromise;
        checkPromise.then((value) => {
          console.log(value);
          return value;
        });
        return false;
      }
      catch (error) {
        console.error('Promise rejected with error: ' + error);
        return false;
      }
      //console.log("end of myAsync");
    }
    
    myAsync().then((value) => {
      console.log(value);
      return value;
    });;

  }*/





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
    if (str == "foryou" || str == "all" || str == "posts")
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

  }
