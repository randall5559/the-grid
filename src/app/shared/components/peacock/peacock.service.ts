import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Peacock } from '../../../interfaces/peacock.interface';

@Injectable()
export class PeacockService {

  public display$: Subject<Peacock> = new Subject<Peacock>();

  /**
   * @name PeacockService
   *
   * @memberOf PeacockService
   */
  public show(): void {
    this.display$.next({state: true});
  }

  /**
   * @name PeacockService
   *
   * @memberOf PeacockService
   */
  public hide(): void {
    this.display$.next({state: false});
  }
}
