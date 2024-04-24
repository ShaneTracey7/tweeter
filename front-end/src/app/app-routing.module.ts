import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { CoreComponent } from './core/core.component';
import { LoginPageComponent } from './features/login-page/login-page.component';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full',
  },
  {
    path: 'tweeter',
    //component: CoreComponent,
    loadChildren: () => import('../app/core/core.module').then(m => m.CoreModule)
  },
  {
    path: 'Login',
    component: LoginPageComponent,
    title: 'Login',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Error',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
    routes,
    { enableTracing: true } // <-- debugging purposes only
  )
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
