import { Component, Input, Output, EventEmitter} from '@angular/core';
import { getImgUrl } from '../../../core/data';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Component({

  selector: 'signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrl: './modals.scss',
  
})
export class SignupModalComponent {

//toggle for showing/hiding signup modal
@Input () show: boolean = false;
@Output() showChange = new EventEmitter<Boolean>();

//toggle for showing/hiding login modal
@Input () showLogin: boolean = false;
@Output() showLoginChange = new EventEmitter<Boolean>();

p_value = "password"; //needed to toggle password field visibility

//needed to create drop down options for day and year
dayPlaceholderArray = new Array(31);
yearPlaceholderArray = new Array(100);

submit_flag: number  = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted, 3: loading(waiting for response form api)
unique_flag: number = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted
password_flag: number = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted

signupForm = this.formBuilder.group({
  username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
  email: ['', [Validators.required,Validators.email]],
  dob: this.formBuilder.group({
    day: ['', Validators.required],
    month: ['', Validators.required],
    year: ['', Validators.required]
  }, { validators: this.validateAge(16) }), // attach group-level validator here
  acc_name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
  password1: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
  password2: ['', [Validators.required],], 
  
  });

constructor(private formBuilder: FormBuilder, private http: HttpClient ) { }
  
   //called upon successful submit of create account form
   addUser()
   {
     let userData = {
       
       "username" : this.signupForm.value.username,
       "email" : this.signupForm.value.email,
       "acc_name" : this.signupForm.value.acc_name,
       "password" : this.signupForm.value.password1,
       "pic" :  null,//"default-profile-pic.jpg",
       "header_pic" : null,//"default-header-pic.png",
       "bio" : "b",
       "follower_count": 0,
       "following_count": 0,
     };

     this.http.post(environment.apiUrl +"/user",userData).subscribe((resultData: any)=>
     {
         console.log(resultData);
     });
   }

   //checks db to makes sure acc_name is unique
  acc_nameUnique()
  {
    this.submit_flag = 3; //set to loading

    let requestBody =
    {
      "username" : 'check',
      "email" : 'e',
      "acc_name" : this.signupForm.value.acc_name,
      "password" : 'p',
      "pic" : null, //new
      "header_pic" : null,
      "bio" : "b",
      "follower_count": 0,
      "following_count": 0,
    };

    this.http.put(environment.apiUrl +"/user",requestBody).subscribe((resultData: any)=>
    {
      console.log("front end result: " + resultData);

      if(resultData == "Unique")
      {
        console.log("acc_name is unique");
        this.submit_flag = 2;
        this.unique_flag = 2;
        this.addUser();
        this.signupForm.reset();
        console.log("form submitted");
      }
      else
      {
        console.log("acc_name is not unique");
        this.submit_flag = 1;
        this.unique_flag = 1;
        console.log("not submitted");
      }
    });
  }

  //called when create account button is clicked and processes form submission
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

      //ensures acc_name is unique
      this.acc_nameUnique();
    }
    else
    {
      console.log("not submitted");
      this.submit_flag = 1;
    }
  }

validateAge(minAge: number): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const day = +group.get('day')?.value;
    const month = +group.get('month')?.value;
    const year = +group.get('year')?.value;

    // Skip validation until all fields are filled
    if (!day || !month || !year) return null;

    const birthDate = new Date(year, month - 1, day); // month - 1 because JS months are 0-based
    if (isNaN(birthDate.getTime())) return { invalidDate: true };

    const today = new Date();
    const minAllowedBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

    //console.log("birthDate > minBirthDate: " + birthDate + " > " + minAllowedBirthDate + " return value: " + (birthDate > minAllowedBirthDate));
    return birthDate > minAllowedBirthDate ? { underAge: true } : null;
  };
}

//styling all flieds except birth date fields (day, month, year)
isValidInput(fc: FormControl<string | null>) 
{
  if (fc.valid)
  {
    if(fc == this.signupForm.controls['acc_name'] && this.unique_flag == 1)
    {
      return { border: '2px solid red'};
    }
    else if (fc == this.signupForm.controls['password2'] && this.password_flag == 1)
    {
      return { border: '2px solid red'};
    }
    else
    {
      return { border: '1px solid lightgray' };
    }
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

//specifically for styling day, month, and year fields
isValidInputDate(fc:  AbstractControl | null, field: string)
{
  let dob= this.signupForm.get('dob');
  let dayCheck = this.signupForm.get('dob.day');
  let monthCheck = this.signupForm.get('dob.month');
  let yearCheck = this.signupForm.get('dob.year');
          
  switch(field)
  {
    case 'day': dayCheck = fc; break;
    case 'month': monthCheck = fc; ;break;
    case 'year': yearCheck = fc; ;break;
    default: console.log('error in switch case'); break;
  }
  //all fc's are valid
  //console.log( "day: " + dayCheck?.valid + " month: " + monthCheck?.valid + " year: " + yearCheck?.valid);
  if (dob?.valid)
  {
    //console.log("case 1");
    return { border: '1px solid lightgray' };
  }
  // at least one fc is empty
  else if((!dayCheck?.dirty || !monthCheck?.dirty || !yearCheck?.dirty) && this.submit_flag != 1)
  {
    //console.log("case 2")
    return { border: '1px solid lightgray'};

  }
  else // at least one fc is invalid and none are empty
  {
    if (!fc?.dirty && this.submit_flag != 1)
    {
      //console.log("case 2");
      return { border: '1px solid lightgray'};
    }
    else
    {
      //console.log("case 3");
      return { border: '2px solid red'};
    }   
  }
}

//ensures correct url regardless of prod or dev, local or hosted
setUrl(str: string)
{
  return getImgUrl(str);
}

  //hides signup modal
  hideModal()
  {
    this.showChange.emit(false);
  }

  //when login button is clicked (closes this (signup modal) and opens login modal)
  closeAndOpen()
  {
    //hide sign up modal
    this.showChange.emit(false);
    //show login modal
    this.showLoginChange.emit(true);
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