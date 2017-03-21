import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, RequestOptions, XHRBackend } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { WelcomeModule } from './welcome/welcome.module';

import {
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';
import {
  DataService,
  ActionsService,
  HttpService,
  StateManagerService
} from './services';
import { AppComponent } from './app.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PeacockComponent } from './shared/components/peacock/peacock.component';
import { PeacockService } from './shared/components/peacock/peacock.service';
import { MessagingComponent } from './shared/components/messaging/messaging.component';
import { ErrorsComponent } from './shared/components/errors';
import { MessageService } from './shared/components/messaging/message.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { DropdownModule } from 'ng2-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    PageHeaderComponent,
    PeacockComponent,
    MessagingComponent,
    ErrorsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    WelcomeModule,
    DropdownModule.forRoot()
  ],
  providers: [
    DataService,
    StateManagerService,
    MessageService,
    PeacockService,
    ActionsService,
    CookieService,
    { provide: CurrencyPipe, useFactory: CurrencyPipeFactory },
    { provide: DecimalPipe, useFactory: NumberPipeFactory },
    { provide: HttpService, useFactory: HttpFactory, deps: [XHRBackend, RequestOptions] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  /**
   * Creates an instance of AppModule.
   *
   * Init the app wide models
   *
   * @param {StateManagerService} stateManager
   *
   * @memberOf AppModule
   */
  constructor(private stateManager: StateManagerService, private data: DataService, private actions: ActionsService) {
    /** API info model */
    stateManager.createModel('Api');
    stateManager.setModel('Api', {});

    /** User Profile Model */
    stateManager.createModel('UserProfile');
    stateManager.setModel('UserProfile', {});

    stateManager.createModel('ParentAgencyInfo');
    stateManager.setModel('ParentAgencyInfo', {});

    /** Main App Model */
    stateManager.createModel('AgencyModel');
    stateManager.setModel('AgencyModel', null);

    stateManager.createModel('DashboardAgencyModel');
    stateManager.setModel('DashboardAgencyModel', null);

    stateManager.createModel('AgencyDealsDirty');
    stateManager.setModel('AgencyDealsDirty', false);

    /** Filter Models */
    stateManager.createModel('AgencyFilterModel');
    stateManager.setModel('AgencyFilterModel', []);

    stateManager.createModel('PropertyFilterModel');
    stateManager.setModel('PropertyFilterModel', []);

    stateManager.createModel('AdvertiserFilterModel');
    stateManager.setModel('AdvertiserFilterModel', []);

    stateManager.createModel('DemoFilterModel');
    stateManager.setModel('DemoFilterModel', []);

    stateManager.createModel('SpendVarianceFilterModel');
    stateManager.setModel('SpendVarianceFilterModel', []);

    stateManager.createModel('CommentsModel');
    stateManager.setModel('CommentsModel', {});
  }
}


/**
 * Currency Pipe Factory
 *
 * @export
 * @returns
 */
export function CurrencyPipeFactory(): CurrencyPipe {
  return new CurrencyPipe('US');
}


/**
 * Decimal Pipe Factory
 *
 * @export
 * @returns
 */
export function NumberPipeFactory(): DecimalPipe {
  return new DecimalPipe('US');
}


/**
 *
 *
 * @export
 * @param {XHRBackend} backend
 * @param {RequestOptions} options
 * @returns
 */
export function HttpFactory(backend: XHRBackend, options: RequestOptions) {
  return new HttpService(backend, options);
}
