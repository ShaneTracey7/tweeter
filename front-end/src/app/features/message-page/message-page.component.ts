import { Component, SimpleChanges, HostListener } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { Convo ,Message, Post, Profile } from '../../core/data';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrl: './message-page.component.scss'
})
export class MessagePageComponent extends CoreComponent{

isMobile: boolean = false; //checks if window is less than 700px (needed for message page layout)
show: boolean = false; // show/hide new message modal
convo_clicked: boolean = false; //true: shows seleected converstion, false: shows 'select a message blurb'
selectedConvo: Convo = new Convo(0,new Profile('','','','','',0,0),[],new Date()); //selected convo
convoIndex: number = -1; //index of selected convo
selected: boolean = false; //only needed for message component
service_acc_name: string;
arr: any [] = [];

emptyConvo = new Convo(0,new Profile('','','','','',0,0),[], new Date());

DBConvos: any [] = []; //array of convo_ids
DBUsers: any [] = []; 
DBMessages: any [] = [];
DBTweets: any [] = []; //tweets in messages
DBTweetUsers: any [] = []; //users of tweets in messages
convos: Convo [] = [];

loadingFlag: boolean = true; //flag to show spinner while data is being fetched

timer:any; //used to delay showing delete button
show_delete: boolean = false; //only have one message have the option to delete at a time
showIndex: number = -1; //index of message to show delete button for

messageForm = this.formBuilder.group({
  message: ['', [Validators.required]],
  });

constructor(public formBuilder: FormBuilder, route: ActivatedRoute, service: CoreService )
{
  super(route,service);
  this.service_acc_name = "";
}

ngOnInit()
{
  this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";
  this.service.setCurrentPage("Messages");
  this.checkScreenSize();

  if(this.service.shareID != 0)
    {
      console.log("this.service.shareUser: " + this.service.shareUser); //user to send tweet to
      console.log("this.service.shareID: " +this.service.shareID); //post id of tweet
      this.createDBConvo(this.service_acc_name, this.service.shareUser, true);
    }
  else //normal route
  {
    this.getConvos(false,false,''); //test
  }
}
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 700;
  }

handleSelectedConvoChange(convo: Convo) {
  this.selectedConvo = convo;
  this.convoIndex = this.convos.findIndex(c => c.id === convo.id);
  console.log('Selected convo changed:', this.selectedConvo);
}

//have this return a class instead
//reword this to be a concise if statement detemrining class
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

//creates a convo in the db if it does not exist for when a tweet is DM'ed
createDBConvo(thisUser: string, otherUser: string, sharedTweet: boolean/*, text: string*/)
{
  let requestBody =
    {
      "word" : thisUser, //user1
      "word2" : otherUser, //user2
    };

    this.service.http.post(environment.apiUrl + "/message",requestBody).subscribe((resultData: any)=>
      {
        console.log(resultData);
  
        if(resultData == 'Failed to Add')
          {
            console.log("Unsuccessful Database Retrieval");
          }
        else if(resultData == 'Convo already exists')
        {
          //dont create convo
          this.getConvos(false,sharedTweet, otherUser); //new
        }
        else
        {
          this.getConvos(true,sharedTweet,''); //gets all convos and sets them in front end (sets selectedConvo too)
          console.log("Successful Database Retrieval");
        }
      });
}

//sets the selected convo 
findConvo(otherUser: string)
{
  this.convos.forEach((convo,index) => {
      if(convo.otherUser.acc_name == otherUser)
      {
        this.selectedConvo = convo;
        this.convoIndex = index; //set index of convo
      }  
  });
}

