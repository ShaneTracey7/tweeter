import { Component, Input} from '@angular/core';
import { Convo, Message, MessageCard, Profile } from '../../../core/data';
import { MessagePageComponent } from '../message-page.component';
import { MainContentComponent } from '../../../shared/components/main-content/main-content.component';



@Component({

  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: '../message-page.component.scss',

})
export class MessageComponent extends MessagePageComponent{
@Input () message = new MessageCard('','','','','');
@Input () convo = new Convo(new Profile('','','','',0,0),[]);
@Input() mpc:MessagePageComponent = new MessagePageComponent(this.authService, this.route,this.service,this.tweetService);
@Input() mcc:MainContentComponent = new MainContentComponent(this.tweetService,this.service,this.authService,this.route);
@Input () c_c: boolean = false;
selected: boolean = false;
timer:any;
show_modal: boolean = false;
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
      this.mpc.selectedConvo = this.convo;
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

  showModal2(obj:MessageComponent)
  {

    let globalObj =this;

    obj.timer = setTimeout( function(){
      //insert logic here
      if(obj.show_modal || obj.mcc.openmodal)
        {
          //console.log("show: " + obj.show_modal + " openModal: " + obj.mcc.openmodal);
        }
        else
        {
        
          obj.show_modal = true;
          obj.mcc.changeOpenModal(true);
        }

    }, 1000);
}
showModal(obj:MessageComponent)
  {

    let globalObj =this;

    obj.timer = setTimeout( function(){
      //insert logic here
      if(obj.show_modal || obj.mcc.openmodal)
        {
          console.log("show: " + obj.show_modal + " openModal: " + obj.mcc.openmodal);
        }
        else
        {
          
          //obj.modal_profile = new Profile(post.profile, post.username,post.acc_name,'bio',0,0);
          obj.show_modal = true;
          obj.mcc.changeOpenModal(true);
        }

    }, 1000);
  }
  //prevents modal from appearing if mouse isnt over profile pic long enough
  hideModal(timer:any)
  {
    clearTimeout(timer);
  }
}
