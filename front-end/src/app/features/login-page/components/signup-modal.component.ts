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

  setPromise1: boolean = false;
  setPromise2: boolean = false;

  StudentArray : any[] = [];
 
  name: string ="";
  address: string ="";
  fee: Number =0;
 
  currentStudentID = "";
 
  /*constructor(private http: HttpClient )
  {
    this.getAllStudent();
 
  }
*/


@Input () show: boolean = false;
@Output() showChange = new EventEmitter<Boolean>();

@Input () show2: boolean = false;
@Output() show2Change = new EventEmitter<Boolean>();

p_value = "password";

submit_flag: number  = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted
unique_flag: number = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted

signupForm = this.formBuilder.group({
  name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern('[a-zA-Z ]*')]],
  email: ['', [Validators.required,Validators.email]],
  month: ['', Validators.required],
  day: ['', Validators.required],
  year: ['', [Validators.required, /*this.ageValidator*/]],
  username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
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
        //this.name = '';
        //this.address = '';
        //this.fee  = 0;
    });
  }
  getAllUser2(obj: any)
  {
    obj.http.get("http://127.0.0.1:8000/user")
    .subscribe((resultData: any)=>
    {
        console.log(resultData);
        obj.UserArray = resultData;
        //this.name = '';
        //this.address = '';
        //this.fee  = 0;
    });
  }

   //called upon successful submit of create account form
   addUser(obj: any)
   {
    console.log('inside add user');

     let userData = {
       
       "name" : obj.signupForm.value.name,
       "email" : obj.signupForm.value.email,
       "acc_name" : 'acc_name',
       "username" : obj.signupForm.value.username,
       "password" : obj.signupForm.value.password1,
     };
     console.log('username inside of addUser(): ' + obj.signupForm.value.username);
     obj.http.post("http://127.0.0.1:8000/user",userData).subscribe((resultData: any)=>
     {
        console.log('inside add user post');
         console.log(resultData);
         obj.getAllUser2(obj);
         console.log('outside add user post');
     });
     console.log('outside add user');
   }

  usernameUnique(obj: any): void
  {

    console.log("inside UU");
    let requestBody =
    {
      "name" : 'check',
      "email" : 'e',
      "acc_name" : 'a',
      "username" : obj.signupForm.value.username,
      "password" : 'p',
    };

    obj.http.post("http://127.0.0.1:8000/user",requestBody).subscribe((resultData: any)=>
    {
        console.log(resultData);
        console.log("inside post");

    if(resultData == "Unique")
      {
        obj.uniqueUser = true;
      }
    else
      {
        obj.uniqueUser = false;
      }
      console.log("outside post");
    });
    console.log("outside UU");
  }

uniquenessProcessing(obj: any)
{
  console.log('inside processing');
  //console.log('uniqueUser: ' + this.uniqueUser);
  if(obj.uniqueUser)
    {
      console.log("username is unique");
      obj.submit_flag = 2;
      obj.unique_flag = 2;
      obj.addUser(obj);
      obj.signupForm.reset();
      console.log("form submitted");
    }
    else //username is not unique
    {
      console.log("username is not unique");
      console.log("not submitted");
      obj.submit_flag = 1;
      obj.unique_flag = 1;
    }
}

  onSubmit(){

    if(this.signupForm.valid)
      {
        console.log("username: " + this.signupForm.value.username);

        let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            console.log('first function');
            globalObj.usernameUnique(globalObj);
              resolve('we got a response');
          }, 500) // resolves after 10 secs
          reject("We didn't get a response")
        })

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            console.log('second function');
            globalObj.uniquenessProcessing(globalObj);
              resolve('we checked')
          }, 1000) // resolves after 10 secs

          reject("We didn't check")
        })
       /* 
        postPromise
        .then(() => checkPromise.then(res => console.log(res)))
        //.catch(error => console.log(error))
*/
        
        async function myAsync(){
          console.log("inside myAsync");
          try{
            console.log("start try");
            await postPromise;
            await checkPromise;
            console.log("end try");
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
          console.log("end of myAsync");
        }
        /*
        const myAsync = async (): Promise<string> => {
          console.log("inside myAsync");
          await postPromise;
          const response = await checkPromise;

          return response;
        }*/

        myAsync();

        //postPromise.then(function(value) {globalfunc2(value);});
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