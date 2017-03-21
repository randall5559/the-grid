import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

declare let ga: any;

@Component({
  selector: 'ag-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private _cookieService: CookieService) {}

  ngOnInit() {
    this.createGaCode(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    ga('create', environment.gaCode, 'none');
    ga('send', 'pageview');
  }

  private createGaCode(i, s, o, g, r, a?, m?) {
    i['GoogleAnalyticsObject'] = r;

    if (i[r]) {
      i[r] = i[r];
    } else {
      i[r] = function () {
        ( i[r].q = i[r].q || []).push(arguments);
      };
    }

    i[r].l = 1 * (<any>new Date());
    a = s.createElement(o);
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  }
}
