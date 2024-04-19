import { Component, Input} from '@angular/core';
import { Profile, Show} from '../../../data';
import { AppComponent } from '../../../app.component';

@Component({

  selector: 'short-profile',
  templateUrl: './short-profile.component.html',
})
export class ShortProfileComponent extends AppComponent{

  @Input() profile = new Profile('','','','',0,0);


  showModal()
    {
      this.modal_profile = {...this.profile};
      this.show_modal  = { ...this.show_modal , show:true};
      
      //this.show_modal = true;
      console.log("mouse over " + this.show_modal);
      console.log("username" + this.profile.username);
    }

  hideModal()
    {
      //this.show_modal = new Show(false);
      //this.show_modal = false;
      this.show_modal  = { ...this.show_modal , show:false};
      console.log("mouse out " + this.show_modal);
    }
  
}
