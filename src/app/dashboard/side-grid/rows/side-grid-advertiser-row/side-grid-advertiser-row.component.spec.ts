/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SideGridAdvertiserRowComponent } from './side-grid-advertiser-row.component';

xdescribe('SideGridAdvertiserRowComponent', () => {
  let component: SideGridAdvertiserRowComponent;
  let fixture: ComponentFixture<SideGridAdvertiserRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideGridAdvertiserRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideGridAdvertiserRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
