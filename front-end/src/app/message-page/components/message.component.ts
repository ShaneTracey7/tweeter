import { Component, Input} from '@angular/core';
import { Message } from '../../data';


@Component({

  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: '../message-page.component.scss',

})
export class MessageComponent {
@Input () message = new Message('','','','','');
 
}