//creates a message (locally and in db) from user input in message page
createDBMessage(convo_id: number, sent_acc_name: string,text: string)
{
  let requestBody =
    {
      "word" : 'addMessage', 
      "word2" : sent_acc_name, // sent account name
      "word3" : text, //message text
      "num" : convo_id,

    };
    this.service.http.put(environment.apiUrl + "/message",requestBody).subscribe((resultData: any)=>
      {
        console.log(resultData);
  
        if(resultData == 'Failed to Add')
          {
            console.log("Unsuccessful Database Retrieval");
          }
        else
          {
            let newMessage = new Message(Number(resultData),text,null,null,true,new Date());
            this.selectedConvo.messages.push(newMessage);
            this.convos = [...this.convos]; //update convos array to trigger change detection
            console.log("Successful Database Retrieval");
          }
      });
}

//creates a tweet message (locally and in db) from 'send via DM' option from a tweet
createDBTweetMessage(convo_id: number, sent_acc_name: string, post_id: number)
{
  let requestBody =
    {
      "word" : 'addTweetMessage', 
      "word2" : sent_acc_name, // sent account name
      "word3" : String(post_id), //post_id in string form
      "num" : convo_id,
    };

    this.service.http.put(environment.apiUrl + "/message",requestBody).subscribe((resultData: any)=>
      {
        console.log(resultData);
  
        if(resultData == 'Failed to Add')
          {
            console.log("Unsuccessful Database Retrieval");
          }
        else
          {
            let i = resultData[0]; //message id
            let u = resultData[1]; //user
            let p = resultData[2]; //post
            let post = new Post(p.id,u.pic?.image_url,u.username,u.acc_name,p.date_created,p.text_content,p.image_content == null ? '': p.image_content,p.comments,p.retweets,p.likes,p.engagements)
            let profile = new Profile(u.pic?.image_url,u.header_pic?.image_url,u.username,u.acc_name,u.bio,u.following_count,u.follower_count);
            /* need id to be returned form db*/
            let newMessage = new Message(Number(i),'',post,profile, true,new Date());
            this.selectedConvo.messages.push(newMessage);
            console.log("Successful Database Retrieval");
          }

        this.service.shareID = 0; //resetting
      });
}

getConvoIds()
{
  var bad_ids: number [] = []
  this.convos.forEach((c,index) => {
    bad_ids.push(c.id)
     console.log("gci index: " + index)
});
  return bad_ids;
}

// attempts to set selectedConvo
convoIDCheck(bad_ids: number [])
  {
    this.convos.forEach((c,index) => {

      if(!bad_ids.includes(c.id))
      {
        this.selectedConvo = c;
        this.convoIndex = index; //set index of convo
        this.convo_clicked = true;
        this.selected = true;
      }
       console.log("cic index: " + index)
  });
  }

