/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TotalRowComponent } from './total-row.component';
import { AddParenthesisToNegative } from './../../../shared/pipes/add-parenthesis-to-negative.pipe';

xdescribe('TotalRowComponent', () => {
  let component: TotalRowComponent;
  let fixture: ComponentFixture<TotalRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TotalRowComponent,
        AddParenthesisToNegative
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
