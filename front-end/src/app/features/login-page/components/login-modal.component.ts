import { Component, Input, Output, EventEmitter} from '@angular/core';


@Component({

  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './modals.scss',
  
})
export class LoginModalComponent {
@Input () show: boolean = false;
@Output() showChange = new EventEmitter<Boolean>();

p_value = "password";
/*
  chan(value: string) {
    this.newItemEvent.emit(value);
  }
*/
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
