import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '../features/home-page/home-page.component';
import { ExplorePageComponent } from '../features/explore-page/explore-page.component';
import { NotificationPageComponent } from '../features/notification-page/notification-page.component';
import { MessagePageComponent } from '../features/message-page/message-page.component';
import { ProfilePageComponent } from '../features/profile-page/profile-page.component';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { CoreComponent } from './core.component';
import { PermissionsService } from './auth.guard';
import { PostPageComponent } from '../features/post-page/post-page.component';



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
        children: [
          {
            path: '**',
            component: ExplorePageComponent,
            canActivate : [PermissionsService],
            title: 'Explore',
            
          },
        ],
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
      {
        path: 'Post',
        component: PostPageComponent,
        canActivate : [PermissionsService],
        title: 'Post',
        children: [
          {
            path: '**',
            component: PostPageComponent,
            canActivate : [PermissionsService],
            title: 'Profile',
            
          },

        ],
      },
      {
        path: 'Profile',
        component: ProfilePageComponent,
        canActivate : [PermissionsService],
        title: 'Profile',
        children: [
          {
            path: '**',
            component: ProfilePageComponent,
            canActivate : [PermissionsService],
            title: 'Profile',
            
          },

        ],
      },
      {
        path: 'Error',
        component: PageNotFoundComponent,
        canActivate : [PermissionsService],
        title: 'Error',
      },


    ],

  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Error',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
