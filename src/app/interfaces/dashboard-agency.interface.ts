import { Row } from './row.interface';
import { BaseEntity } from './base-entity.interface';
import { RowTypes } from '../enums/enums';

export interface DashboardAgency extends Row, BaseEntity {
  advertisers_ref: Array<number>;
  agency_name: string;
  agency_ref: number;
  dashboard_advertisers: Array<number>;
  type: RowTypes.Agency;
}
