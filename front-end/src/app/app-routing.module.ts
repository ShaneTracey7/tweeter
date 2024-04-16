import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ExplorePageComponent } from './explore-page/explore-page.component';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { MessagePageComponent } from './message-page/message-page.component';
import { MainContentComponent } from './shared/components/main-content/main-content.component';
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
        component: HomePageComponent,
        //outlet: 'forYouFeed'
      },
      {
        path: 'following',
        component: HomePageComponent,
        //outlet: 'followingFeed'
      },
      {
        path: 'foryou',
        component: HomePageComponent,
        //outlet: 'forYouFeed'
      },
    ]
  },

  {
    path: 'Explore',
    component: ExplorePageComponent,
    title: 'Explore',
    children: [
      {
        path: '',
        component: MainContentComponent,
      },
      {
        path: 'foryou',
        component: MainContentComponent,
      },
      {
        path: 'trending',
        component: MainContentComponent,
      },
      {
        path: 'news',
        component: MainContentComponent,
      },
      {
        path: 'sports',
        component: MainContentComponent,
      },
      {
        path: 'entertainment',
        component: MainContentComponent,

      },
    ]

  },

  {
    path: 'Notification',
    component: NotificationPageComponent,
    title: 'Notification',
    children: [
      {
        path: '',
        component: MainContentComponent,
      },
      {
        path: 'all',
        component: MainContentComponent,
      },
      {
        path: 'mentions',
        component: MainContentComponent,
      },
      {
        path: 'verified',
        component: MainContentComponent,
      },
    ]
  },
  {
    path: 'Message',
    component: MessagePageComponent,
    title: 'Message',
    children: [
      {
        path: '',
        component: MainContentComponent,
      },
    ]
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
