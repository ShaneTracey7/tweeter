import { Component} from '@angular/core';
import { getImgUrl } from '../../core/data';

@Component({

  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  
})
export class LoginPageComponent {

//toggle for showing/hiding modals
show_login_modal: boolean = false;
show_signup_modal: boolean = false;

//ensures correct url regardless of prod or dev, local or hosted
setUrl(str: string)
{
  return getImgUrl(str);
}

//show modals (hide modal functions are within modals)
showLoginModal()
  {
   sessionStorage.clear(); //to be extra careful that there isn't sessionstorage before login attempt (won't work if there is)
   //this.service.reset(); //clear core service data
   this.show_login_modal = true;
  }

showSignupModal()
  {
   this.show_signup_modal = true;
  }
  
}
