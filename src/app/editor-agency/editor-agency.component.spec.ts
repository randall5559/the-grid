/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import {
  DataService,
  ActionsService,
  StateManagerService
} from '../services';
import {
  Agency,
  Property,
  Advertiser,
  OptionModel,
  SelectItem,
  Row,
  BaseEntity,
  SaveSpendData
} from '../interfaces';
import { RowTypes } from '../enums/enums';
import {
  TotalRowComponent,
  AdvertiserRowComponent,
  AgencyRowComponent,
  PropertyRowComponent,
  TitleRowComponent
} from './rows/rows';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from '../shared/components/multi-select/multi-select.module';
import { InputModule } from '../shared/components/input/input.module';
import { GridModule } from '../shared/components/grid/grid.module';
import { ModalModule } from './../shared/components/modal/modal.module';
import { EditorAgencyComponent } from './editor-agency.component';
import { AddParenthesisToNegative } from '../shared/pipes/add-parenthesis-to-negative.pipe';
import { PeacockService } from './../shared/components/peacock/peacock.service';
import { MessageService } from './../shared/components/messaging/message.service';
import { ModalService } from './../shared/components/modal/modal.service';
import { ExportComponent } from './modals/export/export.component';
import { ExportTitleComponent } from './modals/export/export-title/export-title.component';
import { CommentsComponent } from './modals/comments/comments.component';
import { CommentsTitleComponent } from './modals/comments/comments-title.component';
import { SendNBCUComponent } from './modals/send-nbcu/send-nbcu.component';
import { SendNBCUTitleComponent } from './modals/send-nbcu/send-nbcu-title/send-nbcu-title.component';

interface Include<T> {
  includes(str: string): Boolean;
}

interface UserProfile {
  entitlements: Include<any>;
}

