import {
  OptionModelTypes,
  FilterEvaluationStrategies
} from '../enums/enums';

export interface OptionModel {
    type: OptionModelTypes;
    name: string;
    key: string;
    value: any;
    selected: boolean;
    id: number;
    evaluationStrategy: FilterEvaluationStrategies;
}
