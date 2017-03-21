/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output } from '@angular/core';

import { MultiSelectComponent } from './multi-select.component';


@Component({
  selector: 'ag-parent-selector',
  template: `<ag-multi-select name="Test" [optionsList]="options" (onSelect)="onSelect($event)"></ag-multi-select>`
})
class MockParentComponent {
  options: any;

  onSelect(items: any) {
    // console.log(items);
  }
}

xdescribe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  let fakeComponent: MockParentComponent;
  let fakeFixture: ComponentFixture<MockParentComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockParentComponent, MultiSelectComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fakeFixture = TestBed.createComponent(MockParentComponent);
    fakeComponent = fakeFixture.componentInstance;
    fakeFixture.detectChanges();

    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component, 'onSelect').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fakeComponent).toBeTruthy();
  });
});
