import { Component, OnInit } from '@angular/core';
import { StateManagerService } from '../services';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../../environments/environment';


@Component({
  selector: 'ag-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
  private cookieService: CookieService = new CookieService();

  lNameFInit: string = '';
  userEntitlements: Array<string>;

  constructor(private stateManager: StateManagerService) { }

  ngOnInit() {
    this
      .stateManager
      .getModel('UserProfile')
      .subscribe((data: Object) => {
        if (!(Object.keys(data).length === 0)) {
          this.lNameFInit = `${data['last_name']}, ${data['first_name'].charAt(0)}`;
        }
      });
  }

  logout() {
    this.cookieService.remove('ag_user_token', {domain: 'nbcuni.com', secure: true});
    window.location.href = environment.ssoLogoutUrl;
  }

}
