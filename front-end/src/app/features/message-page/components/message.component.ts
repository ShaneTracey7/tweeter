import { Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { Convo, Message, MessageCard, Profile } from '../../../core/data';
import { MessagePageComponent } from '../message-page.component';
import { MainContentComponent } from '../../../shared/components/main-content/main-content.component';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import {environment} from '../../../../environments/environment';
import { CoreService } from '../../../core/core-service.service';


@Component({

  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: '../message-page.component.scss',

})
export class MessageComponent{
@Input () message = new MessageCard('','','','','');
@Input () convo = new Convo(0,new Profile('','','','','',0,0),[], new Date());
//@Input() mpc!:MessagePageComponent //= new MessagePageComponent(this.formBuilder, this.authService, this.route,this.service);


@Input () convo_clicked: boolean = false; //used to check if a convo is clicked
@Output() convo_clickedChange = new EventEmitter<boolean>(); 

@Input () selectedConvo: Convo = new Convo(0,new Profile('','','','','',0,0),[], new Date()); //used to store the selected convo
@Output() selectedConvoChange = new EventEmitter<Convo>(); 

@Input () convos: Convo [] = []
@Output() convosChange = new EventEmitter<Convo[]>(); 
//convos: Convo[] = []; //used to store the list of convos
@Input () convoArr: any[] = []; //used to store the list of convos in an array
@Output() convoArrChange = new EventEmitter<any[]>(); //NEW




@Input () c_c: boolean = false;
//@Input () selectedM: boolean = false;

@Input () selectedAcc: string = '';
tabStyle: string = "backgroundColor: 'transparent'";
isSelected: boolean = false;
timer:any;
show_modal: boolean = false;
showElip: boolean = false;
showElipModal: boolean = false; 
lastMessage: string = '';
lastDate: string = '';

emptyConvo = new Convo(0,new Profile('','','','','',0,0),[], new Date());

constructor(public formBuilder: FormBuilder, public authService: AuthService, public route: ActivatedRoute, public service: CoreService )
{
}

  ngOnInit(){
    this.lastMessage = this.convo.getLastMessage()!;
    this.lastDate = this.convo.getLastMessageDate();
  }

  //if messages are added /deleted to convo, update last message and date
  ngOnChanges(changes: SimpleChanges) {
    if (changes['convo']) {
      // Handle changes to selectedAcc input
      console.log('Convo changed:', changes['convo'].currentValue);
      if(changes['convo'].previousValue?.messages && changes['convo'].currentValue.messages)
      {
        if(changes['convo'].currentValue.messages.length != changes['convo'].previousValue.messages.length)
        {
          this.lastMessage = this.convo.getLastMessage()!;
          this.lastDate = this.convo.getLastMessageDate();
        }
      } 
      
    }
  }

  showConvo()
  {
    if(this.showElipModal)
    {
      return;
    }
    //this.c_c = true;
    if(this.convo_clicked)
      {
        if(this.isSelected)
          {
          //this.mpc.convo_clicked = false; //this doesn't change the message page component html ngif
            this.convo_clickedChange.emit(false);
            console.log("convo clicked: " + this.c_c);
            this.isSelected = false;
            //this.mpc.selectedConvo = this.emptyConvo;
            this.selectedConvoChange.emit(this.emptyConvo);
            
          }
        else
          {
            if(this.convo.otherUser.acc_name == this.selectedAcc)
            {
              this.isSelected = false;
              //this.mpc.convo_clicked = false;
              this.convo_clickedChange.emit(false);
              //this.mpc.selectedConvo = this.emptyConvo;
              this.selectedConvoChange.emit(this.emptyConvo);
              //this.selectedMChange.emit(false);
              console.log('this.convo.otherUser.acc_name == this.selectedAcc');
            }
            else
            {
              this.isSelected = false;
              console.log(this.convo.otherUser.acc_name + "!=" + this.selectedAcc)
              console.log('this.convo.otherUser.acc_name != this.selectedAcc');
            }
            /*
            if(this.selectedM)
            {
              this.isSelected = true;
              //document stuff doesn't work here
              //document.getElementById("tab")!.style.backgroundColor = '#1DA1F2';
              //document.getElementById("whole-message")!.style.backgroundColor = 'rgba(148, 173, 188, 0.2)';
              this.mpc.selectedConvo = this.convo;
              this.selectedMChange.emit(false);
              //this.tabStyle = "backgroundColor: '#1DA1F2'";
            }
            */
            
            //do nothing, can't select message if another is already selected
          }
      
      }
    else
    {
      //this.mpc.convo_clicked = true; //this doesn't change the message page component html ngif
      this.convo_clickedChange.emit(true);
      console.log("convo clicked: " + this.c_c);
      this.isSelected = true;
      //this.mpc.selectedConvo = this.convo;
      this.selectedConvoChange.emit(this.convo);
      
    }
  }
//#1DA1F2
  setStyle()
  {
    if(this.isSelected || this.convo.otherUser.acc_name == this.selectedAcc)
      {
        return {
          backgroundColor: 'rgba(148, 173, 188, 0.2)',
        };
      }
    else
    {
      if (this.showElip)
      {
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.030)',
        };
      }
      else
      {
        return {
          backgroundColor: 'white',
        };
      }
    }

  }

  showTab()
  {
    if(this.isSelected || this.convo.otherUser.acc_name == this.selectedAcc)
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

  showModal()
  {
    let obj = this;
    
    if(obj.show_modal || obj.service.openmodal)
    {
      console.log("show: " + obj.show_modal + " openModal: " + obj.service.openmodal);
    }
    else
    {
      obj.timer = setTimeout(function(){

        //obj.modal_profile = obj.notification.profile_from;
        obj.show_modal = true;
        obj.service.changeOpenModal(true);
      },1000);//delay for how long to be hovering over profile pic to show modal
    }
  }

  //prevents modal from appearing if mouse isnt over profile pic long enough
  hideModal()
  {
    //this.service.changeOpenModal(false);
    clearTimeout(this.timer);
  }

  onMouseEnter()
  {
    this.showElip = true;
  }
  onMouseLeave()
  {
    this.showElip = false;
  }

  handleElipClick()
  {
    this.showElipModal = !this.showElipModal;
  }

  handleDeleteClick()
  {
    //delete conversation
    this.deleteDBConvo();
    
    //reset/refresh convo list
    let c = this.convo; 
    
    console.log("convos b4: " + this.convos);

    this.convos = this.convos.filter(function(convo) {
      return convo !== c
  });

    //this.mpc.arr = [this.mpc.convos];
    this.convoArrChange.emit([this.convos]);

  console.log("convos after: " + this.convos);
  }

  deleteDBConvo()
  {
    let requestBody =
      {
        "word" : 'deleteConvo', //check
        "num" : this.convo.id, //convo id
      };

    this.service.http.put(environment.apiUrl +"/message",requestBody).subscribe((resultData: any)=>
      {
        console.log(resultData);
        
        if(resultData == 'Deleted Successfully')
          {
        
          }
        else // Failed to Add
          {
            
          }
      });
  }
}
