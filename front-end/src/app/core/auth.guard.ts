import { Injectable, Injector, inject } from '@angular/core';      
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, Router } from '@angular/router';      
import { Observable } from 'rxjs';  
import { CoreService } from './core-service.service';
import { AuthService } from './auth.service';


@Injectable({
    providedIn: 'root'
  })
  export class PermissionsService {
  
    constructor(private router: Router/*, private auth: AuthService, public service: CoreService*/) {}

    decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Invalid JWT', error);
    return null;
    }
}
    
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //your logic goes here
        if (this.isLoggedIn()) {      
            return true;      
            }      
            // navigate to login page as user is not authenticated      
         this.router.navigate(['/Login']);      
        return false;
    }
    public isLoggedIn(): boolean {  
  
      const token = sessionStorage.getItem('access');
      if (!token) return false;

      const decoded = this.decodeJWT(token);
      if (!decoded || !decoded.exp)
      {
        console.log("error decoding")
        return false;
      } 
      else
      {
        console.log("successful decode")
        const exp = decoded.exp;
        let check = Date.now() < exp * 1000;
        if(check)
        { //token expired
         // const cs = this.injector.get(CoreService);
          //cs.reset();
         // this.auth.triggerLogout(); //may cause stuff to mess up
          //this.service.reset(); //clears cached data from session with expired token
          return check;
        }
        else
        {
          //token good
          return check;
        } 
        
      }  
}

  }
  
  export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(PermissionsService).canActivate(next, state);
  }







