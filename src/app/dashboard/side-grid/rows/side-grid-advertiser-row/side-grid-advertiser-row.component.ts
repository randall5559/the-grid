/* tslint:disable:no-access-missing-member */
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActionsService } from '../../../../services';
import { AbstractRowComponent } from '../../../../shared/components/grid/grid';


@Component({
  selector: 'ag-side-grid-advertiser-row',
  templateUrl: './side-grid-advertiser-row.component.html',
  styleUrls: ['./side-grid-advertiser-row.component.scss']
})
export class SideGridAdvertiserRowComponent extends AbstractRowComponent {


  /**
   * Creates an instance of SideGridAdvertiserRowComponent.
   *
   * @param {ChangeDetectorRef} cdr
   *
   * @memberOf SideGridAdvertiserRowComponent
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
   * @memberOf SideGridAdvertiserRowComponent
   */
  onRowInit() {}

}
