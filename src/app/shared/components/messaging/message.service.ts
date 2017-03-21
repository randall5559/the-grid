import { Injectable } from '@angular/core';
import { MessagingComponent } from './messaging.component';
import { ReplaySubject, Observable, Subject } from 'rxjs';
import { Message } from '../../../interfaces/message.interface';

@Injectable()
export class MessageService {

  /** Public Members */
  public messages$: ReplaySubject<Message> = new ReplaySubject<Message>(1);

  /**
   * Creates an instance of MessageService.
   *
   * @memberOf MessageService
   */
  constructor() {
    this.messages$.next({
      message: '',
      type: null
    });
  }

  /**
   * @name showError
   * @param message {string}
   * @param time {number}
   * @memberOf MessageService
   *
   * @description
   * Displays an error message to the user, will hide after time has passed
   * @returns {Observable<any>}
   */
  showError(message: string, time = 0): Observable<any> {
    let timer$ = Observable.timer(time),
        output$ = new Subject();

    this.messages$.next({
      message,
      type: 'message-error'
    });

    if (time > 0) {
      timer$
        .do(() => this.hideMessage())
        .subscribe(() => {
          output$.next(true);
          output$.complete();
        });
    } else {
      output$.next(true);
      output$.complete();
    }

    return output$;
  }

   /**
   * @name showSuccess
   * @param message {string}
   * @param time {number}
   * @memberOf MessageService
   *
   * @description
   * Displays a success message to the user, will hide after time has passed
   * @returns {Observable<any>}
   */
  showSuccess(message: string, time = 0): Observable<any> {

    let timer$ = Observable.timer(time),
        output$ = new Subject();

    this.messages$.next({
      message,
      type: 'message-success'
    });

    if (time > 0) {
      timer$
        .do(() => this.hideMessage())
        .subscribe(() => {
          output$.next(true);
          output$.complete();
        });
    } else {
      output$.next(true);
      output$.complete();
    }

    return output$;
  }

   /**
   * @name hideMessage
   * @memberOf MessageService
   *
   * @description
   * hides a flash messaged produced by showError or showSuccess
   * @returns {void}
   */
  hideMessage() {
    this.messages$.next({
      message: '',
      type: null
    });
  }
}
