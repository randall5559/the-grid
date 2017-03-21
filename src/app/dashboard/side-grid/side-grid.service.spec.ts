/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SideGridService } from './side-grid.service';

xdescribe('SideGridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SideGridService]
    });
  });

  it('should ...', inject([SideGridService], (service: SideGridService) => {
    expect(service).toBeTruthy();
  }));
});
