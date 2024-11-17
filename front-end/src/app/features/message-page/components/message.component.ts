import { Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { Convo, Message, MessageCard, Profile } from '../../../core/data';
import { MessagePageComponent } from '../message-page.component';
import { MainContentComponent } from '../../../shared/components/main-content/main-content.component';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { ActivatedRoute } from '@angular/router';



@Component({

  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: '../message-page.component.scss',

})
export class MessageComponent extends MessagePageComponent{
@Input () message = new MessageCard('','','','','');
@Input () convo = new Convo(0,new Profile('','','','',0,0),[], new Date());
@Input() mpc:MessagePageComponent = new MessagePageComponent(this.formBuilder, this.authService, this.route,this.service,this.tweetService);
@Input() mcc:MainContentComponent = new MainContentComponent(this.tweetService,this.service,this.authService,this.route);
@Input () c_c: boolean = false;
@Input () selectedM: boolean = false;
@Output() selectedMChange = new EventEmitter<boolean>();

isSelected: boolean = false;
timer:any;
show_modal: boolean = false;
showElip: boolean = false;
lastMessage: string = '';
lastDate: string = '';

  override ngOnInit(): void {
    this.lastMessage = this.convo.getLastMessage();
    this.lastDate = this.convo.getLastMessageDate()
  }

  showConvo()
  {
    //this.c_c = true;
    if(this.mpc.convo_clicked)
      {
        if(this.isSelected)
          {
            this.mpc.convo_clicked = false; //this doesn't change the message page component html ngif
            console.log("convo clicked: " + this.c_c);
            this.isSelected = false;
          }
        else
          {
            if(this.selectedM)
            {
              this.isSelected = true;
              //document stuff doesn't work here
              document.getElementById("tab")!.style.backgroundColor = '#1DA1F2';
              document.getElementById("whole-message")!.style.backgroundColor = 'rgba(148, 173, 188, 0.2)';
              this.mpc.selectedConvo = this.convo;
              this.selectedMChange.emit(false);
            }
            console.log('this is wy this isn;t working');
            //do nothing, can't select message if another is already selected
          }
      
      }
    else
    {
      this.mpc.convo_clicked = true; //this doesn't change the message page component html ngif
      console.log("convo clicked: " + this.c_c);
      this.isSelected = true;
      this.mpc.selectedConvo = this.convo;
    }
  }
//#1DA1F2
  setStyle()
  {
    if(this.isSelected)
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
    if(this.isSelected)
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

showModal(obj:MessageComponent)
  {

    obj.timer = setTimeout( function(){
      //insert logic here
      if(obj.show_modal || obj.mpc.openmodal)
        {
          console.log("show: " + obj.show_modal + " openModal: " + obj.mpc.openmodal);
        }
        else
        {
          
          //obj.modal_profile = new Profile(post.profile, post.username,post.acc_name,'bio',0,0);
          obj.show_modal = true;
          obj.mpc.changeOpenModal(true);
        }

    }, 1000);
  }
  //prevents modal from appearing if mouse isnt over profile pic long enough
  hideModal(timer:any)
  {
    clearTimeout(timer);
  }
}