//gets convos from db and sets local variables
getConvos(check: boolean, sharedTweet: boolean, otherUser: string)
  {
    let requestBody =
    {
      "word" : "getConvos",
      "word2" : this.service_acc_name,
    };

    this.service.http.put(environment.apiUrl +"/message",requestBody).subscribe((resultData: any)=>
    {
     
      if(resultData == 'Failed to Add' || resultData == 'No convos')
      {
        this.DBConvos = [];
        this.DBUsers = [];
        this.DBMessages = [];
        this.DBTweets = [];
        this.DBTweetUsers = [];
        console.log("Unsuccessful Database Retrieval");
        this.loadingFlag = false; //hide spinner after data is loaded
      }
      else
      {
        console.log("Successful Database Retrieval");
        this.DBConvos = resultData[0];
        this.DBUsers = resultData[1];
        this.DBMessages = resultData[2];
        this.DBTweets = resultData[3];
        this.DBTweetUsers = resultData[4];
        let bad_ids: number [] = this.getConvoIds();
        this.convertDBConvos(bad_ids, check, sharedTweet, otherUser);
      }
    });
  }

  //converts raw DB data into local objects
  convertDBConvos(bad_ids: number [], check: boolean, sharedTweet: boolean, otherUser: string)
  {  
    this.convos = [];
  
    this.DBUsers.forEach((u,index) => {

      let user = new Profile(u.pic?.image_url,u.header_pic?.image_url,u.username,u.acc_name,u.bio,u.following_count,u.follower_count);
      let messages: Message [] = [];
      let message_arr: any [] = this.DBMessages[index];

      if(message_arr[0] == 0) //something to do with back-end
      {
        let id:number = this.DBConvos[index];
        let date: Date = new Date();
        let arr: Message [] = []
        var c = new Convo(id,user,arr, date);
        this.convos.push(c);
        return;
      }

      message_arr.forEach((m,i) => {

        var isSender;
        if(m.sender == this.service_acc_name)
        {
          isSender = true;
        }
        else
        {
          isSender = false;
        }
        var message;
        if(m.text == '') //is a tweet
        {
          let u = this.DBTweetUsers[index][i];
          let p = this.DBTweets[index][i];
          let post = new Post(p.id,u.pic?.image_url,u.username,u.acc_name,p.date_created,p.text_content,p.image_content == null ? '' : p.image_content,p.comments,p.retweets,p.likes,p.engagements)
          let profile = new Profile(u.pic?.image_url,u.header_pic?.image_url,u.username,u.acc_name,u.bio,u.following_count,u.follower_count);
          message = new Message(m.id,'', post,profile,isSender,new Date (m.date));
        }
        else // is a normal message
        {
          message = new Message(m.id,m.text, null,null,isSender,new Date (m.date))
        }
        messages.push(message);
        
      });

      let id:number = this.DBConvos[index];
      let date: Date = new Date();
      var c = new Convo(id,user,messages, date);
      this.convos.push(c);
    });
      
      this.arr = [this.convos];
      this.loadingFlag = false; //hide spinner after data is loaded
      if(check)
      {
        this.convoIDCheck(bad_ids);
      }
      else
      {
        if(sharedTweet)
        {
          this.findConvo(this.service.shareUser); //sets selectedConvo
          this.convo_clicked = true;
          this.selected = true;
        }
        else
        {
          if(otherUser != '')
          {
            this.findConvo(otherUser); //sets selectedConvo
            this.convo_clicked = true;
            this.selected = true;
          }
        }
      }
          
      if(sharedTweet)
      {
        this.createDBTweetMessage(this.selectedConvo.id, this.service_acc_name, this.service.shareID);
      }
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
      this.messageForm.reset(); //reset form
      console.log('message sent');
    }
    else
    {
      console.log('message not sent');
    }
  }

  handleDeleteMessage(index: number, id: number)
  {

    //make change locally
    this.selectedConvo.messages.splice(index, 1);
    //to double check 
    this.convos[this.convoIndex].messages = this.selectedConvo.messages;
    this.convos = [...this.convos]; //update convos array to trigger change detection
    //this.arr = [...this.convos]; //update arr to trigger change detection
    this.show_delete = false; //hide delete button
    //make change in db
   let requestBody =
    { 
      "word" : "deleteMessage",
      "word2" : "a", // have to send or will not work
      "word3" : "a", // have to send or will not work
      "num" : id, //message id
    };
    
    this.service.http.put(environment.apiUrl +"/message",requestBody).subscribe((resultData: any)=>
    {
     
      if(resultData != 'Deleted Successfully')
      {
        console.log('failed to delete message');
      }
      else
      {
        console.log('message deleted');
      }
    });
    
  }

   //shows profile modal only if there are no other open modals
  showDelete(index: number)
  {
    if(this.show_delete)
    {
      return; //pnly have option to delete one message at a time
    }  
    else
    {
      var obj = this;
      obj.timer = setTimeout(function(){
        obj.showIndex = index; //set index to show delete button for this message
        obj.show_delete = true;
      },1000);//delay for how long to be hovering over profile pic to show modal
    }
      
  }
  

  //prevents modal from appearing if mouse isnt over profile pic long enough
  hideDelete()
  {
    clearTimeout(this.timer);
  }

  /*changeOpenModal(newValue: boolean){
    this.openmodal = newValue;
    console.log(this.openmodal);
  }*/
}
