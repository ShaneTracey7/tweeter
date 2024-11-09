import { Component, Input, Output, EventEmitter} from '@angular/core';
import { getImgUrl } from '../../../core/data';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({

  selector: 'signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrl: './modals.scss',
  
})
export class SignupModalComponent {

  UserArray: any[] = [];
  
  uniqueUser: boolean = false;

@Input () show: boolean = false;
@Output() showChange = new EventEmitter<Boolean>();

@Input () show2: boolean = false;
@Output() show2Change = new EventEmitter<Boolean>();

p_value = "password";

submit_flag: number  = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted
unique_flag: number = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted
password_flag: number = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted

signupForm = this.formBuilder.group({
  username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
  email: ['', [Validators.required,Validators.email]],
  month: ['', Validators.required],
  day: ['', Validators.required],
  year: ['', [Validators.required, /*this.ageValidator*/]],
  acc_name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
  password1: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
  password2: ['', [Validators.required],], 
  //make sure both passwords match (the submit works but idk if i want to go that route)
  //i have to find a way to not run only the required validation until it's submitted, the min/max length is find to go on default (onchangre)
  
  });

constructor(private formBuilder: FormBuilder, private http: HttpClient ) { 
  
  this.getAllUser();  
}

  //gets all users from database
  getAllUser()
  {
    this.http.get("http://127.0.0.1:8000/user")
    .subscribe((resultData: any)=>
    {
        console.log(resultData);
        this.UserArray = resultData;
    });
  }
  getAllUser2(obj: any)
  {
    obj.http.get("http://127.0.0.1:8000/user")
    .subscribe((resultData: any)=>
    {
        console.log(resultData);
        obj.UserArray = resultData;
    });
  }

   //called upon successful submit of create account form
   addUser(obj: any)
   {

     let userData = {
       
      // "name" : obj.signupForm.value.name,
       "username" : obj.signupForm.value.username,
       "email" : obj.signupForm.value.email,
       "acc_name" : obj.signupForm.value.acc_name,
       "password" : obj.signupForm.value.password1,
       "pic" :  "default-profile-pic.jpg",
       "header_pic" : "default-header-pic.jpg",
       "bio" : "",
       "follower_count": 0,
       "following_count": 0,
     };
     obj.http.post("http://127.0.0.1:8000/user",userData).subscribe((resultData: any)=>
     {
         console.log(resultData);
         obj.getAllUser2(obj);
     });
   }

   //checks db to makes sure username is unique
  usernameUnique(obj: any): void
  {
    let requestBody =
    {
      "username" : 'check',
      //"name" : 'check',
      "email" : 'e',
      "acc_name" : obj.signupForm.value.acc_name,
      
      "password" : 'p',
      "pic" : 'pic', //new
      "header_pic" : "hp",
      "bio" : "b",
      "follower_count": 0,
      "following_count": 0,

    };

    obj.http.put("http://127.0.0.1:8000/user",requestBody).subscribe((resultData: any)=>
    {
        console.log(resultData); //returns failed to add

    if(resultData == "Unique")
      {
        obj.uniqueUser = true;
      }
    else
      {
        obj.uniqueUser = false;
      }
    });
  }

uniquenessProcessing(obj: any)
{
  if(obj.uniqueUser)
    {
      console.log("acc_name is unique");
      obj.submit_flag = 2;
      obj.unique_flag = 2;
      obj.addUser(obj);
      obj.signupForm.reset();
      console.log("form submitted");
    }
    else //username is not unique
    {
      console.log("acc_name is not unique");
      console.log("not submitted");
      obj.submit_flag = 1;
      obj.unique_flag = 1;
    }
}

  onSubmit(){

    if(this.signupForm.valid)
      {
        if (this.signupForm.value.password1 != this.signupForm.value.password2)
          {
            this.submit_flag = 1;
            this.password_flag = 1;
            console.log("passwords are not the same");
            return;
          }
          else
          {
            this.password_flag = 2;
          }

        let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.usernameUnique(globalObj);
            resolve('we got a response');
          }, 0) // 0 secs

        })

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't check")
          }, 8000) //8 secs

          setTimeout(() => {
            globalObj.uniquenessProcessing(globalObj);
            resolve('we checked');
          }, 1000) // 1 sec

        })
        
        async function myAsync(){
          //console.log("inside myAsync");
          try{
            await postPromise;
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

 

ageValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        return +value > 2008 ? {age: true}: null;
    }
}

isValidInput(fc: FormControl<any | null>)
{
  if (fc.valid)
    {
      if(fc == this.signupForm.controls['acc_name'] && this.unique_flag == 1)
        {
          return {
            border: '2px solid red',
          };
        }
      else if (fc == this.signupForm.controls['password2'] && this.password_flag == 1)
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
/*
.ng-pristine.ng-untouched.ng-invalid {
  border: 1px solid lightgray;
}
.ng-valid{
  border: 1px solid lightgray;
}

.ng-invalid.ng-touched.ng-pristine{
  border: 2px solid red;
}
.ng-invalid.ng-touched.ng-dirty{
  border: 2px solid red;
}



*/
/*
isValidInput(check: boolean)
{
  if (check)
    {
      return {
        border: '1px solid lightgray',
      };
    }
  else
    {
      return {
        border: '2px solid red',
      };
    }
}
*/
/*
oldEnough(){
  
      if(+this.signupForm.controls['year'].value < 2009)
        {
          return true;
        }
      else
        {
          return false;
        }
    }
  else
  {
    return false;
  }
}
*/

/*
signupForm = new FormGroup({
  name: new FormControl(''),
  email: new FormControl(''),
  month: new FormControl(''),
  day: new FormControl(''),
  year: new FormControl(''),
  username: new FormControl(''),
  password1: new FormControl(''),
  password2: new FormControl(''),
});
*/





dayPlaceholderArray = new Array(31);
yearPlaceholderArray = new Array(100);

/*
  chan(value: string) {
    this.newItemEvent.emit(value);
  }
*/




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