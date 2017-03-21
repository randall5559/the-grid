import { Row } from './row.interface';
import { BaseEntity } from './base-entity.interface';
import { RowTypes } from '../enums/enums';

export interface TotalRow extends Row, BaseEntity {
  advertisers: Array<number>;
  agencies: Array<number>;
  collapsed: false;
  isFiltered: false;
  properties: Array<number>;
  showChildren: true;
  type: RowTypes.Total;
}
