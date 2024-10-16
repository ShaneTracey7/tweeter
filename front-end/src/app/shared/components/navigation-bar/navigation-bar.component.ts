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
