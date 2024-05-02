import { Component, Input} from '@angular/core';
import { Notification, Profile, createAllProfiles, getProfile } from '../../../core/data';
import { NotificationPageComponent } from '../notification-page.component';


@Component({

  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: '../notification-page.component.scss',

})
export class NotificationComponent extends NotificationPageComponent{
@Input () notification = new Notification('','','','');

show_modal: boolean = false;
modal_profile = new Profile('','','','',0,0);


showModal(username: string)
  {

   this.modal_profile = getProfile(username, createAllProfiles());
   this.show_modal = true;
  }

hideModal()
  {
    this.show_modal = false;
  }
 
}
