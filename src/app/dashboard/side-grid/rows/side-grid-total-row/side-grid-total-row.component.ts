/* tslint:disable:no-access-missing-member */
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActionsService } from '../../../../services';
import { AbstractRowComponent } from '../../../../shared/components/grid/grid';


@Component({
  selector: 'ag-side-grid-total-row',
  templateUrl: './side-grid-total-row.component.html',
  styleUrls: ['./side-grid-total-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideGridTotalRowComponent extends AbstractRowComponent {


  /**
   * Creates an instance of SideGridTotalRowComponent.
   *
   * @param {ChangeDetectorRef} cdr
   *
   * @memberOf SideGridTotalRowComponent
   */
  constructor(
    protected cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }


  /**
   * Empty onRowInit method
   *
   *
   * @memberOf SideGridTotalRowComponent
   */
  onRowInit() {}

}
