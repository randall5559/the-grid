import {
  Component,
  Input,
  ViewChild,
  Renderer,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ElementRef,
  Attribute
} from '@angular/core';
import {
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';
import { Observable, Subscription, Subject } from 'rxjs';
import {
  Advertiser,
  Property,
  Agency
} from '../../../interfaces';
import { InputUpdate } from './input-update.interface';


@Component({
  selector: 'ag-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnChanges, AfterViewInit {

  /** Public Members */
  // @Attribute('attr') public attr: string;
  @Input() public item: Agency | Property | Advertiser;
  @Input() public model: Subject<any>;
  @Input() public attr: any;
  // @Output() public update: EventEmitter<InputModel> = new EventEmitter();

  /** Private Members */
  @ViewChild('input') public input: ElementRef;
  // private attr: string;
  private subscibers: Subscription[] = [];


  /**
   * Creates an instance of InputComponent.
   *
   * @param {CurrencyPipe} currencyPipe
   * @param {DecimalPipe} decimalPipe
   *
   * @memberOf InputComponent
   */
  constructor(
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe
  ) { }


  /**
   * LifeCycle Hook: AfterViewInit
   *
   *
   * @memberOf InputComponent
   */
  public ngAfterViewInit() {
    this.subscibers.push(
      Observable.fromEvent(this.input.nativeElement, 'focus').subscribe((event: Event) => this.onFocus(event)),
      Observable.fromEvent(this.input.nativeElement, 'blur').subscribe((event: Event) => this.onBlur(event))
    );
    this.input.nativeElement.value = this.currencyPipe.transform(this.item[this.attr], 'USD', true, '1.0-0');
  }


  /**
   * LifeCycle Hook: onChange
   *
   *
   * @memberOf InputComponent
   */
  public ngOnChanges(): void {
    this.input.nativeElement.value = this.currencyPipe.transform(this.item[this.attr], 'USD', true, '1.0-0');
  }


  /**
   * OnBlur event handler
   *
   *
   * @memberOf InputComponent
   */
  private onBlur(event: Event): void {


    let input: string = this.input.nativeElement.value;
    let output0: string[] = input.split('.');
    let output1: string = output0.shift() + (output0.length ? '.' + output0.join('') : '');
    let output2: string = output1.replace(/[^\d\.\d]/g, '');
    let output3 = (output2 === ' ' || output2.length === 0) ? '0' : output2;
    let val: number = Math.round(parseFloat(output3));
    if (val !== this.item[this.attr]) {
      this.model.next({ id: this.item.id, value: val, attr: this.attr });
    }

    this.input.nativeElement.value = this.currencyPipe.transform(val, 'USD', true, '1.0-0');
  }


  /**
   * OnFocus event handler
   *
   *
   * @memberOf InputComponent
   */
  private onFocus(event: Event): void {
    this.input.nativeElement.value = parseInt(this.item[this.attr].toString(), 10);
  }

}
