import { RowTypes } from '../enums/row-types.enum';

export enum OptionModelTypes {
  Advertiser = RowTypes.Advertiser.valueOf(),
  Agency = RowTypes.Agency.valueOf(),
  Property = RowTypes.Property.valueOf(),
  Total = RowTypes.Total.valueOf(),
  Demo = RowTypes.Total.valueOf() + 1,
  VarianceFilterValue = RowTypes.Total.valueOf() + 2
}
