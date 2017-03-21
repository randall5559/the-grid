/* tslint:disable:no-access-missing-member */
import { Component } from '@angular/core';
import { ModalService } from './../../../shared/components/modal/modal.service';


@Component({
  selector: 'ag-comments-title',
  template: `{{ title }}`
})
export class CommentsTitleComponent {
  public title: string;

  constructor(private modal: ModalService) {
    modal.data$
      .subscribe(data => {
        this.title = data;
      });
  }
}
