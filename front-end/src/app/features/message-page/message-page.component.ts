import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { Convo, createConversations, createMessages, Message, Profile } from '../../core/data';
import { TweetService } from '../../core/tweet-service';
import { AuthService } from '../../core/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrl: './message-page.component.scss'
})
export class MessagePageComponent extends CoreComponent{

show: boolean = false; // show/hide new message modal

convo_clicked: boolean = false; //true: shows seleected converstion, false: shows 'select a message blurb'
selectedConvo: Convo = new Convo(0,new Profile('','','','',0,0),[],new Date()); //selected convo
service_acc_name: string;
arr: any [] = [];

DBConvos: any [] = []; //array of convo_ids
DBUsers: any [] = []; 
DBMessages: any [] = [];
convos: Convo [] = [];

openmodal: boolean = false; //to ensure only one modal is visible at a time

messageForm = this.formBuilder.group({
  message: ['', [Validators.required]],
  });

constructor(public formBuilder: FormBuilder,authService: AuthService, route: ActivatedRoute, service: CoreService, public tweetService: TweetService)
{
  super(authService,route,service);
  this.service_acc_name = "";
}

ngOnInit()
{
this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";

//this.convos = createConversations();
 this.getConvos();
 //this.arr = [this.convos];
}


setConvo(name: string)
{
  //this.convo = new Convo(this.service.username,name,[]);
}

setSCStyle()
{
  if(this.convo_clicked)
    {
      return {
        display: 'inline',
        overflow: 'scroll',
        height: '100vh',
      };
    }
  else
    {
      return {
        display: 'flex',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      };
    }
}

createDBConvo(user1: string, user2: string/*, text: string*/)
{
  let requestBody =
    {
      "word" : user1, //account name
      "word2" : user2, //account name
      //"word3" : text, //message text //dont need when initially creating convo
    };

    this.service.http.post("http://127.0.0.1:8000/message",requestBody).subscribe((resultData: any)=>
      {
        console.log(resultData);
  
        if(resultData == 'Failed to Add')
          {
            console.log("Unsuccessful Database Retrieval");
          }
        else
          {
            console.log("Successful Database Retrieval");
          }
      });
}

createDBMessage(convo_id: number, sent_acc_name: string,text: string)
{
  let requestBody =
    {
      "word" : 'addMessage', 
      "word2" : sent_acc_name, // sent account name
      "word3" : text, //message text
      "num" : convo_id,

    };
    this.service.http.put("http://127.0.0.1:8000/message",requestBody).subscribe((resultData: any)=>
      {
        console.log(resultData);
  
        if(resultData == 'Failed to Add')
          {
            console.log("Unsuccessful Database Retrieval");
          }
        else
          {
            console.log("Successful Database Retrieval");
          }
      });
}

getConvos()
  {
  
    let requestBody =
    {
      "word" : "getConvos",
      "word2" : this.service_acc_name,
    };

    this.service.http.put("http://127.0.0.1:8000/message",requestBody).subscribe((resultData: any)=>
    {
      //console.log(resultData[0][0].acc_name);

      if(resultData == 'Failed to Add' || resultData == 'No convos')
        {
          this.DBConvos = [];
          this.DBUsers = [];
          this.DBMessages = [];
          console.log("Unsuccessful Database Retrieval");
        }
      else
        {
          console.log("Successful Database Retrieval");
          this.DBConvos = resultData[0];
          this.DBUsers = resultData[1];
          //this.DBMessages = resultData[2];
          this.convertDBConvos();
        }
    });
  }

  //i think this is good now
  convertDBConvos1()
  {  
    let c_length = (this.DBConvos.length) -1;
    this.DBConvos.forEach((convo,index) => {

      var m_arr: Message[] = []; 
      let messages: any [] = this.DBMessages[index];   
      let length = (messages.length) -1; 
      messages.forEach((message,index) => {
        let m = new Message(message.text,message.isSender, message.date);
        m_arr.push(m);
        if(index == length)
        {
          var c = new Convo(0,convo.otherUser,messages, new Date());
          this.convos.push(c);
        }
      });
      if(index == c_length)
        {
          this.arr = [this.convos];
        }
    });
  }
  convertDBConvos2()
  {  
    let c_length = this.DBConvos.length;
    for(let i = 0; i < c_length; i+2)
    {
      if(this.DBConvos[i].acc_name == this.service_acc_name)
        {
  
          var c = new Convo(0,this.DBConvos[i+1],[], new Date());
          this.convos.push(c);
        }
        else
        {
          var c = new Convo(0,this.DBConvos[i],[],new Date());
          this.convos.push(c);
        }
        if(i == (c_length-2))
          {
            this.arr = [this.convos];
          }
    }
  }
  convertDBConvos()
  {  
    this.convos = [];
    let c_length = (this.DBUsers.length) -1;
    this.DBUsers.forEach((u,index) => {
      
      let user = new Profile(u.pic,u.username,u.acc_name,u.bio,u.following_count,u.follower_count);

      var c = new Convo(this.DBConvos[index],user,[], new Date());
      this.convos.push(c);
      if(index == c_length)
        {
          this.arr = [this.convos];
        }
      });
  }

  //opens up new message modal
  handleNewMessageClick()
  {
    this.show = true;
  }
  handleSentMessage()
  {
    if(this.messageForm.valid)
    {
      //sent message to db
      this.createDBMessage(this.selectedConvo.id,this.service_acc_name,this.messageForm.value.message!);
      //temp show message in convo until next refresh
       
      console.log('message sent');
    }
    else
    {
      console.log('message not sent');
    }
  }

  changeOpenModal(newValue: boolean){
    this.openmodal = newValue;
    console.log(this.openmodal);
  }
}
