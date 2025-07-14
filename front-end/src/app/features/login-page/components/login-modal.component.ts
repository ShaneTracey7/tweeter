import { Component, Input, Output, EventEmitter} from '@angular/core';
import { getImgUrl } from '../../../core/data';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
//import { ILogin } from 'src/app/interfaces/login';  
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

@Input () show2: boolean = false;
@Output() show2Change = new EventEmitter<Boolean>();

p_value = "password";
u_value = "username";
userDB:any = []; //might not work like this

submit_flag: number  = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted, 3: loading(waiting for response form api)
goodLogin: boolean = false; 


constructor(private formBuilder: FormBuilder, private http: HttpClient,private router:Router, public service: CoreService) {}

loginForm = this.formBuilder.group({
  acc_name: ['', [Validators.required]],
  password: ['', [Validators.required]],
  });

  isValidInput(fc: FormControl<any | null>)
  {
    if (fc.valid)
      {
        return {
          border: '1px solid lightgray',
        };
      }
    else // fc is invalid
    {
      if(fc.pristine)
        {
          if(fc.touched)
            {
              return {
                border: '2px solid red',
              };
            }
          else //fc is untouched
            {
              if(this.submit_flag == 1)
                {
                  return {
                    border: '2px solid red',
                  };
                }
              else
                {
                  return {
                    border: '1px solid lightgray',
                  };
                }
            }
        }
      else //fc is dirty
        {
          return {
            border: '2px solid red',
          };
        }
    }
  }

  credentialsCheck(obj: any)
  {
  
    obj.submit_flag = 3; //set loading state

    let requestBody =
    {
      //"name" : 'credentialsCheck',
      "username" : 'credentialsCheck',
      "email" : 'e',
      "acc_name" : obj.loginForm.value.acc_name,
      "password" : obj.loginForm.value.password,
      "pic" : null, //new 
      "header_pic" : null,
      "bio" : "b",
      "follower_count" : 0,
      "following_count" : 0,
    };

    obj.http.put(environment.apiUrl +"/user",requestBody).subscribe((resultData: any)=>
    {
        console.log(resultData);
    
        if(resultData == "AC doesn't exist" || resultData == "AC exists, P incorrect" || resultData == "Failed to Add")
        {
          this.goodLogin = false;
          obj.submit_flag = 1;
          console.log("form not submitted");
                
        }
      else
        {
          obj.goodLogin = true;
          obj.userDB = resultData;

          localStorage.setItem('isLoggedIn', "true");
          localStorage.setItem('username', obj.userDB.username ?? 'badToken');
          localStorage.setItem('pic', obj.userDB.pic?.image_url ?? '');
          localStorage.setItem('acc_name', obj.loginForm.value.acc_name ?? 'badToken'); 
          obj.loginForm.reset();

          obj.submit_flag = 2;
          console.log("form submitted");
                
          setTimeout(() => {
            obj.service.routeToChild('foryou');
            obj.router.navigate(['/tweeter']); 
            }, 1000) // 1 sec
        }
        console.log('went thru credentials check')//testing
    });
  }


  onSubmit(){

    if(this.loginForm.valid)
      {
        this.credentialsCheck(this);
        /*
        let globalObj = this;

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            if(globalObj.goodLogin)
              {
                console.log("form submitted");
                globalObj.submit_flag = 2;
                
                //get user with username
                

                localStorage.setItem('isLoggedIn', "true");
                localStorage.setItem('username', globalObj.userDB.username ?? 'badToken');
                localStorage.setItem('pic', globalObj.userDB.pic?.image_url ?? '');
                //localStorage.setItem('username', globalObj.u_value ?? 'badToken');
                localStorage.setItem('acc_name', globalObj.loginForm.value.acc_name ?? 'badToken'); 
                globalObj.loginForm.reset();
                //this.router.navigate([this.returnUrl]);
                setTimeout(() => {
                globalObj.service.routeToChild('foryou');
                globalObj.router.navigate(['/tweeter']); 
                }, 1000) // 1 sec
              }
            else
              {
                console.log("form not submitted"); //error message recieved 
                globalObj.submit_flag = 1;
              }
            reject("We didn't get a response")
          }, 500) // 0.5 secs

          setTimeout(() => {
            globalObj.credentialsCheck(globalObj);
            resolve('we got a response');
          }, 0) // 0 secs

        });

        async function myAsync(){
          //console.log("inside myAsync");
          try{
            await checkPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
          //console.log("end of myAsync");
        }
        myAsync();
        */
      }
    else
    {
      console.log("invalid form");
      this.submit_flag = 1;
    }
  
    
  }

setUrl(str: string)
{
  return getImgUrl(str);
}

  hideModal()
  {
    //this.show = false;
    this.showChange.emit(false);
  }

  closeAndOpen()
  {
    this.showChange.emit(false);
    this.show2Change.emit(true);
  }

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
  
  getPValue()
  {
    return this.p_value;
  }
}
