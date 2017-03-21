/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendNBCUComponent } from './send-nbcu.component';

xdescribe('SendNBCUComponent', () => {
  let component: SendNBCUComponent;
  let fixture: ComponentFixture<SendNBCUComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendNBCUComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendNBCUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
