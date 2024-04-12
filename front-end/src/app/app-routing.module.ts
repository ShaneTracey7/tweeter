import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ExplorePageComponent } from './explore-page/explore-page.component';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { MessagePageComponent } from './message-page/message-page.component';
import { ForYouComponent } from './home-page/components/foryou.component';
import { FollowingComponent } from './home-page/components/following.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { NavigationBarComponent } from './shared/components/navigation-bar/navigation-bar.component';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'h',
    pathMatch: 'full',
  },

  {
    path: 'Home',
    component: HomePageComponent,
    title: 'Home',
    children: [
      {
        path: '',
        component: ForYouComponent,
        outlet: 'forYouFeed'
      },
      {
        path: '',
        component: FollowingComponent,
        outlet: 'followingFeed'
      },
      {
        path: 'following',
        component: FollowingComponent,
        outlet: 'followingFeed'
      },
    ]
  },

  {
    path: 'Explore',
    component: ExplorePageComponent,
    title: 'Explore',

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

  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Error',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
