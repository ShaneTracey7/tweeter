import { Component } from '@angular/core';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.scss'
})
export class NotificationPageComponent{
  
  constructor(public service: CoreService) { }
}
