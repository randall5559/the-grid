import { Row } from './row.interface';
import { BaseEntity } from './base-entity.interface';
import { RowTypes } from '../enums/enums';

export interface Agency extends Row, BaseEntity {
  advertisers: Array<number>;
  agency_name: string;
  properties: Array<number>;
  type: RowTypes.Agency;
}
