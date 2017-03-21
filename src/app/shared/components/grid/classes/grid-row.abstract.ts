import {
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  ReplaySubject,
  Subscription
} from 'rxjs';


export abstract class AbstractRowComponent implements OnInit, OnDestroy {


  /** Public members */
  public row;
  public data$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public updates$: ReplaySubject<any> = new ReplaySubject<any>(1);

  /** Private members */
  protected subscriptions: Subscription[] = [];


  /**
   * Creates an instance of AbstractRowComponent.
   * 
   * @param {ChangeDetectorRef} cdr
   * 
   * @memberOf AbstractRowComponent
   */
  constructor(
    protected cdr: ChangeDetectorRef
  ) {
    this.data$.next(null);
    this.updates$.next(null);
  }


  /**
   * LifeCycle Hook: On Init of the component
   * 
   * 
   * @memberOf AbstractRowComponent
   */
  public ngOnInit() {

    this.subscription = this.data$
      .filter(row => row !== null)
      .distinctUntilChanged((a, b) => a === b)
      .subscribe(data => {
        this.row = data;
        this.cdr.markForCheck();
      });

    // call the class onInit method
    this.onRowInit();

  }


  /**
   * LifeCycle Hook: On Destory
   * 
   * 
   * @memberOf AbstractRowComponent
   */
  public ngOnDestroy() {
    this.subscriptions
      .forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      });
  }


  /**
   * Add a Subscription to the Subscriptions
   * 
   * @protected
   * 
   * @memberOf AbstractRowComponent
   */
  protected set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }


  /**
   * Defined by the extending class to be called in the OnInit lifecycle hook
   * 
   * @protected
   * @abstract
   * 
   * @memberOf AbstractRowComponent
   */
  protected abstract onRowInit();

}
