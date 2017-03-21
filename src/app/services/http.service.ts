import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'angular2-cookie/core';
import { MessageService } from './../shared/components/messaging/message.service';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpService extends Http {
  private cookieService: CookieService = new CookieService();
  private message: MessageService = new MessageService();
  private token: string;

  constructor (private backend: XHRBackend, options: RequestOptions) {
    super(backend, options);

    this.token = this.cookieService.get(environment.tokenKey); // your custom token getter function here

    if (this.token) {
      options.headers.set('Authorization', `Bearer ${this.token}`);
    }
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {

    if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
      if (!options) {
        // let's make option object
        options = {headers: new Headers()};
      }

      options.headers.set('Content-Type', 'application/json');
      options.headers.set('Authorization', `Bearer ${this.token}`);
    } else {
      // we have to add the token to the url object
      url.headers.set('Content-Type', 'application/json');
      url.headers.set('Authorization', `Bearer ${this.token}`);
    }
    return super.request(url, options).catch(this.catchAuthError(this));
  }

  private catchAuthError (self: HttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      if (res.status === 401 || res.status === 403) {
        // if not authenticated
        this.cookieService.remove(environment.tokenKey);
        window.location.href = environment.ssoLogoutUrl;

      }
      return Observable.throw(res);
    };
  }
}
