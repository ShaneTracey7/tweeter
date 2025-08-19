import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from '../../../core/core-service.service';
@Component({

  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
})

export class NavigationBarComponent{

  //******* need to find a getUser (from db) function to user to get user.pic for profile at bottom of navbar */
  show:boolean = false;
  username: string;
  acc_name: string;
  pic: string;;

  constructor(private router: Router, public service: CoreService) {
    
    this.username = "";
    this.acc_name = ""; 
    this.pic = ""; 
    }

  ngOnInit() {  
    this.username = sessionStorage.getItem('username') ?? "badToken";
    this.acc_name = sessionStorage.getItem('acc_name') ?? "badToken";  
    this.pic = sessionStorage.getItem('pic') ?? "";  
    console.log("username is: " + this.username);  

  } 

  handleNavigation(page: string, tab: string)
  {
    this.service.setCurrentPage(page);
    this.service.routeToChild(tab);
    this.service.openmodal = false; //reset global variable
  }

  //handles routing when 'Profile' navbar button is clicked (mainly prevents unneccessary routing)
  handleNavigationP(page: string, tab: string)
  {

    this.service.openmodal = false; //reset global variable

    let arr = window.location.pathname.split("/");
    let check1 = arr.pop();
    let check2 = arr.pop();
    let check3 = arr.pop();
    if(check1 == 'Profile' || check2 == 'Profile' && check1 == 'followers' || check2 == 'Profile' && check1 == 'following' ) //is already on profile page
    {
      //this.service.other_profile_flag = false;
      console.log("was on Profile");
    }
    else 
    {
      if(check3 == 'Profile' || check2 == 'Profile' && (check1 != 'followers' && check1 != 'following')) // is already on OtherProfile
      {
        //this.service.other_profile_flag = true;
        console.log("was on OtherProfile");
        //this.router.navigate(['/tweeter/Profile']); 
      }
      else // is already on neither
      {
        //this.service.other_profile_flag = false;
        this.service.setCurrentPage(page);
        this.service.routeToChild(tab);
        console.log("not on Profile or OtherProfile");
        this.router.navigate(['/tweeter/Profile']); 
      }
    } 
  }

  //upon click of profile nav, show logout modal
  showModal()
  {
    this.show = true;
  }

}
