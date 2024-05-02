import { Component, Input, Output, EventEmitter} from '@angular/core';
import { getImgUrl } from '../../../core/data';


@Component({

  selector: 'signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrl: './modals.scss',
  
})
export class SignupModalComponent {
@Input () show: boolean = false;
@Output() showChange = new EventEmitter<Boolean>();

p_value = "password";
/*
  chan(value: string) {
    this.newItemEvent.emit(value);
  }
*/

placeholderArray = new Array(100);

setUrl(str: string)
{
  return getImgUrl(str);
}

  hideModal()
  {
    //this.show = false;
    this.showChange.emit(false);
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