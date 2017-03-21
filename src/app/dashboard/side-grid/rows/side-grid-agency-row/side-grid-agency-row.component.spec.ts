/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SideGridAgencyRowComponent } from './side-grid-agency-row.component';

xdescribe('SideGridAgencyRowComponent', () => {
  let component: SideGridAgencyRowComponent;
  let fixture: ComponentFixture<SideGridAgencyRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideGridAgencyRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideGridAgencyRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
