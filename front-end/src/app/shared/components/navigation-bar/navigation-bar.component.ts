import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CoreComponent } from '../../../core/core.component';
import { getImgUrl } from '../../../core/data';
import { CoreService } from '../../../core/core-service.service';
import { AuthService } from '../../../core/auth.service';
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
  pic: string;
  test_string: string = 'https://drive.google.com/thumbnail?id=1XGsuMIuIV9l2gi7TDs80OT6a-v7ccR7o&sz=w1000'

  constructor(private router: Router, private authService: AuthService, public service: CoreService) {
    
    this.username = "";
    this.acc_name = ""; 
    this.pic = ""; 
    }

  ngOnInit() {  
    this.username = localStorage.getItem('username') ?? "badToken";
    this.acc_name = localStorage.getItem('acc_name') ?? "badToken";  
    this.pic = localStorage.getItem('pic') ?? "badToken";  
    console.log("username is: " + this.username);  
  } 

  handleNavigation(page: string, tab: string)
  {
    this.service.setCurrentPage(page);
    this.service.routeToChild(tab);
  }

  //handles routing when 'Profile' navbar button is clicked (mainly prevents unneccessary routing)
  handleNavigationP(page: string, tab: string)
  {
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

  showModal()
  {
    this.show = true;
  }

  logout() {  
    localStorage.clear();
    //this.service.clearStorage();
    console.log(localStorage.getItem('acc_name') ?? "badToken");
    console.log(localStorage.getItem('username') ?? "badToken");
    console.log('logout');  
    this.authService.logout();
    
    this.router.navigate(['/Login']);  
  } 

}
