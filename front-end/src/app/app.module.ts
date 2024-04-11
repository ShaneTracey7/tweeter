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

@NgModule({
  declarations: [
    CrudComponent,
    ExplorePageComponent,
    MessagePageComponent,
    NotificationPageComponent,
    
  ],
  imports: [
    AppComponent,
    HomePageComponent,
    NavigationBarComponent,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [ExplorePageComponent]
})
export class AppModule {}
