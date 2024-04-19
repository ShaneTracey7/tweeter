import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CrudComponent } from './crud/crud.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HomePageComponent } from './home-page/home-page.component';
import { ExplorePageComponent } from './explore-page/explore-page.component';
import { MessagePageComponent } from './message-page/message-page.component';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { NavigationBarComponent } from './shared/components/navigation-bar/navigation-bar.component';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MainContentComponent } from './shared/components/main-content/main-content.component';
import { PostComponent } from './home-page/components/post.component';
import { MessageComponent } from './message-page/components/message.component';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification-page/components/notification.component';
import { SearchCardComponent } from './explore-page/components/search-card.component';
import { SecondaryContentComponent } from './shared/components/secondary-content/secondary-content.component';
import { ShortProfileComponent } from './shared/components/short-profile/short-profile.component';
import { ProfileModalComponent } from './shared/components/profile-modal/profile-modal.component';



@NgModule({
  declarations: [
    
    AppComponent,
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
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterLink, 
    RouterLinkActive,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
