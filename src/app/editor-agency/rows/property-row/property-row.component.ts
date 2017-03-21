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
  selector: 'ag-property-row',
  templateUrl: './property-row.component.html',
  styleUrls: ['./property-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyRowComponent extends AbstractRowComponent {

  /** Public members */
  public columns = AggregationalColumns;


  /**
   * Creates an instance of PropertyRowComponent.
   *
   * @param {ActionsService} Actions
   *
   * @memberOf PropertyRowComponent
   */
  constructor(
    private Actions: ActionsService,
    protected cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }


  /**
   * This Row's onInit
   *
   *
   * @memberOf PropertyRowComponent
   */
  public onRowInit() {
    this.updates$
      .filter(data => data !== null)
      .subscribe((data: InputUpdate) => {
        // this.Actions.updatePropertyValue(data.id, this.columns.agency_spend, parseFloat(data.value.toString()));
      });
  }


  /**
   * Collapse the children
   *
   * @param {any} id
   *
   * @memberOf PropertyRowComponent
   */
  public collapse(id): void {
    this.Actions.toggleProperty(id);
  }

}
