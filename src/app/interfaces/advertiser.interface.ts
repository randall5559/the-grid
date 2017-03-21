import { Row } from './row.interface';
import { BaseEntity } from './base-entity.interface';
import { RowTypes } from '../enums/enums';

export interface Advertiser extends Row, BaseEntity {
  advertiser_name: string;
  agency_id: number;
  deal_tag: string;
  demo: string;
  comments: string[];
  guaranteed_cpm: number;
  property_id: number;
  sales_type: string;
  selling_vertical: string;
  showChildren: null;
  type: RowTypes.Advertiser;
}
