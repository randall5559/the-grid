import { RowTypes } from '../enums/enums';

export interface Row {
  collapsed: boolean;
  id: number;
  isFiltered: boolean;
  showChildren: null | boolean;
  type: RowTypes;
  isDirty?: boolean;
  deal_id?: number;
}
