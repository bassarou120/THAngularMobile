import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SharedService } from './shared.service';
import {TokenStorage} from './token.storage';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private tokenStorage: TokenStorage, private sharedService: SharedService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

   let user = await this.sharedService.getUser();
   if(Object.keys(user).length > 0)
   return true;

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
