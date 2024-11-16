import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { Convo, createConversations, createMessages, Message, Profile } from '../../core/data';
import { TweetService } from '../../core/tweet-service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrl: './message-page.component.scss'
})
export class MessagePageComponent extends CoreComponent{

show: boolean = false; // show/hide new message modal

convo_clicked: boolean = false; //true: shows seleected converstion, false: shows 'select a message blurb'
selectedConvo: Convo = new Convo(new Profile('','','','',0,0),[]); //selected convo
service_acc_name: string;
arr: any [] = [];

DBConvos: any [] = [];
DBMessages: any [] = [];
convos: Convo [] = [];



constructor(authService: AuthService, route: ActivatedRoute, service: CoreService, public tweetService: TweetService)
{
  super(authService,route,service);
  this.service_acc_name = "";
}

ngOnInit()
{
this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";
 this.convos = createConversations();
 this.arr = [this.convos];
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

createDBConvo(user1: string, user2: string, text: string)
{
  let requestBody =
    {
      "word" : user1, //account name
      "word2" : user2, //account name
      "word3" : text, //message text
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
      console.log(resultData);

      if(resultData == 'Failed to Add' || resultData == 'No convos')
        {
          this.DBConvos = [];
          this.DBMessages = [];
          console.log("Unsuccessful Database Retrieval");
        }
      else
        {
          console.log("Successful Database Retrieval");
          this.DBConvos = resultData[0];
          this.DBMessages = resultData[1];
          //this.DBRetweetsUsers = resultData[1];
          this.convertDBConvos();
        }
    });
  }

  //i think this is good now
  convertDBConvos()
  {   
    this.DBConvos.forEach((convo,index) => {

      var m_arr: Message[] = []; 
      let messages: any [] = this.DBMessages[index];   
      let length = (messages.length) -1; 
      messages.forEach((message,index) => {
        let m = new Message(message.text,message.isSender, message.date);
        m_arr.push(m);
        if(index == length)
        {
          var c = new Convo(convo.otherUser,messages);
          this.convos.push(c);
        }
      });      
    });
  }

  //opens up new message modal
  handleNewMessageClick()
  {
    this.show = true;
  }
}
