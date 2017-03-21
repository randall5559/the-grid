import { Row } from './row.interface';
import { BaseEntity } from './base-entity.interface';
import { RowTypes } from '../enums/enums';

export interface Property extends Row, BaseEntity {
  advertisers: Array<number>;
  agency_id: number;
  property_name: string;
  type: RowTypes.Property;
}
