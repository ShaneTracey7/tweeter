import { Injectable } from "@angular/core";
import { getImgUrl } from "./data";

@Injectable()
export class CoreService{

     //used for toolbar tabs
  marker1= true; //foryou/all
  marker2= false; //following/trending/verified
  marker3= false;//mentions/news
  marker4= false;//sports
  marker5= false;//entertainment

  current_tab: string = "";
  current_page: string =  "";
  cp_style: string = "";

 
  setUrl(str: string)
  {
    return getImgUrl(str);
  }

  setCurrentPage(str: string)
  {
    const tmp = str;
    this.cp_style = tmp;

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
    if (str == "foryou" || str == "all")
      {
        this.marker1= true; 
        this.marker2= false;
        this.marker3= false; 
        this.marker4= false; 
        this.marker5= false; 
      }
    else if(str == "following" || str == "trending" || str == "verified")
      {
        this.marker1= false; 
        this.marker2= true;
        this.marker3= false; 
        this.marker4= false; 
        this.marker5= false; 
      }
    else if(str == "mentions" || str == "news")
      {
        this.marker1= false; 
        this.marker2= false;
        this.marker3= true; 
        this.marker4= false; 
        this.marker5= false; 
      }
    else if(str == "sports")
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
