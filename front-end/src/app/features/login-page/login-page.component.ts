import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({

  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  
})
export class LoginPageComponent {

show_login_modal: boolean = false;
show_signup_modal: boolean = false;

showLoginModal()
  {
   this.show_login_modal = true;
  }

hideLoginModal()
  {
    this.show_login_modal = false;
  }

showSignupModal()
  {
   this.show_signup_modal = true;
  }

hideSignupModal()
  {
    this.show_signup_modal = false;
  }
  
}
