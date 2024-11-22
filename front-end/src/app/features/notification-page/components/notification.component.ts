import { Component, Input} from '@angular/core';
import { Notification, Notification2, Post, Profile, createAllProfiles, getProfile } from '../../../core/data';
import { NotificationPageComponent } from '../notification-page.component';
import { MainContentComponent } from '../../../shared/components/main-content/main-content.component';
import { PostComponent } from '../../home-page/components/post.component';


@Component({

  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: '../notification-page.component.scss',

})
export class NotificationComponent extends NotificationPageComponent{
@Input () notification = new Notification2('',new Profile('','','','','',0,0), new Post(0,'','','', new Date(),'','',0,0,0,0) );
@Input() mcc:MainContentComponent = new MainContentComponent(this.tweetService,this.service,this.authService,this.route);

show_modal: boolean = false;
modal_profile = new Profile('','','','','',0,0);
timer:any;

showModal(obj:NotificationComponent)
  {

    let globalObj =this;

    obj.timer = setTimeout( function(){
      //insert logic here
      if(obj.show_modal || obj.mcc.openmodal)
        {
          console.log("show: " + obj.show_modal + " openModal: " + obj.mcc.openmodal);
        }
        else
        {
          obj.modal_profile = globalObj.notification.profile_from;
          obj.show_modal = true;
          obj.mcc.changeOpenModal(true);
        }

    }, 1000);

    //timer;
    // cancel it immediately so it will never run
    //clearTimeout(timer);

  }
  //prevents modal from appearing if mouse isnt over profile pic long enough
  hideModal(timer:any)
  {
    clearTimeout(timer);
  }
/*
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
 */
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
      //direct to tweet view/page (not made yet)
      console.log("Direct to tweet view/page");
      var route = '/tweeter/Post/' + this.notification.tweet.id;
      this.service.router.navigate([route]); 
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
