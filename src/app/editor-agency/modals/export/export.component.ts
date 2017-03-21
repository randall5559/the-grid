import { Component, OnInit } from '@angular/core';
import {
  DataService,
  ActionsService,
  StateManagerService
} from '../../../services';
import { SaveSpendData } from '../../../interfaces';
import { ModalService } from './../../../shared/components/modal/modal.service';
import { MessageService } from './../../../shared/components/messaging/message.service';
import { PeacockService } from './../../../shared/components/peacock/peacock.service';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'ag-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  constructor(
    private actions: ActionsService,
    private dataService: DataService,
    private modal: ModalService,
    private peacock: PeacockService,
    private message: MessageService
  ) {}

  public saveAndExport() {
    this.peacock.show();
    this.actions.getDirtyAgencyFields()
      .subscribe((data: SaveSpendData[]) => {

        this.dataService.saveAgencyData({ agency_deals: data })
          .subscribe(res => {

            this.dataService.saveExcelFile()
              .subscribe(dataBlob => {
                let blob = new Blob([(<any>dataBlob)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                let date = (new Date()).toISOString().split('T')[0];
                FileSaver.saveAs(blob, `nbcu-agency-gateway-${date}.xls`);

                this.modal.hide();
                this.peacock.hide();
                this.message.showSuccess('Your registration information has been successfully saved!', 5000);
                this.actions.resetDirtyAgencyFields();
              });

          });
      });
  }

  public hideAlert() {
    this.modal.hide();
  }
}
