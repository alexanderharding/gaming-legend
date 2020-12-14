import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // const id = +next.url[1].path;
    const id = +next.paramMap.get('id');

    if (isNaN(id) || id < 1 || id > 19) {
      // alert('Invalid product Id');
      this.router.navigate(['/not-found']);
      return false; // abort the route activation
    }
    return true; // let the route activate!
  }
}
