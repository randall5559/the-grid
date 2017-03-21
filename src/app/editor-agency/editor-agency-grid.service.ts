import { Modal } from './../interfaces/modal.interface';
import { Injectable } from '@angular/core';
import { ComponentRef } from '@angular/core';
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

@Injectable()
export class EditorAgencyGridService extends AbstractGridProvider {


  /**
   * Create the rows
   *
   * @param {Array<Row>} rowsModel
   * @param {any} createRowInstance
   * @param {any} childComponents
   *
   * @memberOf EditorAgencyGridService
   */
  public createRows(rowsModel: Array<Row>, createRowInstance, childComponents) {
    rowsModel
      .forEach((row: Row) => {
        if (row.type === RowTypes.Total) {
          let rowComponentRef = createRowInstance(TotalRowComponent);
          childComponents.push(rowComponentRef);
        } else
          if (row.type === RowTypes.Agency) {
            let rowComponentRef = createRowInstance(AgencyRowComponent);
            childComponents.push(rowComponentRef);
          } else
            if (row.type === RowTypes.Property) {
              let rowComponentRef = createRowInstance(PropertyRowComponent);
              childComponents.push(rowComponentRef);
            } else
              if (row.type === RowTypes.Advertiser) {
                let rowComponentRef = createRowInstance(AdvertiserRowComponent);
                childComponents.push(rowComponentRef);
              }
      });
  }


  /**
   * Create the title Row
   *
   * @template T
   * @param {(row: any) => ComponentRef<any>} createRowInstance
   * @returns {ComponentRef<any>}
   *
   * @memberOf EditorAgencyGridService
   */
  public createTitleRow(createRowInstance: (row: any) => ComponentRef<any>) {
    return createRowInstance(TitleRowComponent).instance;
  }

}
