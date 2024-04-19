import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Profile, Show} from '../../../data';
import { AppComponent } from '../../../app.component';
import { HomePageComponent } from '../../../home-page/home-page.component';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

@Component({

  selector: 'short-profile',
  templateUrl: './short-profile.component.html',
})
export class ShortProfileComponent{

  @Input() profile = new Profile('','','','',0,0);

  show_modal: boolean = false;
  modal_profile = this.profile;


  showModal(profile: Profile)
    {     
     this.modal_profile = this.profile;
     this.show_modal = true;
    }

  hideModal()
    {
      this.show_modal = false;
    }
  
}
