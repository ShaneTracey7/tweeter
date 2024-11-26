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
selectedConvo: Convo = new Convo(0,new Profile('','','','','',0,0),[],new Date()); //selected convo
selected: boolean = false; //only needed for message component
service_acc_name: string;
arr: any [] = [];
emptyConvo = new Convo(0,new Profile('','','','','',0,0),[], new Date());

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

  if(this.service.shareID != 0)
    {
      console.log('came from share');
      
      console.log(this.service.shareUser); //user to send tweet to
      console.log(this.service.shareID); //post id of tweet
      this.service.shareID = 0;

      //set up convos
      this.getConvos(false);

      //create OR find convo & select/open convo
      setTimeout(() => {
        console.log('after 1 sec')
        this.createDBConvo(this.service_acc_name, this.service.shareUser);
      }, 1000) // 1 sec
      
      
      // add tweet to convo (front and back end)
      setTimeout(() => {
        console.log('after 2 secs')
        //this.createDBTweetMessage(this.selectedConvo.id, this.service_acc_name, this.service.shareID)
        this.createDBMessage(this.selectedConvo.id, this.service_acc_name, 'this would be post info')
      }, 2000) // 2 secs
      console.log('after both, but no wait')

    }
  else //normal route
  {
    //this.convos = createConversations();
    this.getConvos(false);
    //this.arr = [this.convos];
  }

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

createDBConvo(thisUser: string, otherUser: string/*, text: string*/)
{
  let requestBody =
    {
      "word" : thisUser, //user1
      "word2" : otherUser, //user2
      //"word3" : text, //message text //dont need when initially creating convo
    };

    this.service.http.post("http://127.0.0.1:8000/message",requestBody).subscribe((resultData: any)=>
      {
        console.log(resultData);
  
        if(resultData == 'Failed to Add')
          {
            console.log("Unsuccessful Database Retrieval");
          }
        else if(resultData == 'Convo already exists')
        {
          //dont create convo

          //select convo that it is by acc_name inside of message component (pass a prop) make onchange for that prop
          this.findConvo(otherUser); //sets selectedConvo
          this.convo_clicked = true;
          this.selected = true;
          
        }
        else
          {
            this.getConvos(true); //refreshes data with new convo
            console.log("Successful Database Retrieval");
          }
      });
}

findConvo(otherUser: string)
{
  this.convos.forEach(convo => {
      if(convo.otherUser.acc_name == otherUser)
      {
        this.selectedConvo = convo;
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
            let newMessage = new Message(text,true,new Date());
            this.selectedConvo.messages.push(newMessage);
            console.log("Successful Database Retrieval");
          }
      });
}
createDBTweetMessage(convo_id: number, sent_acc_name: string, post_id: number)
{
  let requestBody =
    {
      "word" : 'addTweetMessage', 
      "word2" : sent_acc_name, // sent account name
      "word3" : String(post_id), //post_id in string form
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
            //need to update Message class to accept a tweet
            let newMessage = new Message('',true,new Date());
            this.selectedConvo.messages.push(newMessage);
            console.log("Successful Database Retrieval");
          }
      });
}

getConvoIds()
{
  var bad_ids: number [] = []
  this.convos.forEach((c) => {
    bad_ids.push(c.id)
});
  return bad_ids;
}

convoIDCheck(bad_ids: number [])
  {
    this.convos.forEach((c,index) => {

      if(!bad_ids.includes(c.id))
      {
        this.selectedConvo = c;
        this.convo_clicked = true;
        this.selected = true;
      }
  });
  }

getConvos(check: boolean)
  {
    let bad_ids: number [] = this.getConvoIds();
  
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
          this.DBMessages = resultData[2];
          this.convertDBConvos(bad_ids, check);
        }
    });
  }

  convertDBConvos(bad_ids: number [], check: boolean)
  {  
    this.convos = [];
    let c_length = (this.DBUsers.length) -1;
    this.DBUsers.forEach((u,index) => {
      console.log("index: " + index);
      let user = new Profile(u.pic,u.header_pic,u.username,u.acc_name,u.bio,u.following_count,u.follower_count);

      let messages: Message [] = [];
      let message_arr: any [] = this.DBMessages[index];

      if(message_arr[0] == 0)
      {
        let id:number = this.DBConvos[index];
        let date: Date = new Date();
        let arr: Message [] = []
        var c = new Convo(id,user,arr, date);
        this.convos.push(c);
        if(index == c_length)
        {
          //console.log("alternate set arr");
          this.arr = [this.convos];
          if(check)
          {
            this.convoIDCheck(bad_ids);
          }
          
        }
        //console.log("index: " + index)
        return;
      }

      let m_length = (message_arr.length) -1;
      message_arr.forEach((m,i) => {
        console.log("i: " + i);
        if(m.sender == this.service_acc_name)//need to fix (rn theres no way of knowing if who user1 is)
        {
          console.log("m.text: "+ m.text + " m.date: " + m.date);
          let message = new Message(m.text,true,new Date (m.date))
          console.log("message: "+ message);
          messages.push(message);
        }
        else
        {
          console.log("m.text: "+ m.text);
          let message = new Message(m.text,false,new Date (m.date))
          messages.push(message);
        }
        if(i == m_length)
          { console.log("messages[0]: " + messages[0].text);
            let id:number = this.DBConvos[index];
            let date: Date = new Date();
            console.log("messages: "+ messages);
            var c = new Convo(id,user,messages, date);
            this.convos.push(c);
            console.log("pushed to convo");
          }
        
      });
      if(index == c_length)
        {
          
          this.arr = [this.convos];
          if(check)
            {
              this.convoIDCheck(bad_ids);
            }
        }
      });
      console.log("arr " + this.arr);
  }

  //opens up new message modal
  handleNewMessageClick()
  {
    if(!this.convo_clicked)
      {
        this.show = true;
      }
    
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
