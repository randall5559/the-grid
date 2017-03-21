/* tslint:disable:no-access-missing-member */
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { InputUpdate } from '../../../shared/components/input/input-update.interface';
import { ActionsService } from '../../../services';
import { AbstractRowComponent } from '../../../shared/components/grid/grid';
import { AggregationalColumns } from '../../../enums/enums';
import { AddParenthesisToNegative } from '../../../shared/pipes/add-parenthesis-to-negative.pipe';

@Component({
  selector: 'ag-total-row',
  templateUrl: './total-row.component.html',
  styleUrls: ['./total-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalRowComponent extends AbstractRowComponent {

  /** Public members */
  public columns = AggregationalColumns;


  /**
   * Creates an instance of TotalRowComponent.
   *
   * @param {ActionsService} Actions
   * @param {ChangeDetectorRef} cdr
   *
   * @memberOf TotalRowComponent
   */
  constructor(
    private Actions: ActionsService,
    protected cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }


  /**
   * Row init
   *
   *
   * @memberOf TotalRowComponent
   */
  public onRowInit() {
    this.updates$
      .filter((data) => data !== null)
      .subscribe((data: InputUpdate) => {
        // this.Actions.updateTotalValue(data.id, this.columns.agency_spend, parseFloat(data.value.toString()));
      });
  }

}
