import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { CrudComponent } from '../crud/crud.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from '../shared/components/navigation-bar/navigation-bar.component';
import { MainContentComponent } from '../shared/components/main-content/main-content.component';
import { HomePageComponent } from '../features/home-page/home-page.component';
import { ExplorePageComponent } from '../features/explore-page/explore-page.component';
import { MessagePageComponent } from '../features/message-page/message-page.component';
import { NotificationPageComponent } from '../features/notification-page/notification-page.component';
import { PostComponent } from '../features/home-page/components/post.component';
import { MessageComponent } from '../features/message-page/components/message.component';
import { NotificationComponent } from '../features/notification-page/components/notification.component';
import { SearchCardComponent } from '../features/explore-page/components/search-card.component';
import { SecondaryContentComponent } from '../shared/components/secondary-content/secondary-content.component';
import { ShortProfileComponent } from '../shared/components/short-profile/short-profile.component';
import { ProfileModalComponent } from '../shared/components/profile-modal/profile-modal.component';
import { CoreService } from './core-service.service';




@NgModule({
  declarations: [
    
    CoreComponent,
    NavigationBarComponent,
    MainContentComponent,
    HomePageComponent,
    CrudComponent,
    ExplorePageComponent,
    MessagePageComponent,
    NotificationPageComponent,
    PostComponent,
    MessageComponent,
    NotificationComponent,
    SearchCardComponent,
    SecondaryContentComponent,
    ShortProfileComponent,
    ProfileModalComponent
    
  ],
  imports: [
    RouterModule,
    //BrowserModule,
    CoreRoutingModule,
    FormsModule,
    //HttpClientModule,
    RouterLink, 
    RouterLinkActive,
    CommonModule
  ],
  providers: [CoreService], //new
  bootstrap: [CoreComponent]
})
export class CoreModule {}
