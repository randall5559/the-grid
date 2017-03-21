/* tslint:disable:no-access-missing-member */
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActionsService } from '../../../../services';
import { AbstractRowComponent } from '../../../../shared/components/grid/grid';


@Component({
  selector: 'ag-side-grid-agency-row',
  templateUrl: './side-grid-agency-row.component.html',
  styleUrls: ['./side-grid-agency-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideGridAgencyRowComponent extends AbstractRowComponent {


  /**
   * Creates an instance of AgencyRowComponent.
   *
   * @param {ActionsService} Actions
   * @param {ChangeDetectorRef} cdr
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
   * Empty onRowInit method
   *
   *
   * @memberOf SideGridAgencyRowComponent
   */
  onRowInit() { }


  /**
   * Collapse all child propertues and advertisers
   *
   * @param {any} id
   *
   * @memberOf AgencyRowComponent
   */
  public collapse(id): void {
    this.Actions.toggleAgencyForDashboard(id);
  }

}
