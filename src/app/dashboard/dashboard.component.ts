import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  DataService,
  ActionsService,
  StateManagerService
} from '../services';
import {
  TotalRow,
  SelectItem,
  OptionModel
} from '../interfaces';
import { AbstractGridProvider } from '../shared/components/grid/grid';
import { SideGridService } from './side-grid/side-grid.service';
import * as numeral from 'numeral';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'ag-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    { provide: AbstractGridProvider, useClass: SideGridService }
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  /** Public members */
  public vertical: { broadcast: number, hispanic: number, cable: number, news: number, sports: number, total: number };
  public properties: Array<{ name: string, value: number }>;
  public agencies: Array<{ name: string, value: number }>;
  public dashboardModel;
  public registration_dollars: string = '0';
  public spend_dollars: string = '0';
  public variance_dollars: string = '0';
  public agencyFilter;
  public propertyFilter;

  /** Private Members */
  private subscriptions: Subscription[] = [];


  /**
   * Creates an instance of DashboardComponent.
   *
   * @param {DataService} dataService
   * @param {ActionsService} actions
   * @param {StateManagerService} stateManager
   *
   * @memberOf DashboardComponent
   */
  constructor(
    private dataService: DataService,
    private actions: ActionsService,
    private stateManager: StateManagerService
  ) { }


  /**
   * LifeCycle Hook: On Init
   *
   *
   * @memberOf DashboardComponent
   */
  ngOnInit() {

    this.dataService.getAgencyData()
      .subscribe((data: any) => {
        this.stateManager.setModel('AgencyModel', null);
        this.actions.parseAgencyModel(data);

        this.subscription = <Subscription>this.stateManager
          .getModel('AgencyModel')
          .filter(model => model !== null)
          .take(1)
          .do(model => {
            this.actions.parseModelDashboard(model);
            this.actions.createAgencyFilterModel(model);
            this.actions.createPropertyFilterModel(model);
          })
          .switchMap(() => this.stateManager.getModel('AgencyModel'))
          .subscribe(model => {
            this.vertical = this.actions.aggregateVerticals(model);
            this.properties = this.actions.aggregateProperties(model);
            this.agencies = this.actions.aggregateAgencies(model);
            this.registration_dollars = numeral((<TotalRow>model[0]).registration).format('0.0 a').toUpperCase();
            this.spend_dollars = numeral((<TotalRow>model[0]).spend).format('0.0 a').toUpperCase();
            this.variance_dollars = numeral((<TotalRow>model[0]).spend - (<TotalRow>model[0]).registration).format('0.0 a').toUpperCase();
            this.actions.syncDashboardModel(model);
          });

        this.stateManager
          .getModel('AgencyModel')
          .filter(model => model !== null)
          .take(1)
          .subscribe(() => {
            this.subscription = Observable
              .combineLatest(
              this.stateManager.getModel('AgencyFilterModel'),
              this.stateManager.getModel('PropertyFilterModel'),
              (agencies: OptionModel[], properties: OptionModel[]) => {
                return [].concat(
                  agencies.filter(row => row.selected),
                  properties.filter(row => row.selected),
                );
              }
              )
              .subscribe(filterOptions => {
                this.actions.filterAgencyModel(filterOptions);
                this.actions.recalculateEntireModel();
              });
          });

      });


    this.dashboardModel = this.stateManager
      .getModel('DashboardAgencyModel')
      .filter(model => model !== null)
      .map(data => data);

    this.subscription = <Subscription>this.stateManager
      .getModel('AgencyFilterModel')
      .filter(model => model !== null)
      .subscribe((model) => {
        this.agencyFilter = model;
      });

    this.subscription = <Subscription>this.stateManager
      .getModel('PropertyFilterModel')
      .filter(model => model !== null)
      .subscribe((model) => {
        this.propertyFilter = model;
      });

  }


  /**
   * Cleanup all the subscriptions
   *
   *
   * @memberOf DashboardComponent
   */
  public ngOnDestroy() {
    this.subscriptions
      .forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      });
  }


  /**
   * Apply the Agency Filter
   *
   * @param {SelectItem} selected
   *
   * @memberOf EditorAgencyComponent
   */
  public applyAgencyFilter(selected: SelectItem) {
    this.actions.updateMultiSelectModel(
      'AgencyFilterModel',
      (<Array<number>>selected.ids).map(id => parseInt(id.toString(), 10))
    );
  }


  /**
   * Apply the Property Filter
   *
   * @param {SelectItem} selected
   *
   * @memberOf EditorAgencyComponent
   */
  public applyPropertyFilter(selected: SelectItem) {
    this.actions.updateMultiSelectModel(
      'PropertyFilterModel',
      (<Array<number>>selected.ids).map(id => parseInt(id.toString(), 10))
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
