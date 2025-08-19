import { Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { Convo, Message, MessageCard, Profile } from '../../../core/data';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {environment} from '../../../../environments/environment';
import { CoreService } from '../../../core/core-service.service';

@Component({

  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: '../message-page.component.scss',

})
export class MessageComponent{
//@Input () message = new MessageCard('','','','','');
@Input () convo = new Convo(0,new Profile('','','','','',0,0),[], new Date());
@Input () selectedAcc: string = '';

//replaced @Input() mpc :MessagePageComponent
@Input () convo_clicked: boolean = false; //used to check if a convo is clicked
@Output() convo_clickedChange = new EventEmitter<boolean>(); 
@Input () selectedConvo: Convo = new Convo(0,new Profile('','','','','',0,0),[], new Date()); //used to store the selected convo
@Output() selectedConvoChange = new EventEmitter<Convo>(); 
@Input () convos: Convo [] = []
@Output() convosChange = new EventEmitter<Convo[]>(); 
@Input () convoArr: any[] = []; //used to store the list of convos in an array
@Output() convoArrChange = new EventEmitter<any[]>(); //NEW

tabStyle: string = "backgroundColor: 'transparent'";
isSelected: boolean = false;
timer:any;
show_modal: boolean = false;
showElip: boolean = false;
showElipModal: boolean = false; 
lastMessage: string = '';
lastDate: string = '';

emptyConvo = new Convo(0,new Profile('','','','','',0,0),[], new Date());

constructor(public formBuilder: FormBuilder, public route: ActivatedRoute, public service: CoreService )
{
}

  ngOnInit(){
    this.lastMessage = this.convo.getLastMessage()!;
    this.lastDate = this.convo.getLastMessageDate();
  }

  //if messages are added /deleted to convo, update last message and date
  ngOnChanges(changes: SimpleChanges) {
    if (changes['convos']) {
      console.log('convos changed:', changes['convos'].currentValue);
      // Handle changes to selectedAcc input
      for (let i = 0; i < this.convos.length; i++)
      {
        if(changes['convos'].previousValue && changes['convos'].currentValue)
        {
          this.lastMessage = this.convo.getLastMessage()!;
          this.lastDate = this.convo.getLastMessageDate();
        }
      }
    }
  }

  //shows convo in secondary content area when clicked
  showConvo()
  {
    if(this.showElipModal)
    {
      return;
    }
    if(this.convo_clicked)
      {
        if(this.isSelected)
          {
            this.convo_clickedChange.emit(false);
            this.isSelected = false;
            this.selectedConvoChange.emit(this.emptyConvo);
          }
        else
          {
            if(this.convo.otherUser.acc_name == this.selectedAcc)
            {
              this.isSelected = false;
              this.convo_clickedChange.emit(false);
              this.selectedConvoChange.emit(this.emptyConvo);
              console.log('this.convo.otherUser.acc_name == this.selectedAcc');
            }
            else
            {
              this.isSelected = false;
              console.log(this.convo.otherUser.acc_name + "!=" + this.selectedAcc)
              console.log('this.convo.otherUser.acc_name != this.selectedAcc');
            }
          }
      
      }
    else
    {
      this.convo_clickedChange.emit(true);
      this.isSelected = true;
      this.selectedConvoChange.emit(this.convo);
      
    }
  }

  //sets background color of convo based on if it is selected/hovering over it
  setStyle()
  {
    if(this.isSelected || this.convo.otherUser.acc_name == this.selectedAcc)
      {
        return {backgroundColor: 'rgba(148, 173, 188, 0.2)'};
      }
    else
    {
      if (this.showElip)
      {
        return {backgroundColor: 'rgba(0, 0, 0, 0.030)'};
      }
      else
      {
        return {backgroundColor: 'white'};
      }
    }
  }

  //displays a blue tab on the left side of the convo if it is selected
  showTab()
  {
    if(this.isSelected || this.convo.otherUser.acc_name == this.selectedAcc)
      {
        return {backgroundColor: '#1DA1F2'};
      }
    else
    {
      return {backgroundColor: 'transparent'};
    }
  }

  //shows modal after hovering over profile pic (only of convo) for a certain amount of time
  showModal()
  {
    let obj = this;
    
    if(obj.show_modal || obj.service.openmodal)
    {
      //do nothing
      console.log("show: " + obj.show_modal + " openModal: " + obj.service.openmodal);
    }
    else
    {
      obj.timer = setTimeout(function(){
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

  //deletes convo upon click 'delete conversation' of ellipsis modal
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

    this.convoArrChange.emit([this.convos]);
  }

  //deletes convo from db
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
