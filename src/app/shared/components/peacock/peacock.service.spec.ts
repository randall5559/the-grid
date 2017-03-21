import { TestBed, inject } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { PeacockService } from './peacock.service';
import { Peacock } from '../../../interfaces/peacock.interface';

describe('Peacock Service', () => {

  let peacockService: PeacockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PeacockService ],
    });
  });

  beforeEach(inject([PeacockService], (
    _PeacockService: PeacockService
    ) => {
    peacockService = _PeacockService;
  }));


  it('should broadcast a true boolean for show() method', () => {
    peacockService.show();

    peacockService.display$
      .subscribe((display: Peacock) => {
        expect(display).toEqual({ state: true });
      });
  });

  it('should broadcast a false boolean for hide() method', () => {
    peacockService.hide();

    peacockService.display$
      .subscribe((display: Peacock) => {
        expect(display).toEqual({ state: false });
      });
  });
});
