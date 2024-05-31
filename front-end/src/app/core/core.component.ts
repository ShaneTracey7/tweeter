import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getImgUrl } from './data';
import { CoreService } from './core-service.service';


@Component({
  /*standalone: true,*/
  selector: 'core-component',
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
  /*imports: [HomePageComponent, NavigationBarComponent, RouterModule]*/
})
export class CoreComponent{
  title = 'front-end';

  constructor(public route: ActivatedRoute, public service: CoreService) { 
    this.service.current_page = this.route.snapshot.url.toString();
    this.service.cp_style = this.route.snapshot.url.toString();
  }
  
}
