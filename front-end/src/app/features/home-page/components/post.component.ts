import { Component, Input} from '@angular/core';
import { HomePageComponent } from '../home-page.component';
import { Post, Profile, createAllProfiles, getProfile } from '../../../core/data';
import { MainContentComponent } from '../../../shared/components/main-content/main-content.component';


@Component({

  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: '../home-page.component.scss',

})
export class PostComponent extends HomePageComponent{

@Input () post = new Post('','','',new Date,'','',0,0,0,0);
@Input() mcc:MainContentComponent = new MainContentComponent(this.tweetService,this.service,this.authService,this.route);
show_modal: boolean = false;
modal_profile = new Profile('','','','',0,0);
timer:any;



showDeltaDate()
{

  // Time Difference in Milliseconds

let start = new Date(this.post.e_time).getTime()
let d = new Date(this.post.e_time);
let current = new Date().getTime();

const milliDiff: number = current - start;

const totalSeconds = Math.floor(milliDiff / 1000);
const totalMinutes = Math.floor(totalSeconds / 60);
const totalHours = Math.floor(totalMinutes / 60);
const totalDays = Math.floor(totalHours / 24);
if (totalMinutes < 60)
  {
    return totalMinutes + "m";
  }
else if(totalHours < 24)
  {
    return totalHours + "h";
  }
else if(totalDays < 7)
  {
    return totalDays + "d";
  }
else
  {
    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
  }
}

showModal(post: Post, obj:PostComponent)
  {
    obj.timer = setTimeout( function(){
      //insert logic here
      if(obj.show_modal || obj.mcc.openmodal)
        {
          console.log("show: " + obj.show_modal + " openModal: " + obj.mcc.openmodal);
        }
        else
        {
          obj.modal_profile = new Profile(post.profile, post.username,post.acc_name,'bio',0,0);
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

   this.modal_profile = getProfile(username, createAllProfiles());
   this.show_modal = true;
  }

hideModal()
  {
    this.show_modal = false;
  }
*/
colorReaction(str: string)
  {
   this.reaction = str;
  }

grayReaction()
  {
    this.reaction = "";
  }
 
}
