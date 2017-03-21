/* tslint:disable:no-access-missing-member */
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActionsService } from '../../../services';
import { AbstractRowComponent } from '../../../shared/components/grid/grid';

@Component({
  selector: 'ag-title-row',
  templateUrl: './title-row.component.html',
  styleUrls: ['./title-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleRowComponent extends AbstractRowComponent {


  /**
   * Creates an instance of TitleRowComponent.
   *
   * @param {ChangeDetectorRef} cdr
   *
   * @memberOf TitleRowComponent
   */
  constructor(
    protected cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }


  /**
   * Empty init method
   *
   *
   * @memberOf TitleRowComponent
   */
  onRowInit() { }

}
