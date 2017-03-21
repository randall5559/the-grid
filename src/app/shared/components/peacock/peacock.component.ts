import { Component, OnInit } from '@angular/core';
import { PeacockService } from './peacock.service';
import { Peacock } from '../../../interfaces/peacock.interface';

@Component({
  selector: 'ag-peacock',
  templateUrl: './peacock.component.html'
})

export class PeacockComponent implements OnInit {
  public peacockDisplay: string = 'hide';

  constructor(private peacockService: PeacockService) {}

  ngOnInit() {
    this.peacockService.display$
      .subscribe((display: Peacock) => {
        if (display.state === true) {
          this.peacockDisplay = '';

          // This is here to resolve issue with .main-content z-index being set to 1:
          // overriding peacock z-index and causing header to overlay peacock
          window.document.querySelector('.main-content')['style'].zIndex = 3;
        } else {
          this.peacockDisplay = 'hide';
          window.document.querySelector('.main-content')['style'].zIndex = 1;
        }
      });
  }
}


