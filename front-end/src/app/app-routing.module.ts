import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ExplorePageComponent } from './explore-page/explore-page.component';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { MessagePageComponent } from './message-page/message-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Home'
  },
  {
    path: 'Explore',
    component: ExplorePageComponent,
    title: 'Explore'
  },
  {
    path: 'Notification',
    component: NotificationPageComponent,
    title: 'Notification'
  },
  {
    path: 'Message',
    component: MessagePageComponent,
    title: 'Message'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
