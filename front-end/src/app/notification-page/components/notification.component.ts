import { Component, Input} from '@angular/core';
import { Notification } from '../../data';


@Component({

  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: '../notification-page.component.scss',

})
export class NotificationComponent {
@Input () notification = new Notification('','','','');
 
}