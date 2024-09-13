import { Injectable, inject } from '@angular/core';      
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, Router } from '@angular/router';      
import { Observable } from 'rxjs';      

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
        let status = false;      
        if (localStorage.getItem('isLoggedIn') == "true") {      
           status = true;      
        }
          else {      
           status = false;      
           }      
        return status;      
        }    
  }
  
  export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(PermissionsService).canActivate(next, state);
  }







