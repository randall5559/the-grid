import { Row } from './row.interface';
import { BaseEntity } from './base-entity.interface';
import { RowTypes } from '../enums/enums';

export interface DashboardAdvertiser extends Row, BaseEntity {
  advertiser_name: string;
  advertisers_ref: number[];
  agency_id: number;
  type: RowTypes.Advertiser;
}
