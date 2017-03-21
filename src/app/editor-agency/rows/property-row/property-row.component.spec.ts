/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActionsService } from '../../../services';
import { PropertyRowComponent } from './property-row.component';
import { AddParenthesisToNegative } from '../../../shared/pipes/add-parenthesis-to-negative.pipe';

describe('PropertyRowComponent', () => {
  let component: PropertyRowComponent;
  let fixture: ComponentFixture<PropertyRowComponent>;
  let actions: ActionsService;

  class MockActionsService {
    toggleProperty(id) {
      return id;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PropertyRowComponent,
        AddParenthesisToNegative
      ],
      providers: [{ provide: ActionsService, useClass: MockActionsService }]
    })
      .compileComponents();
  }));

  beforeEach(inject([ActionsService], (_ActionsService_) => {
    actions = _ActionsService_;

    fixture = TestBed.createComponent(PropertyRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(actions, 'toggleProperty');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle collaspe - collapse()', () => {
    component.collapse(1);
    expect(actions.toggleProperty).toHaveBeenCalledWith(1);
  });
});
