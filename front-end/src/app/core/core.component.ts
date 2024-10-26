import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getImgUrl } from './data';
import { CoreService } from './core-service.service';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  /*standalone: true,*/
  selector: 'core-component',
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
  /*imports: [HomePageComponent, NavigationBarComponent, RouterModule]*/
})
export class CoreComponent{
  title = 'front-end';
 
  /*
  constructor(public route: ActivatedRoute, public service: CoreService) {
    
    this.service.current_page = this.route.snapshot.url.toString();
    this.service.cp_style = this.route.snapshot.url.toString();
   
    }
*/
  //username: string;  
  //acc_name: string; 
  constructor(public authService: AuthService, public route: ActivatedRoute, public service: CoreService) {
    
    //this.service.current_page = this.route.snapshot.url.toString();
    //this.service.cp_style = this.route.snapshot.url.toString();
    //this.username = "";
    //this.acc_name = "";
    var arr = window.location.pathname.split("/");
    let last_url_section = arr.pop() ??"error";
    let second_last = arr.pop() ??"error";

    
    if ( last_url_section == 'Home' || last_url_section == 'Explore' || last_url_section == 'Notifications' || last_url_section == 'Messages' || last_url_section == 'Profile')
    {
      //this.service.current_page = last_url_section;
      //this.service.setCurrentPage(last_url_section);

      this.service.current_page = last_url_section;
      this.service.cp_style = last_url_section;
    }
    else
    {
        if (second_last == 'Profile')
        {
          if(last_url_section == 'followers' || last_url_section == 'following')
            {
              this.service.current_page = 'ProfileFollow';
              this.service.cp_style = 'ProfileFollow';
              //this.service.setCurrentPage('ProfileFollow');
            }
            else
            {
              this.service.current_page = 'OtherProfile';
              this.service.cp_style = 'OtherProfile';
            }
        }
        else
        {
          //could be set to ''
          this.service.current_page = last_url_section;
          this.service.cp_style = last_url_section;
        }
    }

    }

    
  /*ngOnInit() {  
    //this.username = localStorage.getItem('username') ?? "badToken";
   //this.acc_name = localStorage.getItem('acc_name') ?? "badToken";  
    //console.log(this.username); 

   

   
  } */
}
