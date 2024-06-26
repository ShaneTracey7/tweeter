import { Component, Input} from '@angular/core';
import { HomePageComponent } from '../home-page.component';
import { Post, Profile, createAllProfiles, getProfile } from '../../../core/data';


@Component({

  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: '../home-page.component.scss',

})
export class PostComponent extends HomePageComponent{

@Input () post = new Post('','','','','','',0,0,0,0);

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

colorReaction(str: string)
  {
   this.reaction = str;
  }

grayReaction()
  {
    this.reaction = "";
  }
 
}
