import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { CrudComponent } from '../crud/crud.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { TweetService } from './tweet-service';
import { LogoutModalComponent } from '../shared/components/navigation-bar/logout-modal.component';
import { ProfilePageComponent } from '../features/profile-page/profile-page.component';
import { PostPageComponent } from '../features/post-page/post-page.component';
import { EditProfileModalComponent } from '../features/profile-page/components/edit-profile-modal.component';
import { SearchBarComponent } from '../shared/components/search-bar/search-bar.component';




@NgModule({
  declarations: [
    
    CoreComponent,
    NavigationBarComponent,
    MainContentComponent,
    CrudComponent,
    HomePageComponent,
    ExplorePageComponent,
    MessagePageComponent,
    NotificationPageComponent,
    ProfilePageComponent,
    PostComponent,
    MessageComponent,
    NotificationComponent,
    SearchCardComponent,
    SecondaryContentComponent,
    ShortProfileComponent,
    ProfileModalComponent,
    LogoutModalComponent,
    PostPageComponent,
    EditProfileModalComponent,
    SearchBarComponent,
    
  ],
  imports: [
    RouterModule,
    //BrowserModule,
    CoreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    //HttpClientModule,
    RouterLink, 
    RouterLinkActive,
    CommonModule
  ],
  providers: [/*CoreService,*/TweetService], //new
  bootstrap: [CoreComponent]
})
export class CoreModule {}
