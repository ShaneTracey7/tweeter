import { Component, Input, Output, EventEmitter} from '@angular/core';
import { getImgUrl } from '../../../core/data';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service'
import { CoreService } from '../../../core/core-service.service';
import { environment } from '../../../../environments/environment';
@Component({

  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './modals.scss',
  
})
export class LoginModalComponent {
@Input () show: boolean = false;
@Output() showChange = new EventEmitter<Boolean>();

@Input () showSignUp: boolean = false;
@Output() showSignUpChange = new EventEmitter<Boolean>();

p_value = "password"; //needed to toggle password field visibility
userDB:any = []; //might not work like this

submit_flag: number  = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted, 3: loading(waiting for response form api)
goodLogin: boolean = false; 

loginForm = this.formBuilder.group({
  acc_name: ['', [Validators.required]],
  password: ['', [Validators.required]],
  });

constructor(private formBuilder: FormBuilder, private http: HttpClient,private router:Router, public service: CoreService) {}

//checks login form validity before further processing 
onSubmit()
{
  if(this.loginForm.valid)
  {
    this.credentialsCheck();
  }
  else
  {
    console.log("invalid form");
    this.submit_flag = 1;
  }
}
  //styles form inputs based on validity
  isValidInput(fc: FormControl<any | null>)
  {
    if (fc.valid)
    {
      return { border: '1px solid lightgray'};
    }
    else // fc is invalid
    {
      if(fc.pristine)
      {
        if(fc.touched)
        {
          return { border: '2px solid red'};
        }
        else //fc is untouched
        {
          if(this.submit_flag == 1)
          {
            return { border: '2px solid red'};
          }
          else
          {
            return { border: '1px solid lightgray'};
          }
        }
      }
      else //fc is dirty
      {
        return { border: '2px solid red'};
      }
    }
  }

  //checks login form data with database and logs in user, if correct data
  credentialsCheck()
  {
    this.submit_flag = 3; //set loading state

    let requestBody =
    {
      "username" : 'credentialsCheck',
      "email" : 'email@gmail.com',
      "acc_name" : this.loginForm.value.acc_name,
      "password" : this.loginForm.value.password,
      "pic" : null, //new 
      "header_pic" : null,
      "bio" : "b",
    };

    this.http.put(environment.apiUrl +"/api/login/",requestBody).subscribe((resultData: any)=>
    {
        console.log(resultData);
    
      if(resultData == "AC doesn't exist" || resultData == "AC exists, P incorrect" || resultData == "Failed to Add")
      {
          this.goodLogin = false;
          this.submit_flag = 1;
          console.log("form not submitted"); 
      }
      else
      {
        this.goodLogin = true;
        this.userDB = resultData[0];
        console.log("this.userDB: " + JSON.stringify(resultData[0]))

        //NEW
        sessionStorage.setItem("access", resultData[1].access);
        sessionStorage.setItem('refresh', resultData[1].refresh);

        sessionStorage.setItem('username', this.userDB.username ?? 'badToken');
        sessionStorage.setItem('pic', this.userDB.pic?.image_url ?? '');
        sessionStorage.setItem('acc_name', this.loginForm.value.acc_name ?? 'badToken'); 
        this.loginForm.reset();

        this.submit_flag = 2;
        console.log("form submitted");
          
          //needed to give time for user to see successful status message
        setTimeout(() => {
          this.service.routeToChild('foryou');
          this.router.navigate(['/tweeter']); 
          }, 1000) // 1 sec
       }
        console.log('went thru credentials check')//testing
    });
  }

//sets images with correct url based upon dev, prod, or cloudinary
setUrl(str: string)
{
  return getImgUrl(str);
}

  hideModal()
  {
    //this.show = false;
    this.showChange.emit(false);
  }
  //when sign up button is clicked (closes this (login modal) and opens sign up modal)
  closeAndOpen()
  {
    //hide login modal
    this.showChange.emit(false);
    //show signup modal
    this.showSignUpChange.emit(true);
  }

  //toggles visibility of password fields 
  updatePValue()
  {
    if (this.p_value == "password")
      {
        this.p_value = "text";
      }
    else
      {
        this.p_value = "password";
      }
  }
}
