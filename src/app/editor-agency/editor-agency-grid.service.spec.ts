/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { EditorAgencyGridService } from './editor-agency-grid.service';
import { ComponentRef, ChangeDetectorRef } from '@angular/core';
import { AbstractGridProvider } from '../shared/components/grid/grid';
import {
  TotalRowComponent,
  AdvertiserRowComponent,
  AgencyRowComponent,
  PropertyRowComponent,
  TitleRowComponent
} from './rows/rows';
import { Row } from '../interfaces';
import { RowTypes } from '../enums/enums';

describe('EditorAgencyGridService', () => {
  let service: EditorAgencyGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditorAgencyGridService]
    });
  });

  it('should be a service truthy', inject([EditorAgencyGridService], (_service_: EditorAgencyGridService) => {
    service = _service_;
    expect(service).toBeTruthy();
  }));

  describe('Service Public Methods', () => {
    it('should create the rows for grid - createRows()', () => {
      let fakeChildComponent = [];
      let fakeGrid = [RowTypes.Total, RowTypes.Agency, RowTypes.Property, RowTypes.Advertiser].map(type => {
        return {
          collapsed: true,
          id: 1,
          isFiltered: false,
          showChildren: null,
          type: type
        };
      });

      let createRowInstance = (ref: ComponentRef<any>) => ref;

      service.createRows(fakeGrid, createRowInstance, fakeChildComponent);

      expect(fakeChildComponent.length).toEqual(4);
    });

    it('should create the title row - createTitleRow()', () => {
      let createRowInstance = (row: any) => <ComponentRef<any>>row;

      let fakeComponentRef = service.createTitleRow(createRowInstance);
      expect(fakeComponentRef).toBeUndefined();
    });
  });

});
