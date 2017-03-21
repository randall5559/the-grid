/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ErrorsComponent } from './errors.component';

describe('Errors Component', () => {
  class MockUnsupportedActivatedRoute {
    public params;
    public url;

    constructor() {
      this.params = Observable.of({ 'errId': 'unsupported' });
      this.url = new Observable<UrlSegment>();
    }
  }

  class MockUnauthorizedActivatedRoute {
    public params;
    public url;

    constructor() {
      this.params = Observable.of({ 'errId': 'unauthorized' });
      this.url = new Observable<UrlSegment>();
    }
  }

  class MockNotFoundActivatedRoute {
    public params;
    public url;

    constructor() {
      this.params = Observable.of({ 'errId': 'not-found' });
      this.url = new Observable<UrlSegment>();
    }
  }

  class MockServerErrorActivatedRoute {
    public params;
    public url;

    constructor() {
      this.params = Observable.of({ 'errId': 'server-error' });
      this.url = new Observable<UrlSegment>();
    }
  }

  function mockActivatedRoute(klazz, status: string, msg: string): void {
    TestBed.configureTestingModule({
      declarations: [ErrorsComponent],
      providers: [{ provide: ActivatedRoute, useClass: klazz }]
    });
    TestBed.compileComponents();

    let fixture = TestBed.createComponent(ErrorsComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    let contact = 'Please contact an administrator if you believe this to be a mistake.';
    expect(compiled.querySelector('h1').textContent).toEqual(status);
    expect(compiled.querySelector('p.msg').textContent).toEqual(msg);
    expect(compiled.querySelector('p.admin-txt').textContent).toEqual(contact);
  }

  describe('.ngOnInit', () => {
    it('should create a Unsupported error page when given the appropriate url', () => {
      let status = '403 Error: Unsupported';
      let msg = 'You are attempting to view this page with an unsupported browser.      ' +
      'Agency Gateway currently only supports Google Chrome. Please visit' +
      '             this page to download Chrome if you have not already.';
      mockActivatedRoute(MockUnsupportedActivatedRoute, status, msg);
    });

    it('should create a Unauthorized error page when given the appropriate url', () => {
      let status = '403 Error: Unauthorized';
      let msg = 'You are not authorized to view the page you requested.';
      mockActivatedRoute(MockUnauthorizedActivatedRoute, status, msg);
    });

    it('should create a NotFound error page when given the appropriate url', () => {
      let status = '404 Error: Not Found';
      let msg = 'The page you requested was not found.';
      mockActivatedRoute(MockNotFoundActivatedRoute, status, msg);
    });

    it('should create a ServerError error page when given the appropriate url', () => {
      let status = '500 Error: Internal Server Error';
      let msg = 'There was an internal server error.';
      mockActivatedRoute(MockServerErrorActivatedRoute, status, msg);
    });
  });
});
