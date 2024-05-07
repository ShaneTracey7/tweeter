import { Component, Input, Output, EventEmitter} from '@angular/core';
import { getImgUrl } from '../../../core/data';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';


@Component({

  selector: 'signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrl: './modals.scss',
  
})
export class SignupModalComponent {
@Input () show: boolean = false;
@Output() showChange = new EventEmitter<Boolean>();

@Input () show2: boolean = false;
@Output() show2Change = new EventEmitter<Boolean>();

p_value = "password";

constructor(private formBuilder: FormBuilder) {}

signupForm = this.formBuilder.group({
  name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern('[a-zA-Z ]*')]],
  email: ['', [Validators.required,Validators.email]],
  month: [0, Validators.required],
  day: [0, Validators.required],
  year: [0, [Validators.required, this.ageValidator]],
  username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
  password1: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
  password2: ['', {validators: [Validators.required], updateOn: 'submit'}], 
  //make sure both passwords match (the submit works but idk if i want to go that route)
  //i have to find a way to not run only the required validation until it's submitted, the min/max length is find to go on default (onchangre)
  
  });

ageValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        return +value > 2008 ? {age: true}: null;
    }
}
  
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

onSubmit(){
  console.log("form submitted");
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