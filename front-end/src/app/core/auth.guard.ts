import { Injectable, inject } from '@angular/core';      
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, Router } from '@angular/router';      
import { Observable } from 'rxjs';  


@Injectable({
    providedIn: 'root'
  })
  export class PermissionsService {
  
    constructor(private router: Router) {}

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
        return Date.now() < exp * 1000;
      }  
}

  }
  
  export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(PermissionsService).canActivate(next, state);
  }







