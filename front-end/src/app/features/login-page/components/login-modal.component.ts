import { Component, Input, Output, EventEmitter} from '@angular/core';
import { getImgUrl } from '../../../core/data';
import { FormBuilder, FormControl, Validators } from '@angular/forms';


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

constructor(private formBuilder: FormBuilder) {}

loginForm = this.formBuilder.group({
  username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
  password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
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

  onSubmit(){

    if(this.loginForm.valid)
      {
        console.log("form submitted");
        this.submit_flag = 2;
        this.loginForm.reset();
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
