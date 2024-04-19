import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { Profile, Show } from '../../../data';

@Component({

  selector: 'profile-modal',
  templateUrl: './profile-modal.component.html',
})
export class ProfileModalComponent implements OnChanges{
  

  @Input() profile = new Profile('','','','',0,0);
  //@Input() show: boolean = false;
  @Input() show = new Show(false);

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
  

