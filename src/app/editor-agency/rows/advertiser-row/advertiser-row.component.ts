/* tslint:disable:no-access-missing-member */
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActionsService } from '../../../services';
import { AbstractRowComponent } from '../../../shared/components/grid/grid';
import { InputUpdate } from '../../../shared/components/input/input-update.interface';
import { Comment } from '../../../interfaces/comment.interface';
import { AggregationalColumns } from '../../../enums/enums';
import { ModalService } from './../../../shared/components/modal/modal.service';
import { AddParenthesisToNegative } from '../../../shared/pipes/add-parenthesis-to-negative.pipe';
import { SaveSpendData } from './../../../interfaces/save-spend-data.interface';
import { CommentsComponent } from '../../modals/comments/comments.component';
import { CommentsTitleComponent } from '../../modals/comments/comments-title.component';

@Component({
  selector: 'ag-advertiser-row',
  templateUrl: './advertiser-row.component.html',
  styleUrls: ['./advertiser-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvertiserRowComponent extends AbstractRowComponent {

  /** Public members */
  public columns = AggregationalColumns;

  /**
   * Creates an instance of AdvertiserRowComponent.
   *
   * @param {ActionsService} Actions
   * @param {ChangeDetectorRef} cdr
   *
   * @memberOf AdvertiserRowComponent
   */
  constructor(
    private modalService: ModalService,
    private Actions: ActionsService,
    protected cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }


  /**
   * This Row's onInit
   *
   *
   * @memberOf AdvertiserRowComponent
   */
  public onRowInit() {
    this.subscription = this.updates$
      .filter((data) => data !== null)
      .subscribe((data: InputUpdate) => {
        let val = data.value.toString().length === 0 ? 0 : data.value;
        this.Actions.updateAdvertiserValue(data.id, this.columns.agency_spend, parseFloat(val.toString()));
      });
  }


  /**
   *
   *
   * @param {Comment[]} comments
   * @param {number} id
   * @param {number} dealId
   *
   * @memberOf AdvertiserRowComponent
   */
  public openComments(rowName: string, comments: Comment[], id: number, dealId: number) {
    this.Actions.updateComments(comments, id, dealId);
    this.modalService.setTitle(CommentsTitleComponent);
    this.modalService.setContent(CommentsComponent);
    this.modalService.show();
    this.modalService.passData(rowName);
  }

}
