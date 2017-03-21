import { Component, Input } from '@angular/core';
import {
  DataService,
  StateManagerService
} from '../../../services';
import { ModalService } from './../../../shared/components/modal/modal.service';
import { MessageService } from './../../../shared/components/messaging/message.service';
import { PeacockService } from './../../../shared/components/peacock/peacock.service';

@Component({
  selector: 'ag-send-nbcu',
  templateUrl: './send-nbcu.component.html',
  styleUrls: ['./send-nbcu.component.scss']
})
export class SendNBCUComponent {

  constructor(
    private dataService: DataService,
    private stateManager: StateManagerService,
    private modal: ModalService,
    private peacock: PeacockService,
    private message: MessageService
  ) {}


  public sendToNBCU() {
    this.peacock.show();
    this.stateManager
      .getModel('ParentAgencyInfo')
      .take(1)
      .subscribe((data) => {
        this
          .dataService
          .notifyNBCU(data.parent_agency_id)
          .subscribe((dataObj) => {
            if (dataObj['status'] === 200) {
              this.peacock.hide();
              this.message.showSuccess('Your request has been sent. You will receive notification upon successful delivery.', 5000);
            } else {
              this.peacock.hide();
              this.message.showError('Something went wrong! Please contact your Gateway Administrator at Gateway.support@nbcuni.com.',
                5000);
            }
            this.modal.hide();
          });
      });
  }


  /**
   * Hide the modal view
   *
   *
   * @memberOf SendNBCUComponent
   */
  public hide(): void {
    this.modal.hide();
  }
}
