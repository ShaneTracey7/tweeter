import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { createProfiles, createSecondarySearchTopics } from '../../../core/data';
@Component({
  /*standalone: true,*/
  selector: 'secondary-content',
  templateUrl: './secondary-content.component.html',
})
export class SecondaryContentComponent {

  @Input() tab: string = ""; //what tab is being displayed
  @Input() page: string = ""; //what current_page is being displayed
  @Input() pane: number = 0; //what pane is being displayed
  
  // global page data
  profiles = createProfiles();
  topics = createSecondarySearchTopics();
}
