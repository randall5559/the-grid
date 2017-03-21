import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  DataService,
  ActionsService,
  StateManagerService
} from '../../../services';
import {
  Comment,
  Modal } from '../../../interfaces';
import { ModalService } from './../../../shared/components/modal/modal.service';

@Component({
  selector: 'ag-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  @ViewChild('editElement') public editElementRef: ElementRef;
  @ViewChild('addElement') public addElementRef: ElementRef;
  public commentId: number;
  public commentDealId: number;
  public userId: number;
  public comments: Comment[];
  public commentsInitLength: number;
  public textLimit: number;
  public charLimit: number;
  public editToggle: boolean;
  public isAdded: boolean;
  public disableAddButton: boolean;

  constructor(
    private dataService: DataService,
    private actionsService: ActionsService,
    private stateManager: StateManagerService,
    private modalService: ModalService,
    private cdref: ChangeDetectorRef,
    private ngzone: NgZone
  ) {
    this.isAdded = false;
    this.disableAddButton = true;
    this.editToggle = false;
    this.comments = [];
    this.charLimit = 2500;
    this.textLimit = this.charLimit;
   }


  ngOnInit() {
    this.modalService.display$
      .subscribe((display: Modal) => {
        this.charLimit = 2500;
        this.textLimit = this.charLimit;

        if (display.state === false && this.commentsInitLength !== this.comments.length) {
          this.actionsService.updateCommentValue(this.commentId, this.comments);
        }
        this.addElementRef.nativeElement.value = '';
      });

    this.getTheComments();
  }

  ngAfterViewInit() {
    this.ngzone.runOutsideAngular(() => {
      Observable.fromEvent(this.addElementRef.nativeElement, 'keyup')
        .subscribe(($event: any) => {
          this.textLimit = this.charLimit - ($event.target.value.length);
          this.disableAddButton = $event.target.value.length === 0;

          if ($event.target.value.length > this.charLimit) {
            let limitedValue = this.addElementRef.nativeElement.value.substring(0, this.charLimit);
            this.addElementRef.nativeElement.value = limitedValue;
          }

          this.cdref.detectChanges();
        });
    });
  }


  /**
   *
   *
   *
   * @memberOf CommentsComponent
   */
  public onAdd() {
    if (this.addElementRef.nativeElement.value !== '') {
      this.isAdded = true;

      this.stateManager
        .getModel('UserProfile')
        .subscribe((data: Object) => {
          if (!(Object.keys(data).length === 0)) {
            const now = new Date().toString();
            const newComment = {
              created_at: now,
              text: this.addElementRef.nativeElement.value,
              user: {
                app_user_id: this.userId,
                first_name: data['first_name'],
                last_name: data['last_name']
              }
            };

            this.comments.push(newComment);
            this.addElementRef.nativeElement.value = '';
            this.charLimit = 2500;
            this.textLimit = this.charLimit;
            this.dataService.saveComment(this.commentDealId, newComment.text)
              .subscribe(res => {
                this.actionsService.resetDirtyAgencyFields();
              });

            setTimeout(() => {
              this.isAdded = false;
            }, 3000);
          }
        });
    }
  }

  /**
   *
   *
   * @param {number} index
   *
   * @memberOf CommentsComponent
   */
  public onDelete(index: number, commentId: string) {
    this.comments.splice(index, 1);

    this.dataService.deleteComment(commentId, this.commentDealId)
      .subscribe(res => {
        this.actionsService.resetDirtyAgencyFields();
      });
  }

  /**
   *
   *
   * @param {*} value
   * @param {number} index
   *
   * @memberOf CommentsComponent
   */
  public onEdit(value: any, index: number) {
    if (this.editToggle) {
      this.editToggle = false;
      this.comments[index].text = this.editElementRef.nativeElement.value;
    } else {
      this.editToggle = true;
    }
  }

  /**
   * Get the model from the data service and then call the parsing mechanisims
   *
   * @private
   *
   * @memberOf EditorAgencyComponent
   */
  private getTheComments() {
    this.stateManager
      .getModel('CommentsModel')
      .subscribe((commentObj: any) => {
        if (Object.keys(commentObj).length > 0) {
          this.commentId = commentObj.id;
          this.commentDealId = commentObj.deal_id;
          this.comments = commentObj.comments;
          this.commentsInitLength = this.comments.length;
        }
      });
  }
}
