import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { Convo } from '../../core/data';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrl: './message-page.component.scss'
})
export class MessagePageComponent extends CoreComponent{

convo_clicked: boolean = false; //true: shows seleected converstion, false: shows 'select a message blurb'
convo: Convo = new Convo('','',[]); //selected convo

messagePageComponent = this;

}
