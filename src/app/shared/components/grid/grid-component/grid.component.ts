import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';
import {
  Observable,
  Subscription
} from 'rxjs';
import { AbstractGridProvider } from '../grid';


@Component({
  selector: 'ag-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy {

  /** Public members */
  @ViewChild('rowsAnchor', {read: ViewContainerRef}) private rowsAnchor: ViewContainerRef;
  @ViewChild('titlesAnchor', {read: ViewContainerRef}) private titlesAnchor: ViewContainerRef;
  @Input() public observable: Observable<any>;
  public childComponents = [];

  /** Private members */
  private subscriptions: Subscription[] = [];


  /**
   * Creates an instance of GridComponent.
   *
   * @param {ChangeDetectorRef} cdr
   * @param {ComponentFactoryResolver} componentFactoryResolver
   *
   * @memberOf GridComponent
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private gridProvider: AbstractGridProvider
  ) {}


  /**
   * LifeCycle Hook: On Init
   *
   *
   * @memberOf GridComponent
   */
  ngOnInit() {
    this.observable
      .filter(data => data !== null)
      .take(1)
      .do(() => {
        let title = this.gridProvider.createTitleRow(this.createTitleComponent.bind(this));
      })
      .subscribe((rows) => {
        this.gridProvider.createRows(rows, this.createRowComponent.bind(this), this.childComponents);
        rows
          .forEach((row, index) => {
            this.childComponents[index].instance.data$.next(row);
          });
        this.cdr.markForCheck();
        this.subscription = this.observable
          .subscribe(data => {
            data
              .forEach((row, index) => {
                this.childComponents[index].instance.data$.next(row);
              });
          });
      });
  }


  /**
   * LifeCycle Hook: On Destroy
   *
   *
   * @memberOf GridComponent
   */
  public ngOnDestroy() {
    this.subscriptions
      .forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      });
  }


  /**
   * Higher Order Function to pass to the create rows method on the grid provider
   *
   * @private
   * @param {any} rowClass
   * @returns
   *
   * @memberOf GridComponent
   */
  private createRowComponent<T>(rowClass) {
    return this.rowsAnchor.createComponent(
      this.componentFactoryResolver.resolveComponentFactory<T>(rowClass)
    );
  }


  /**
   * Higher Order Function to pass to the create titles method on the grid provider
   *
   * @private
   * @template T
   * @param {any} rowClass
   * @returns
   *
   * @memberOf GridComponent
   */
  private createTitleComponent<T>(rowClass) {
    return this.titlesAnchor.createComponent(
      this.componentFactoryResolver.resolveComponentFactory<T>(rowClass)
    );
  }


  /**
   * Add a Subscription to the Subscriptions
   *
   * @private
   *
   * @memberOf GridComponent
   */
  private set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

}
