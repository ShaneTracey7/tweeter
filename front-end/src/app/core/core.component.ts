import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getImgUrl } from './data';


@Component({
  /*standalone: true,*/
  selector: 'core-component',
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
  /*imports: [HomePageComponent, NavigationBarComponent, RouterModule]*/
})
export class CoreComponent implements OnInit{
  title = 'front-end';

  //used for toolbar tabs
  marker1= true; //foryou/all
  marker2= false; //following/trending/verified
  marker3= false;//mentions/news
  marker4= false;//sports
  marker5= false;//entertainment

  current_tab: string = "";
  current_page: string =  "";
  cp_style: string = "";


  //show_modal = new Show(false);
  //show_modal = false;
  //modal_profile = new Profile('','','','',0,0);
  //static modal_profile: Profile;

  constructor(public route: ActivatedRoute, private router: Router) { }

  

  ngOnInit(): void
  {
    this.current_page = this.route.snapshot.url.toString();
    //this.show_modal = true;

    //this.show_modal  = { ...this.show_modal , show: false};
    //console.log(this.current_page);
    //console.log(this.router.routerState.snapshot.url);
  }
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
        return "/assets/images/" + str + "-fill.svg";
      }
      else{
        return "/assets/images/" + str + ".svg";
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
      console.log(this.router.routerState.snapshot.url);
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