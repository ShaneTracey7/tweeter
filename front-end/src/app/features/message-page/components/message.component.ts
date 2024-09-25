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
@Input() mpc:MessagePageComponent = new MessagePageComponent(this.authService, this.route,this.service);
@Input () c_c: boolean = false;
selected: boolean = false;
  showConvo()
  {
    //this.c_c = true;
    if(this.mpc.convo_clicked)
      {
        if(this.selected)
          {
            this.mpc.convo_clicked = false; //this doesn't change the message page component html ngif
            console.log("convo clicked: " + this.c_c);
            this.selected = false;
          }
        else
          {
            //do nothing, can't select message if another is already selected
          }
      
      }
    else
    {
      this.mpc.convo_clicked = true; //this doesn't change the message page component html ngif
      console.log("convo clicked: " + this.c_c);
      this.selected = true;
    }
  }
//#1DA1F2
  setStyle()
  {
    if(this.selected)
      {
        return {
          backgroundColor: 'rgba(148, 173, 188, 0.2)',
        };
      }
    else
    {
      return {
        //backgroundColor: 'white',
      };
    }

  }

  showTab()
  {
    if(this.selected)
      {
        return {
          backgroundColor: '#1DA1F2',
        };
      }
    else
    {
      return {
        backgroundColor: 'transparent',
      };
    }

  }


}
