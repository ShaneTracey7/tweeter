import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { Convo, Profile } from '../../core/data';
import { TweetService } from '../../core/tweet-service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrl: './message-page.component.scss'
})
export class MessagePageComponent extends CoreComponent{

convo_clicked: boolean = false; //true: shows seleected converstion, false: shows 'select a message blurb'
selectedConvo: Convo = new Convo(new Profile('','','','',0,0),[]); //selected convo
messagePageComponent = this;

constructor(authService: AuthService, route: ActivatedRoute, service: CoreService, public tweetService: TweetService)
{
  super(authService,route,service);
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

}
