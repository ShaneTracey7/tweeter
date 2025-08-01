import { Component, EventEmitter, Input, Output,} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from '../../../core/core-service.service';

@Component({

  selector: 'logout-modal',
  templateUrl: './logout-modal.component.html',
})
export class LogoutModalComponent {

  @Input() show: boolean = false; //used to be false
  @Output() showChange = new EventEmitter<boolean>();

  acc_name: string = '';

  constructor(private router: Router, public service: CoreService) {}

  ngOnInit(){
    this.acc_name = sessionStorage.getItem('acc_name') ?? "error";  
  }

  hideModal()
    {
     this.show = false;
     this.showChange.emit(this.show);
    }

  //logs out user,clears all session data, and resets service data  
  logout() {  

    sessionStorage.clear();
    this.service.reset(); //clear core service data
    console.log('logout');  
    this.router.navigate(['/Login']);  
  } 
}