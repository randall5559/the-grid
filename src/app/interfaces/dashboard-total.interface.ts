import { Row } from './row.interface';
import { BaseEntity } from './base-entity.interface';
import { RowTypes } from '../enums/enums';

export interface DashboardTotal extends Row, BaseEntity {
  collapsed: false;
  dashboard_agencies: Array<number>;
  dashboard_advertisers: Array<number>;
  isFiltered: false;
  showChildren: true;
  total_ref: number;
  type: RowTypes.Total;
}
