/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from '../../../shared/components/input/input.module';

import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { AdvertiserRowComponent } from './advertiser-row.component';
import { ActionsService } from '../../../services';
import { AbstractRowComponent } from '../../../shared/components/grid/grid';
import { InputUpdate } from '../../../shared/components/input/input-update.interface';
import { AggregationalColumns } from '../../../enums/enums';
import { AddParenthesisToNegative } from '../../../shared/pipes/add-parenthesis-to-negative.pipe';
import { ModalService } from './../../../shared/components/modal/modal.service';


describe('AdvertiserRowComponent', () => {
  let component: AdvertiserRowComponent;
  let fixture: ComponentFixture<AdvertiserRowComponent>;
  let actions: ActionsService;

  class MockActionsService {
    public updateAdvertiserValue(id: number, attribute: AggregationalColumns, value: number) { }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        InputModule
      ],
      declarations: [
        AdvertiserRowComponent,
        AddParenthesisToNegative
      ],
      providers: [
        { provide: ActionsService, useClass: MockActionsService },
        ModalService,
        ChangeDetectorRef
      ]
    })
      .compileComponents();
  }));

  beforeEach(inject([ActionsService], (_ActionsService_) => {
    actions = _ActionsService_;
    fixture = TestBed.createComponent(AdvertiserRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(actions, 'updateAdvertiserValue').and.callThrough();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initial this row\'s OnInit - onRowInit()', () => {
    component.row = Object.assign({}, { isDirty: true});
    component.updates$.next({
      id: 1,
      value: 1.00,
      attr: 'string'
    });

    expect(actions.updateAdvertiserValue).toHaveBeenCalledWith(1, 3, 1);
  });
});
