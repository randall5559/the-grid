import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  Observable,
  Subscription,
  Subject,
} from 'rxjs';
import * as svcs from '../services';
import {
  SelectItem,
  OptionModel,
  TotalRow,
  User,
  Advertiser,
  SaveSpendData
} from '../interfaces';
import { AbstractGridProvider } from '../shared/components/grid/grid';
import { EditorAgencyGridService } from './editor-agency-grid.service';
import { ExportComponent } from './modals/export/export.component';
import { ExportTitleComponent } from './modals/export/export-title/export-title.component';
import { SendNBCUComponent } from './modals/send-nbcu/send-nbcu.component';
import { SendNBCUTitleComponent } from './modals/send-nbcu/send-nbcu-title/send-nbcu-title.component';

import { PeacockService } from './../shared/components/peacock/peacock.service';
import { ModalService } from './../shared/components/modal/modal.service';
import { MessageService } from './../shared/components/messaging/message.service';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'ag-editor-agency',
  templateUrl: './editor-agency.component.html',
  styleUrls: ['./editor-agency.component.scss'],
  providers: [
    { provide: AbstractGridProvider, useClass: EditorAgencyGridService }
  ]
})

export class EditorAgencyComponent implements OnInit, OnDestroy {

  /** Public members */
  public agencyData;
  public agencyFilter;
  public propertyFilter;
  public advertiserFilter;
  public demoFilter;
  public currentUser;
  public canViewAndEdit: boolean;
  public canNotifyNBCU: boolean;
  public parentAgencyName: string;
  public parentAgencyId: number;
  public varianceFilterValue$: Subject<any> = new Subject<any>();

  /** Private members */
  private subscriptions: Array<Subscription> = [];


  /**
   * Creates an instance of EditorAgencyComponent.
   *
   * @param {DataService} dataService
   * @param {ActionsService} actions
   * @param {StateManagerService} stateManager
   *
   * @memberOf EditorAgencyComponent
   */
  constructor(
    private dataService: svcs.DataService,
    private actions: svcs.ActionsService,
    private stateManager: svcs.StateManagerService,
    private peacock: PeacockService,
    private message: MessageService,
    private modalService: ModalService
  ) { }




  /******************************************************************
   *
   * Public Methods
   *
   ******************************************************************/


