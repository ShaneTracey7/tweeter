import { Component, ViewEncapsulation } from '@angular/core';

@Component({

  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  encapsulation: ViewEncapsulation.None
/* HOPING the scope of this is just within home-page module, but it could be global */
})
export class HomePageComponent {

}
