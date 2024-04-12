import { Component } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule } from '@angular/router';
import { NavigationBarComponent } from './shared/components/navigation-bar/navigation-bar.component';

@Component({
  /*standalone: true,*/
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  /*imports: [HomePageComponent, NavigationBarComponent, RouterModule]*/
})
export class AppComponent {
  title = 'front-end';
}
