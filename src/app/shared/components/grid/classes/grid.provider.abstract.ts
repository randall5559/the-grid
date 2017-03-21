import { ComponentRef } from '@angular/core';
import { AbstractRowComponent } from './grid-row.abstract';

/**
 * NOTE: This is being used as an interface almost everywhere except when
 * used in the provider declaration. Otherwise TypeScript treats Classes as Types
 */
export abstract class AbstractGridProvider {


  /**
   * Create the rows for the grid instance
   *
   * @abstract
   * @template AbstractRowComponent
   * @param {Array<any>} rowsModel
   * @param {(row: AbstractRowComponent) => ComponentRef<AbstractRowComponent>} createRowInstance
   * @param {Array<AbstractRowComponent>} childComponents
   *
   * @memberOf AbstractGridProvider
   */
  abstract createRows<T>(
    rowsModel: Array<any>,
    createRowInstance: (row: T) => ComponentRef<T>,
    childComponents: Array<T>
  ): void;


  /**
   * Create the title row for the grid instance
   *
   * @abstract
   * @template AbstractRowComponent
   * @param {(row: AbstractRowComponent) => ComponentRef<AbstractRowComponent>} createRowInstance
   * @returns {ComponentRef<any>}
   *
   * @memberOf AbstractGridProvider
   */
  abstract createTitleRow<T>(
    createRowInstance: (row: AbstractRowComponent) => ComponentRef<T>
  ): ComponentRef<any>;

}
