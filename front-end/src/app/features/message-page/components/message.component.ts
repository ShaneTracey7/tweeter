import { Component, Input} from '@angular/core';
import { Message, MessageCard } from '../../../core/data';
import { MessagePageComponent } from '../message-page.component';



@Component({

  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: '../message-page.component.scss',

})
export class MessageComponent extends MessagePageComponent{
@Input () message = new MessageCard('','','','','');
 

  showConvo()
  {
    this.convo_clicked = true; //this doesn't change the message page component html ngif
    console.log("convo clicked: " + this.convo_clicked);
  }
}
