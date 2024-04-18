import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { createFollowingFeed, createForYouFeed, createMessages } from '../../../data';
import { AppComponent } from '../../../app.component';
@Component({
  /*standalone: true,*/
  selector: 'main-content',
  templateUrl: './main-content.component.html',
})
export class MainContentComponent {

  @Input() tab: string = ""; //what tab is being displayed
  @Input() page: string = ""; //what current_page is being displayed

  followingFeed = createFollowingFeed();

  forYouFeed = createForYouFeed();

  messages = createMessages();

}
