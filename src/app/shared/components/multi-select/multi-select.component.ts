import {
  Component,
  ElementRef,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import * as $ from 'jquery';
import 'select2';
import {
  OptionModel,
  SelectItem
} from '../../../interfaces';


@Component({
  selector: 'ag-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
  // encapsulation: ViewEncapsulation.None
})
export class MultiSelectComponent implements AfterViewInit, OnDestroy {

  /** Public members */
  @Input() public name?: string;
  @Input() public optionsList?: Array<OptionModel>;
  @Input() public placeholder?: string;
  @Input() public multiple?: string;
  @Output() public onSelect?: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();

  /** Private members */
  @ViewChild('selectEl') private selectEl: ElementRef;
  private select2El: JQuery;


  /**
   * Creates an instance of MultiSelectComponent.
   *
   * @param {ElementRef} el
   *
   * @memberOf MultiSelectComponent
   */
  constructor(private componentEl: ElementRef) { }


  /**
   * LifeCycle Hook: After View Init
   *
   *
   * @memberOf MultiSelectComponent
   */
  ngAfterViewInit() {

    this.select2El = $(this.selectEl.nativeElement);
    $.fn.select2.defaults.set('dropdownParent', $(this.componentEl.nativeElement));

    this.select2El
      .select2({
        theme: 'bootstrap'
      })
      .on('select2:select', () => {
        this.onSelect.emit({
          selectName: this.name,
          ids: this.select2El.val() || [],
          type: 'select'
        });
      })
      .on('select2:unselect', () => {
        this.onSelect.emit({
          selectName: this.name,
          ids: this.select2El.val() || [],
          type: 'unselect'
        });
      })
      .on('select2:close', () => {
        if (this.select2El.val() === null) {
          this.applyPlaceholder($(this.componentEl.nativeElement));
        }
      })
      .trigger('select2:close');

    this.select2El.siblings('.select2').css({ 'width': '100%' });

  }


  /**
   * Apply the placeholder text
   *
   * @private
   *
   * @memberOf MultiSelectComponent
   */
  private applyPlaceholder(el: JQuery) {
    el.find('input.select2-search__field')
      .prop('placeholder', this.placeholder)
      .css({
        'width': 'auto',
        'text-align': 'left'
      });
  }


  /**
   * Clean up the jQuery elements
   *
   *
   * @memberOf MultiSelectComponent
   */
  public ngOnDestroy() {
    this.select2El.select2('destroy');
  }

}