describe('EditorAgencyComponent', () => {

  // create a mock includes() for PhantomJS as Array.includes() is not supported [line: 114]
  class ArrayIncludes implements Include<any> {
    constructor(str: string) {}

    public includes(str?: string): Boolean {
      return false;
    }
  }

  let component: EditorAgencyComponent;
  let fixture: ComponentFixture<EditorAgencyComponent>;
  let updateMethod: Function;
  let dataService: DataService;
  let actions: ActionsService;
  let peacock: PeacockService;
  let message: MessageService;
  let modal: ModalService;
  let stateManager: StateManagerService;
  let modalDirty: boolean;
  let fakeOptionModelData: OptionModel[] = [{
    type: 1,
    name: 'fake name',
    key: 'fake key',
    value: 1,
    selected: true,
    id: 1,
    evaluationStrategy: 1
  }];
  let fakeSelectedItem: SelectItem = {
    selectName: 'fake name',
    ids: [1, 2, 3],
    type: 'fake type'
  };
  let fakeDirtyModelData: Array<any> = [{
    id: null,
    agency_id: null,
    agency_spend: 1234,
    isDirty: true,
    deal_id: 111
  }];
  let fakeAgencyModel: Agency[] = [{
    deal_id: 111,
    advertisers: [1, 2, 3],
    agency_name: 'fake agency',
    properties: [1, 2, 3],
    type: RowTypes.Agency,
    projection: 1,
    registration: 2,
    spend: 3,
    agency_spend: 4,
    variance: 5,
    collapsed: true,
    id: 6,
    isFiltered: true,
    showChildren: null,
    isDirty: true
  }];
  let fakeUserProfile: UserProfile = {
    // create a mock includes() for PhantomJS as Array.includes() is not supported [line: 56]
    entitlements: new ArrayIncludes('fake_entitlement')
  };
  let fakeParentAgencyInfo: any = {
    parent_agency_id: 'fake agency id',
    parent_agency_name: 'fake agency name'
  };
  let actionsRecalculateEntireModel = jasmine.createSpy('recalculateEntireModel');
  let actionsFilterAgencyModel = jasmine.createSpy('recalculateEntireModel');


  class MockDataService {
    public getAgencyData(): Observable<any> {
      return Observable.of();
    }

    public saveAgencyData(data): Observable<any> {
      return Observable.of(data);
    }

    public saveExcelFile() {
      return Observable.of();
    }

    public notifyNBCU() {
      return Observable.of({status: 200});
    }
  }


  class MockActionsService {
    public parseAgencyModel(rawModel: Array<any>) { }

    public createAgencyFilterModel(AgencyModel: Agency[]) { }

    public createPropertyFilterModel(AgencyModel: Property[]) { }

    public createAdvertiserFilterModel(AgencyModel: Advertiser[]) { }

    public createDemoFilterModel(AgencyModel: Advertiser[]) { }

    public createSpendVarianceFilterModel() { }

    public filterAgencyModel(filters: OptionModel[], modelName = 'AgencyModel') {
      actionsRecalculateEntireModel();
    }

    public recalculateEntireModel() {
      actionsFilterAgencyModel();
     }

    public updateMultiSelectModel(
      modelName: 'AgencyFilterModel' | 'PropertyFilterModel' | 'AdvertiserFilterModel' | 'DemoFilterModel',
      ids: number[]
    ) { }

    public getDirtyAgencyFields() {
      let dataOrNot = (modalDirty) ? [{deal_id: 111, spend_dollars: 4}] : [];
      return Observable.of(<SaveSpendData[]>dataOrNot);
    }

    public resetDirtyAgencyFields() { }
  }

  interface ModelObject {
    name: string;
    obs: BehaviorSubject<any>;
  }

  class MockStateManagerService {
    private models: ModelObject[];

    constructor() {
      this.models = new Array();
    }

    getModel(model: string) {
      let getM = (name) => {
        let obs: BehaviorSubject<any>;
        this.models.forEach(m => {
          if (m.name === name) {
            obs = m.obs;
          }
        });

        return obs;
      };
      let setM = (obj) => {
        this.models.push({
          name: model,
          obs: new BehaviorSubject(obj)
        });
      };
      let hasModel = this.models.filter(m => m.name === model);

      if (hasModel.length > 0) {
        return getM(model);
      } else {
        if (model === 'UserProfile') {
          setM(fakeUserProfile);
        } else if (model === 'AgencyModel') {
          setM(fakeAgencyModel);
        } else if ( model === 'ParentAgencyInfo') {
          setM(fakeParentAgencyInfo);
        } else {
          setM(fakeOptionModelData);
        }
      }

      return getM(model);
    }

    update(model: string) {
      return (_method) => {
        let _result = _method();
        // this.model.next(_result);
      };
    }
  }

  function MockFileSaver() {

  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        InputModule,
        GridModule.withComponents([
          TotalRowComponent,
          AgencyRowComponent,
          PropertyRowComponent,
          AdvertiserRowComponent,
          TitleRowComponent
        ]),
        ModalModule.withComponents([
          ExportComponent,
          ExportTitleComponent,
          CommentsComponent,
          CommentsTitleComponent,
          SendNBCUComponent,
          SendNBCUTitleComponent
        ])
      ],
      declarations: [
        EditorAgencyComponent,
        TotalRowComponent,
        AgencyRowComponent,
        PropertyRowComponent,
        AdvertiserRowComponent,
        TitleRowComponent,
        ExportComponent,
        ExportTitleComponent,
        CommentsComponent,
        CommentsTitleComponent,
        SendNBCUComponent,
        SendNBCUTitleComponent,
        AddParenthesisToNegative
      ],
      providers: [
        {
          provide: ActionsService,
          useClass: MockActionsService
        },
        {
          provide: StateManagerService,
          useClass: MockStateManagerService
        },
        {
          provide: DataService,
          useClass: MockDataService
        },
        PeacockService,
        MessageService,
        ModalService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(inject(
    [DataService, ActionsService, StateManagerService, PeacockService, MessageService, ModalService],
    (_DataService_, _ActionsService_, _StateManagerService_, _PeacockService_, _MessageService_, _ModalService_) => {
      dataService = _DataService_;
      actions = _ActionsService_;
      stateManager = _StateManagerService_;
      peacock = _PeacockService_;
      message = _MessageService_;
      modal = _ModalService_;

      fixture = TestBed.createComponent(EditorAgencyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      spyOn(dataService, 'getAgencyData').and.callThrough();
      spyOn(dataService, 'saveExcelFile').and.callThrough();
      spyOn(dataService, 'notifyNBCU').and.callThrough();
      spyOn(actions, 'updateMultiSelectModel').and.callThrough();
      spyOn(actions, 'getDirtyAgencyFields').and.callThrough();
      spyOn(actions, 'resetDirtyAgencyFields').and.callThrough();
      spyOn(peacock, 'hide').and.callThrough();
      spyOn(peacock, 'show').and.callThrough();
      spyOn(message, 'showSuccess').and.callThrough();
      spyOn(modal, 'show').and.callThrough();
      spyOn(modal, 'setContent').and.callThrough();
      spyOn(modal, 'setTitle').and.callThrough();

      fixture = TestBed.createComponent(EditorAgencyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

    }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Lifecycle Methods', () => {
    it('should retrieve data model for the grid component - OnInit()', () => {

      expect(actionsFilterAgencyModel).toHaveBeenCalled();
      expect(actionsRecalculateEntireModel).toHaveBeenCalled();

      component.agencyData.subscribe(data => {
        expect(data).toEqual(fakeAgencyModel);
      });
    });

    it('should cleanup subscriptions - OnDestroy()', () => {
      component.ngOnDestroy();

      [
        { name: 'AgencyModel', key: 'agencyData' },
        { name: 'PropertyFilterModel', key: 'propertyFilter' },
        { name: 'AgencyFilterModel', key: 'agencyFilter' },
        { name: 'AdvertiserFilterModel', key: 'advertiserFilter' },
        { name: 'DemoFilterModel', key: 'demoFilter' }
      ].forEach(model => {
        component[model.key] = null;
        stateManager.update(model.name)(() => fakeOptionModelData);
        expect(component[model.key]).toBeNull();
      });
    });
  });

  describe('Custom Filter Methods', () => {
    it('should apply agency filter - applyAgencyFilter()', () => {
      component.applyAgencyFilter(fakeSelectedItem);
      expect(actions.updateMultiSelectModel).toHaveBeenCalledWith('AgencyFilterModel', fakeSelectedItem.ids);
    });

    it('should apply property filter - applyPropertyFilter()', () => {
      component.applyPropertyFilter(fakeSelectedItem);
      expect(actions.updateMultiSelectModel).toHaveBeenCalledWith('PropertyFilterModel', fakeSelectedItem.ids);
    });

    it('should apply agency filter - applyAdvertiserFilter()', () => {
      component.applyAdvertiserFilter(fakeSelectedItem);
      expect(actions.updateMultiSelectModel).toHaveBeenCalledWith('AdvertiserFilterModel', fakeSelectedItem.ids);
    });

    it('should apply agency filter - applyDemoFilter()', () => {
      component.applyDemoFilter(fakeSelectedItem);
      expect(actions.updateMultiSelectModel).toHaveBeenCalledWith('DemoFilterModel', fakeSelectedItem.ids);
    });
  });

  describe('Custom Data Methods', () => {
    it('should save spend dirty data - saveSpendData()', () => {
      component.saveSpendData();

      expect(peacock.hide).toHaveBeenCalled();
      expect(message.showSuccess).toHaveBeenCalledWith('Your registration information has been successfully saved!', 5000);
    });

    describe('exportSpendData()', () => {
      it('should export data with modal show - exportSpendData()', () => {
        modalDirty = true;
        component.exportSpendData();

        expect(actions.getDirtyAgencyFields).toHaveBeenCalled();
        expect(modal.show).toHaveBeenCalled();
      });

      it('should export data with excel download - exportSpendData()', () => {
        modalDirty = false;
        component.exportSpendData();

        expect(dataService.saveExcelFile).toHaveBeenCalled();
      });
    });


    it('should send data to nbcu - sendToNBCU()', () => {
      component.sendToNBCU();

      expect(modal.show).toHaveBeenCalled();
      expect(modal.setContent).toHaveBeenCalled();
      expect(modal.setTitle).toHaveBeenCalled();
    });

  });

});
