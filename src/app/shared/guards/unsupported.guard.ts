import { NgModule, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// import { Observable } from 'rxjs/Rx';
// import { environment } from './../../../environments/environment';

@Injectable()
export class UnsupportedGuard implements CanActivate {
  constructor() { }

  /**
   * @name canActivate
   * @memberOf EntitlementsGuard
   *
   * @returns {boolean}
   */
  canActivate() {
    if (this.isChrome()) {
      return true;
    } else {
      window.location.href = '/errors/unsupported';
      return false;
    }
  }

  private isChrome(): boolean {
    return /Chrome/i.test(navigator.userAgent);
  }
}
