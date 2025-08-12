import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { LoginPageComponent } from './features/login-page/login-page.component';
import { LoginModalComponent } from './features/login-page/components/login-modal.component';
import { SignupModalComponent } from './features/login-page/components/signup-modal.component';

import { PermissionsService } from './core/auth.guard'

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/auth.interceptor';

@NgModule({
  declarations: [
    
    AppComponent,   
    LoginPageComponent,
    LoginModalComponent,
    SignupModalComponent,
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
    ReactiveFormsModule,
    
],
  providers: [PermissionsService,  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule {}