  /**
   * LifeCycle Hook: OnInit
   *
   *
   * @memberOf EditorAgencyComponent
   */
  public ngOnInit() {
    //this.setEntitlements();
    this.subscribeParentAgencyInfo();
    this.setAgencyData();
    this.getTheModelAndParse();
    this.subscribeToFilterModels();
    this.subscribeToAllFilterModelChanges();
    this.subscribeToVarianceFilterField();
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
   * Apply the Property Filter
   *
   * @param {SelectItem} selected
   *
   * @memberOf EditorAgencyComponent
   */
  public applyAdvertiserFilter(selected: SelectItem) {
    this.actions.updateMultiSelectModel(
      'AdvertiserFilterModel',
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
  public applyDemoFilter(selected: SelectItem) {
    this.actions.updateMultiSelectModel(
      'DemoFilterModel',
      (<Array<number>>selected.ids).map(id => parseInt(id.toString(), 10))
    );
  }


  /**
   * Save Spend Agency Data
   *
   *
   * @memberOf EditorAgencyComponent
   */
  public saveSpendData() {
    this.peacock.show();
    this.agencyData = this.stateManager
      .getModel('AgencyModel')
      .filter(model => model !== null)
      .switchMap(data => {
        return new Observable(observer => {
          observer.next(
            data
              .filter(obj => obj.hasOwnProperty('isDirty') && obj.isDirty === true)
              .map(obj => ({
                deal_id: obj.deal_id,
                spend_dollars: obj.agency_spend
              }))
          );
        });
      })
      .take(1)
      .subscribe((data: SaveSpendData[]) => {
        if (data.length > 0) {
          this.dataService.saveAgencyData({ agency_deals: data })
            .subscribe(res => {
              this.peacock.hide();
              this.message.showSuccess('Your registration information has been successfully saved!', 5000);
              this.actions.resetDirtyAgencyFields();
            });
        } else {
          this.peacock.hide();
          this.message.showError('Nothing to save.', 5000);
        }
      });
  }


  /**
   * Export Spend Agency Data
   *
   *
   * @memberOf EditorAgencyComponent
   */
  public exportSpendData() {
    this.actions.getDirtyAgencyFields()
      .subscribe((data: SaveSpendData[]) => {
        if (data.length > 0) {
          this.modalService.setTitle(ExportTitleComponent);
          this.modalService.setContent(ExportComponent);
          this.modalService.show();
        } else {
          this.dataService.saveExcelFile()
            .subscribe(dataBlob => {
              let blob = new Blob([(<any>dataBlob)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let date = (new Date()).toISOString().split('T')[0];
              FileSaver.saveAs(blob, `nbcu-agency-gateway-${date}.xls`);
            });
        }
      });
  }


  /**
   *
   *
   *
   * @memberOf EditorAgencyComponent
   */
  public sendToNBCU() {
    this.modalService.setTitle(SendNBCUTitleComponent);
    this.modalService.setContent(SendNBCUComponent);
    this.modalService.show();
  }


  /**
   * LifeCycle Hook: On Destory
   *
   *
   * @memberOf EditorAgencyComponent
   */
  public ngOnDestroy() {
    this.subscriptions
      .forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      });
  }



  /******************************************************************
   *
   * Private Methods
   *
   ******************************************************************/


  /**
   * Retrieves the Parent Agency meta data
   *
   * @private
   *
   * @memberOf EditorAgencyComponent
   */
  private subscribeParentAgencyInfo() {
    this
      .stateManager
      .getModel('ParentAgencyInfo')
      .subscribe((data) => {
        this.parentAgencyName = data['parent_agency_name'];
        this.parentAgencyId = data['parent_agency_id'];
      });
  }


  /**
   * Sets the currentUser data and entitlements
   *
   *  @private
   */
  private setEntitlements() {
    this
      .stateManager
      .getModel('UserProfile')
      .take(1)
      .subscribe((data) => {
        this.currentUser = data;
        this.canViewAndEdit = data['entitlements']
          .includes('agency_gateway_view_and_edit_agency_view');
        this.canNotifyNBCU = data['entitlements']
          .includes('agency_gateway_submit_changes_to_nbcu');
      });
  }


  /**
   * Sets the model for the grid component
   *
   *  @private
   */
  private setAgencyData() {
    this.agencyData = this.stateManager
      .getModel('AgencyModel')
      .filter(model => model !== null)
      .map(data => {
        // Adding a check on no records to display messaging
        let no_records = data.filter(el => el.isFiltered).length === 0;
        if (no_records) {
          this.message.showError(`No results found. Please contact your Gateway administrator at Gateway.Support@nbcuni.com
          if you think this is a mistake.`,
          5000);
        } else {
          this.message.hideMessage();
        }
        return data;
      });
  }


  /**
   * Set up the subscriptions to the
   *
   * @private
   *
   * @memberOf EditorAgencyComponent
   */
  private subscribeToFilterModels() {

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

    this.subscription = <Subscription>this.stateManager
      .getModel('AdvertiserFilterModel')
      .filter(model => model !== null)
      .subscribe((model) => {
        this.advertiserFilter = model;
      });

    this.subscription = <Subscription>this.stateManager
      .getModel('DemoFilterModel')
      .filter(model => model !== null)
      .subscribe((model) => {
        this.demoFilter = model;
      });

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


  /**
   * Subscriptions for the variance filter field
   *
   * @private
   *
   * @memberOf EditorAgencyComponent
   */
  private subscribeToVarianceFilterField() {
    // subscribe to the Greater Than Value input keyup event
    this.subscription = this.varianceFilterValue$
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(value => {
        value = value ? Math.round(parseFloat(value.replace(/[^\d.-]/g, ''))) : null;
        return this.actions.updateVarianceFilter(0, value);
      });

  }


  /**
   * subscribe to the filter models changing and call the actions when they do
   *
   * @private
   *
   * @memberOf EditorAgencyComponent
   */
  private subscribeToAllFilterModelChanges() {
    this.subscription = <Subscription>this.stateManager
      .getModel('AgencyModel')
      .filter(model => model !== null)
      .take(1)
      .switchMap(model => {
        return Observable
          .combineLatest(
          this.stateManager.getModel('AgencyFilterModel'),
          this.stateManager.getModel('PropertyFilterModel'),
          this.stateManager.getModel('AdvertiserFilterModel'),
          this.stateManager.getModel('DemoFilterModel'),
          this.stateManager.getModel('SpendVarianceFilterModel'),
          (
            agencies: OptionModel[],
            properties: OptionModel[],
            advertiser: OptionModel[],
            demo: OptionModel[],
            spendVariance: OptionModel[]
          ) => {
            return [].concat(
              agencies.filter(row => row.selected),
              properties.filter(row => row.selected),
              advertiser.filter(row => row.selected),
              demo.filter(row => row.selected),
              spendVariance.filter(row => row.selected)
            );
          }
          );
      })
      .subscribe(filterOptions => {
        this.actions.filterAgencyModel(filterOptions);
        this.actions.recalculateEntireModel();
      });
  }


  /**
   * Get the model from the data service and then call the parsing mechanisims
   *
   * @private
   *
   * @memberOf EditorAgencyComponent
   */
  private getTheModelAndParse() {
    this.dataService.getAgencyData()
      .subscribe((data: any) => {
        this.actions.setParentAgencyInfo(data[0]);
        this.actions.parseAgencyModel(data);
        this.stateManager
          .getModel('AgencyModel')
          .filter(model => model !== null)
          .take(1)
          .subscribe((model) => {
            this.actions.createAgencyFilterModel(model);
            this.actions.createPropertyFilterModel(model);
            this.actions.createAdvertiserFilterModel(model);
            this.actions.createDemoFilterModel(model);
            this.actions.createSpendVarianceFilterModel();
          });
      });
  }
}
