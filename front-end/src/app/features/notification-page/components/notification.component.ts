import { Component, Input} from '@angular/core';
import { Notification, Notification2, Post, Profile, createAllProfiles, getProfile } from '../../../core/data';
import { NotificationPageComponent } from '../notification-page.component';


@Component({

  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: '../notification-page.component.scss',

})
export class NotificationComponent extends NotificationPageComponent{
@Input () notification = new Notification2('',new Profile('','','','',0,0), new Post(0,'','','', new Date(),'','',0,0,0,0) );

show_modal: boolean = false;
modal_profile = new Profile('','','','',0,0);


showModal(username: string)
  {

   //this.modal_profile = getProfile(username, createAllProfiles());
   this.modal_profile = this.notification.profile_from;
   this.show_modal = true;
  }

hideModal()
  {
    this.show_modal = false;
  }
 
  handleClick()
  {
    if (this.notification.type == 'Follow')
    {
      // direct to profile page
      console.log("Direct to profile page");
    }
    else //type == 'Like' or 'Retweet'
    {
      //direct to tweet view/page (not made yet)
      console.log("Direct to tweet view/page");
    }
  }

  setTextContent()
  {
    if(this.notification.type == 'Follow')
    {
      return this.notification.profile_from.bio;
    }
    else //'Like' or 'Retweet'
    {
      return this.notification.tweet.text;
    }
  }
}
