import { Injectable } from '@angular/core';
import { ComponentRef } from '@angular/core';
import { AbstractGridProvider } from '../../shared/components/grid/grid';
import {
  SideGridAgencyRowComponent,
  SideGridAdvertiserRowComponent,
  SideGridTotalRowComponent
} from './rows/rows';
import { Row } from '../../interfaces';
import { RowTypes } from '../../enums/enums';

/**
 *
 *
 * @export
 * @class SideGridService
 * @implements {GridProvider}
 */
@Injectable()
export class SideGridService extends AbstractGridProvider {


  /**
   * Create the rows
   *
   * @param {any} rowsModel
   * @param {any} createRowInstance
   * @param {any} childComponents
   *
   * @memberOf SideGridService
   */
  public createRows(rowsModel, createRowInstance, childComponents) {
    rowsModel
      .forEach((row: Row) => {
        if (row.type === RowTypes.Total) {
          childComponents.push(createRowInstance(SideGridTotalRowComponent));
        }
        if (row.type === RowTypes.Agency) {
          childComponents.push(createRowInstance(SideGridAgencyRowComponent));
        }
        if (row.type === RowTypes.Advertiser) {
          childComponents.push(createRowInstance(SideGridAdvertiserRowComponent));
        }
      });
  }


  /**
   * Create title row
   *
   * @template T
   * @param {(row: any) => ComponentRef<any>} createRowInstance
   * @returns {T}
   *
   * @memberOf SideGridService
   */
  public createTitleRow(createRowInstance: (row: any) => ComponentRef<any>) {
    return null;
  }

}
