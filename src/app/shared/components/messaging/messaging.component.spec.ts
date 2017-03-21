/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';

import { MessagingComponent } from './messaging.component';
import { MessageService } from './message.service';
import { ReplaySubject, Observable, Subject } from 'rxjs';
import { Message } from '../../../interfaces/message.interface';

@Component({
  selector: 'ag-mock-selector',
  template: ``
})

class MockParentComponent {

  constructor(private messageService: MessageService) {

  }
}

class MockMessageService {
  public messages$: ReplaySubject<Message> = new ReplaySubject<Message>(1);

  showError(message: string, time = 0): void {
    this.messages$.next({
      message,
      type: 'message-error'
    });
  }
}

describe('MessagingComponent', () => {
  let component: MessagingComponent;
  let fixture: ComponentFixture<MessagingComponent>;
  let messageService: MessageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagingComponent, MockParentComponent ],
      providers: [
        {
          provide: MessageService,
          useClass: MockMessageService
        }
      ]
    });
    TestBed.compileComponents();
  }));

  beforeEach(inject([MessageService],
      (_messageService) => {
     messageService = _messageService;
    fixture = TestBed.createComponent(MessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should set message variable to what is recieved from service', () => {
    messageService.showError('test error');
    expect(component.message).toEqual('test error');
  });

  it('should set type correctly depending on the method called', () => {
    messageService.showError('test error', 2000);
    expect(component.type).toEqual('message-error');
  });

});
