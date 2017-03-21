/* tslint:disable:no-access-missing-member */
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActionsService } from '../../../services';
import { AbstractRowComponent } from '../../../shared/components/grid/grid';
import { InputUpdate } from '../../../shared/components/input/input-update.interface';
import { AggregationalColumns } from '../../../enums/enums';
import { AddParenthesisToNegative } from '../../../shared/pipes/add-parenthesis-to-negative.pipe';

@Component({
  selector: 'ag-agency-row',
  templateUrl: './agency-row.component.html',
  styleUrls: ['./agency-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgencyRowComponent extends AbstractRowComponent {

  /** Public members */
  public columns = AggregationalColumns;


  /**
   * Creates an instance of AgencyRowComponent.
   *
   * @param {ActionsService} Actions
   *
   * @memberOf AgencyRowComponent
   */
  constructor(
    private Actions: ActionsService,
    protected cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }


  /**
   * The Row Init
   *
   *
   * @memberOf AgencyRowComponent
   */
  public onRowInit() {
    this.subscription = this.updates$
      .filter((data) => data !== null)
      .subscribe((data: InputUpdate) => {
        // this.Actions.updateAgencyValue(data.id, this.columns.agency_spend, parseFloat(data.value.toString()));
      });
  }


  /**
   * Collapse all child propertues and advertisers
   *
   * @param {any} id
   *
   * @memberOf AgencyRowComponent
   */
  public collapse(id): void {
    this.Actions.toggleAgency(id);
  }

}
