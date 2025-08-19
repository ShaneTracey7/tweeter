import { Component, Input} from '@angular/core';
import { Notification, Post, Profile } from '../../../core/data';
import { CoreService } from '../../../core/core-service.service';

@Component({

  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: '../notification-page.component.scss',

})
export class NotificationComponent {
@Input () notification = new Notification('',new Profile('','','','','',0,0), new Post(0,'','','', new Date(),'','',0,0,0,0) );

show_modal: boolean = false;
modal_profile = new Profile('','','','','',0,0);
timer:any;

constructor(public service: CoreService)
{}
  //shows profile modal if there aren't any modals already open
  showModal()
  {
    let obj = this;
    
    if(obj.show_modal || obj.service.openmodal)
    {
      console.log("show: " + obj.show_modal + " openModal: " + obj.service.openmodal);
    }
    else
    {
      obj.timer = setTimeout(function(){

        obj.modal_profile = obj.notification.profile_from;
        obj.show_modal = true;
        obj.service.changeOpenModal(true);
      },1000);//delay for how long to be hovering over profile pic to show modal
    }
  }

  //prevents modal from appearing if mouse isnt over profile pic long enough
  hideModal()
  {
    clearTimeout(this.timer);
  }

  //handles when the user clicks on a notification
  handleClick()
  {
    if (this.notification.type == 'Follow')
    {
      // direct to profile page
      console.log("Direct to profile page");
      var route = '/tweeter/Profile/' + this.notification.profile_from.acc_name;
      this.service.router.navigate([route]); 
      this.service.routeToChild('posts');
    }
    else //type == 'Like' or 'Retweet'
    {
      //direct to tweet view/page 
      console.log("Direct to tweet view/page");
      var route = '/tweeter/Post/' + this.notification.tweet.id;
      this.service.router.navigate([route]); 
    }
  }

  //sets secondary text of notifcation
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
