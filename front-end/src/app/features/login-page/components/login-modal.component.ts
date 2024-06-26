import { Component, Input, Output, EventEmitter} from '@angular/core';
import { getImgUrl } from '../../../core/data';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

submit_flag: number  = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted
goodLogin: boolean = false; 


constructor(private formBuilder: FormBuilder, private http: HttpClient,private router:Router ) {}

loginForm = this.formBuilder.group({
  username: ['', [Validators.required]],
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
  {
    let requestBody =
    {
      "name" : 'credentialsCheck',
      "email" : 'e',
      "acc_name" : 'a',
      "username" : obj.loginForm.value.username,
      "password" : obj.loginForm.value.password,
    };

    obj.http.put("http://127.0.0.1:8000/user",requestBody).subscribe((resultData: any)=>
    {
        console.log(resultData);
    
    if(resultData == "username exists, password correct")
      {
        obj.goodLogin = true;
      }
    else
      {
        obj.goodlogin = false;
      }
    });
  }
  }


  onSubmit(){

    if(this.loginForm.valid)
      {

        let globalObj = this;

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            if(globalObj.goodLogin)
              {
                console.log("form submitted");
                globalObj.submit_flag = 2;
                globalObj.loginForm.reset();
                setTimeout(() => {
                globalObj.router.navigate(['/tweeter']); //this is just (need to figure out a secure login)
                }, 2000) // 0.5 secs
              }
            else
              {
                console.log("form not submitted");
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

      }
    else
    {
      console.log("not submitted");
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
