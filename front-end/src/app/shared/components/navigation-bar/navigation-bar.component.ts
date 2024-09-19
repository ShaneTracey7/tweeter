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

  show:boolean = false;
  username: string;
  acc_name: string;

  constructor(private router: Router, private authService: AuthService, public service: CoreService) {
    
    this.username = "";
    this.acc_name = "";
    }

  ngOnInit() {  
    this.username = localStorage.getItem('username') ?? "badToken";
    this.acc_name = localStorage.getItem('acc_name') ?? "badToken";  
    console.log(this.username);  
  } 

  showModal()
  {
    this.show = true;
  }

  logout() {  
    console.log('logout');  
    this.authService.logout();  
    this.router.navigate(['/Login']);  
  } 
}
