import { NgModule, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/core';
import { environment } from './../../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  private cookieService: CookieService = new CookieService();

  constructor(private token: string) {}

  /**
   * @name canActivate
   * @memberOf EntitlementsGuard
   *
   * @returns {boolean}
   */
  canActivate() {
    if (environment.envName === 'local' || this.cookieService.get(this.token)) {
      return true;
    } else {
      window.location.href = environment.ssoLoginUrl;
      return false;
    }
  }
}
