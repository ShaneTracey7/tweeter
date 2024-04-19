import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({

  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  //encapsulation: ViewEncapsulation.None
/* HOPING the scope of this is just within home-page module, but it could be global */
})
export class HomePageComponent extends AppComponent{

  
}
