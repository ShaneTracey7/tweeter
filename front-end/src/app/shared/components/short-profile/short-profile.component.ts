import { Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { HomePageComponent } from '../../../features/home-page/home-page.component';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { Profile } from '../../../core/data';
import { SecondaryContentComponent } from '../secondary-content/secondary-content.component';
@Component({

  selector: 'short-profile',
  templateUrl: './short-profile.component.html',
})
export class ShortProfileComponent{

  @Input() profile = new Profile('','','','',0,0);
  @Output() openmodalChange = new EventEmitter<boolean>();
  @Input() scc:SecondaryContentComponent = new SecondaryContentComponent();
  show_modal: boolean = false;
  modal_profile = this.profile;

  showModal(profile: Profile)
    {
      if(this.show_modal || this.scc.openmodal)
        {
          console.log("show: " + this.show_modal + " openModal: " + this.scc.openmodal)
        }
        else
        {
          this.modal_profile = this.profile;
          this.show_modal = true;
          this.scc.changeOpenModal(true);
        }
    }
}
