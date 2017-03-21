import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { Message } from '../../../interfaces/message.interface';

@Component({
  selector: 'ag-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})

export class MessagingComponent implements OnInit {

  /** Public Members */
  public message: string = '';
  public type: string = '';

  constructor(private messageService: MessageService) {

  }

  ngOnInit() {
    this.messageService.messages$
      .subscribe((msg: Message) => {
        this.message = msg.message;
        this.type = msg.type;
      });
  }
}
