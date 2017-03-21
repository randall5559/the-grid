import { Injectable, ComponentRef } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { Modal } from './../../../interfaces/modal.interface';

@Injectable()
export class ModalService {

  public display$: Subject<Modal> = new Subject<Modal>();
  public title$ = new ReplaySubject<any>(1);
  public content$ = new ReplaySubject<any>(1);
  public data$ = new ReplaySubject<any>(1);


  /**
   * Sets the title of the modal
   *
   * @template T
   * @param {T} title
   *
   * @memberOf ModalService
   */
  public setTitle<T>(title: T): void {
    this.title$.next(title);
  }


  /**
   * Sets the content of the modal
   *
   * @template T
   * @param {T} content
   *
   * @memberOf ModalService
   */
  public setContent<T>(content: T): void {
    this.content$.next(content);
  }


  /**
   * Shows modal view
   *
   *
   * @memberOf ModalService
   */
  public show(): void {
    this.display$.next({state: true});
  }


  /**
   * Hides modal view
   *
   *
   * @memberOf ModalService
   */
  public hide(): void {
    this.display$.next({state: false});
  }


  /**
   * Allows arbituary data to be pass from modal to components and vice-versa
   *
   * @param {*} data
   *
   * @memberOf ModalService
   */
  public passData(data: any): void {
    this.data$.next(data);
  }
}
