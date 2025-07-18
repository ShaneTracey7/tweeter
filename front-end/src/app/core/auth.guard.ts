import { Injectable, inject } from '@angular/core';      
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, Router } from '@angular/router';      
import { Observable } from 'rxjs';  
//import jwt_decode from "jwt-decode";    
import * as jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
  })
  export class PermissionsService {
  
    constructor(private router: Router) {}

    
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
  
      const token = localStorage.getItem('access_token');
      if (!token) return false;

      try 
      {
         const decoded = (jwt_decode as any)(token) as { exp: number };
         const { exp } = decoded;
         
        if (Date.now() >= exp * 1000) 
        {
          // token expired
          return false;
        }
        else
        {
          return true; // token is present and not expired
        }  
        
      } 
      catch (error) 
      {
        // token is malformed or decoding failed
        return false;
      }
      /*
        let status = false;      
        if (localStorage.getItem('isLoggedIn') == "true") {      
           status = true;      
        }
          else {      
           status = false;      
           }      
        return status;      
        }    
        */
}

  }
  
  export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(PermissionsService).canActivate(next, state);
  }







