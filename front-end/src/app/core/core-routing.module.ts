import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '../features/home-page/home-page.component';
import { ExplorePageComponent } from '../features/explore-page/explore-page.component';
import { NotificationPageComponent } from '../features/notification-page/notification-page.component';
import { MessagePageComponent } from '../features/message-page/message-page.component';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { CoreComponent } from './core.component';
import { PermissionsService } from './auth.guard';



const routes: Routes = [

  { 
    path: '',
    redirectTo: 'Home', 
    pathMatch: 'full' 
  },
  
  {
    path: '',
    component: CoreComponent,
    //canActivate : [PermissionsService],
    children: [
      {
        path: 'Home',
        component: HomePageComponent,
        canActivate : [PermissionsService],
        title: 'Home',
      },
      {
        path: 'Explore',
        component: ExplorePageComponent,
        canActivate : [PermissionsService],
        title: 'Explore',
      },
      {
        path: 'Notifications',
        component: NotificationPageComponent,
        canActivate : [PermissionsService],
        title: 'Notifications',
      },
      {
        path: 'Messages',
        component: MessagePageComponent,
        canActivate : [PermissionsService],
        title: 'Messages',
      },


    ],

  },
  /*
  {
    path: '',
    redirectTo: 'Home',
    pathMatch: 'full',
  },
  */
 


/*

  {
    path: 'Home',
    component: HomePageComponent,
    title: 'Home',
    /*
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
      //
      {
        path: 'foryou',
        component: HomePageComponent,
        //outlet: 'forYouFeed'
      },//
    
  },

  {
    path: 'Explore',
    component: ExplorePageComponent,
    title: 'Explore',
    /*
    children: [
      {
        path: '',
        component: ExplorePageComponent,
      },
      //
      {
        path: 'foryou',
        component: ExplorePageComponent,
      },
      //
      {
        path: 'trending',
        component: ExplorePageComponent,
      },
      {
        path: 'news',
        component: ExplorePageComponent,
      },
      {
        path: 'sports',
        component: ExplorePageComponent,
      },
      {
        path: 'entertainment',
        component: ExplorePageComponent,

      },
    ]

  },

  {
    path: 'Notifications',
    component: NotificationPageComponent,
    title: 'Notifications',
    /*
    children: [
      {
        path: '',
        component: MainContentComponent,
      },
      //
      {
        path: 'all',
        component: MainContentComponent,
      },
      //
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
    path: 'Messages',
    component: MessagePageComponent,
    title: 'Messages',
    /*
    children: [
      {
        path: '',
        component: MessagePageComponent,
      },
    ]
  },
  */
  {
    path: '**',
    component: CoreComponent,
    title: 'Error',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
