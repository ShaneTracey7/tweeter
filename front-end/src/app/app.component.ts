import { Component, OnInit } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavigationBarComponent } from './shared/components/navigation-bar/navigation-bar.component';

@Component({
  /*standalone: true,*/
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  /*imports: [HomePageComponent, NavigationBarComponent, RouterModule]*/
})
export class AppComponent implements OnInit{
  title = 'front-end';

  //used for toolbar tabs
  marker1= false; //foryou/all
  marker2= false; //following/trending/verified
  marker3= false;//mentions/news
  marker4= false;//sports
  marker5= false;//entertainment

  current_page = "Home";

  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    }

    setCurrentPage(str: string)
    {
      this.current_page = str;
    }

    boldNavbarItem(str: string) {
      if (this.current_page == str) {
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
      this.router.navigate([str], {relativeTo:this.route});
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
