import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getImgUrl } from './data';
import { CoreService } from './core-service.service';
import { AuthService } from './auth.service';

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
  username: string;  
  acc_name: string; 
  constructor(private router: Router, private authService: AuthService, public route: ActivatedRoute, public service: CoreService) {
    
    this.service.current_page = this.route.snapshot.url.toString();
    this.service.cp_style = this.route.snapshot.url.toString();
    this.username = "";
    this.acc_name = "";
    }

  ngOnInit() {  
    this.username = localStorage.getItem('username') ?? "badToken";
    this.acc_name = localStorage.getItem('acc_name') ?? "badToken";  
    console.log(this.username);  
  } 

  logout() {  
    console.log('logout');  
    this.authService.logout();  
    this.router.navigate(['/Login']);  
  } 
  
}
