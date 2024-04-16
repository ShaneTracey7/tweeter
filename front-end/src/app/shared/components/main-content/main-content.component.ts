import { Component, Input } from '@angular/core';
import { createForYouFeed, createMessages } from '../../../data';
@Component({
  /*standalone: true,*/
  selector: 'main-content',
  templateUrl: './main-content.component.html',
})
export class MainContentComponent {
  @Input() tab = ''; // decorate the property with @Input()
  @Input() page = ''; // decorate the property with @Input()

  posts = createForYouFeed();

  messages = createMessages();

}
