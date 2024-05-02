import { Component, Input} from '@angular/core';
import { Message } from '../../../core/data';
import { MessagePageComponent } from '../message-page.component';



@Component({

  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: '../message-page.component.scss',

})
export class MessageComponent extends MessagePageComponent{
@Input () message = new Message('','','','','');
 
}
