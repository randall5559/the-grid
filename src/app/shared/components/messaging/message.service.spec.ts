import { Injectable } from '@angular/core';
import { MessagingComponent } from './messaging.component';
import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { ReplaySubject, Observable, Subject } from 'rxjs';
import { MessageService } from './message.service';

describe('show Error Message', () => {

  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService],
    });
  });

  beforeEach(inject([MessageService], (
    _messageService: MessageService
    ) => {
    messageService = _messageService;
  }));

  describe('showError', () => {
    it('receives the correct message and message type', () => {

      messageService.showError('test error message');
      messageService.messages$
        .subscribe((result) => {
          expect(result).toEqual({message: 'test error message', type: 'message-error'});
        });
      });
    });

    it('receives the null message after time parameter expires', fakeAsync(() => {
      messageService.showError('test error 2', 2000 );

      tick(2001);
      messageService.messages$
        .subscribe((result) => {
          expect(result).toEqual({message: '', type: null});
         });
    }));



  describe('showSuccess', () => {
    it('adds a new observable for showing success', () => {

    messageService.showSuccess('test success message');
    messageService.messages$
      .subscribe((result) => {
        expect(result).toEqual({message: 'test success message', type: 'message-success'});
      });
    });

     it('receives the null message after time parameter expires', fakeAsync(() => {
      messageService.showSuccess('test success 2', 2000 );

      tick(2001);
      messageService.messages$
        .subscribe((result) => {
          expect(result).toEqual({message: '', type: null});
         });
    }));
  });
});
