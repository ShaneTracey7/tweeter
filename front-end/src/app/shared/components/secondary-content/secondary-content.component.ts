import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { createProfiles, createSecondarySearchTopics} from '../../../core/data';
import { CoreService } from '../../../core/core-service.service';
@Component({
  /*standalone: true,*/
  selector: 'secondary-content',
  templateUrl: './secondary-content.component.html',
})
export class SecondaryContentComponent {

  @Input() tab: string = ""; //what tab is being displayed
  @Input() page: string = ""; //what current_page is being displayed
  @Input() pane: number = 0; //what pane is being displayed
  profiles: any [] = []

  constructor(private service: CoreService){
    
    this.profiles = this.service.UserFeed
    //console.log(this.profiles)
  }

  // global page data
  //profiles = createProfiles();
  topics = createSecondarySearchTopics();

  //to ensure only one modal is visible at a time
  openmodal: boolean = false;

  scc = this;

  changeOpenModal(newValue: boolean){
    this.openmodal = newValue;
    console.log(this.openmodal);
  }

}
