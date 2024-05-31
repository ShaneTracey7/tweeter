import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CoreComponent } from '../../../core/core.component';
import { getImgUrl } from '../../../core/data';
import { CoreService } from '../../../core/core-service.service';
@Component({

  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',

})
export class NavigationBarComponent{

  constructor(public service: CoreService) { }
}
