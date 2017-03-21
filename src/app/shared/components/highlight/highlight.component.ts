import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'ag-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.scss']
})
export class HighlightComponent {

  /** Public Members */
  @Input() public align: 'left'|'center'|'right' = 'center';
  @Input() public status: boolean = false;
  @Input() public link: boolean = true;

}
