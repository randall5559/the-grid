/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SideGridTotalRowComponent } from './side-grid-total-row.component';

xdescribe('SideGridTotalRowComponent', () => {
  let component: SideGridTotalRowComponent;
  let fixture: ComponentFixture<SideGridTotalRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideGridTotalRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideGridTotalRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
