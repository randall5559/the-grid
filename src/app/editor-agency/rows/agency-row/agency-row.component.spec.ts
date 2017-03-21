/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActionsService } from '../../../services';
import { AgencyRowComponent } from './agency-row.component';
import { AddParenthesisToNegative } from '../../../shared/pipes/add-parenthesis-to-negative.pipe';

describe('AgencyRowComponent', () => {
  let component: AgencyRowComponent;
  let fixture: ComponentFixture<AgencyRowComponent>;
  let actions: ActionsService;

  class MockActionsService {
    toggleAgency(id) {
      return id;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AgencyRowComponent,
        AddParenthesisToNegative
      ],
      providers: [{ provide: ActionsService, useClass: MockActionsService }]
    })
      .compileComponents();
  }));

  beforeEach(inject([ActionsService], (_ActionsService_) => {
    actions = _ActionsService_;

    fixture = TestBed.createComponent(AgencyRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(actions, 'toggleAgency');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle collaspe - collapse()', () => {
    component.collapse(1);
    expect(actions.toggleAgency).toHaveBeenCalledWith(1);
  });
});
