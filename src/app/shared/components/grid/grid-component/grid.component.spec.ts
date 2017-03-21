/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  Component,
  DebugElement,
  OnInit,
  Injectable,
  ComponentRef,
  ChangeDetectorRef,
  ViewChild,
  ComponentFactoryResolver } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { GridComponent } from './grid.component';
import { AbstractGridProvider, AbstractRowComponent } from '../grid';

@Component({
  selector: 'ag-title',
  template: '<div></div>',
})
export class FakeTitleRowComponent extends AbstractRowComponent {

  constructor(
    protected cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  onRowInit() { }
}

let fakeSpyRows = jasmine.createSpy('test fake rows');
let fakeSpyTitleRow = jasmine.createSpy('test fake title row');

Injectable();
class MockAbstractGridProvider extends AbstractGridProvider {
  public createRows(rowsModel: Array<any>, createRowInstance, childComponents) {
    fakeSpyRows();
    let rowComponentRef = createRowInstance(FakeTitleRowComponent);
    childComponents.push(rowComponentRef);
  }

  public createTitleRow(createRowInstance: (row: any) => ComponentRef<any>) {
    fakeSpyTitleRow();
    return createRowInstance(FakeTitleRowComponent).instance;
  }
}

@Component({
  selector: 'ag-fake-component',
  template: `<ag-grid [observable]="agencyData"></ag-grid>`,
  providers: [
    { provide: AbstractGridProvider, useClass: MockAbstractGridProvider }
  ],
  entryComponents: [FakeTitleRowComponent]
})
class FakeComponent {
  public agencyData: BehaviorSubject<any>;

  constructor() {
    this.agencyData = new BehaviorSubject([{
        advertiser: [],
        agency_name: 'fake agency',
        agency_spend: 0,
        collapsed: false,
        id: 1
    }]);
  }
}

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<FakeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ GridComponent, FakeComponent, FakeTitleRowComponent ],
      providers: [MockAbstractGridProvider]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('LifeCycle Hooks - [ ngOnInit(), ngOnDestroy() ]', () => {
    it('OnInit', () => {
      expect(component.childComponents.length).toEqual(1);
      expect(fakeSpyRows).toHaveBeenCalled();
      expect(fakeSpyTitleRow).toHaveBeenCalled();
    });

    it('OnDestroy', () => {
      let subscriptions = <BehaviorSubject<any>>component.observable;
      expect(subscriptions.observers.length).toEqual(1);

      component.ngOnDestroy();

      expect(subscriptions.observers.length).toEqual(0);
    });
  });
});
