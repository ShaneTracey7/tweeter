import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CrudComponent } from './crud/crud.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { LoginPageComponent } from './features/login-page/login-page.component';
import { LoginModalComponent } from './features/login-page/components/login-modal.component';



@NgModule({
  declarations: [
    
    AppComponent,   
    LoginPageComponent,
    LoginModalComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterLink, 
    RouterLinkActive,
    CommonModule,
    CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
