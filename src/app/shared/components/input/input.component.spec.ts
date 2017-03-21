/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, ElementRef, Renderer, Pipe, Component } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { InputComponent } from './input.component';
import { InputUpdate } from './input-update.interface';
import {
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';
import { Property } from './../../../interfaces/property.interface';

@Component({
  selector: 'ag-test-component-wrapper',
  template: '<div><ag-input [item]="item" attr="agency_spend" [model]="sub"></ag-input></div>'
})


class TestComponent {
  public item: Property = {
    advertisers: [1, 2, 3],
    agency_id: 1,
    property_name: 'test',
    type: 1,
    collapsed: true,
    id: 1,
    isFiltered: true,
    showChildren: null,
    projection: 1,
    registration: 1,
    spend: 1,
    agency_spend: 1,
    variance: 1
  };
  public sub: Subject<any> = new Subject<any>();
  public attr = 'agency_spend';
}

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<TestComponent>;
  let input;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent, TestComponent],
      providers: [
        CurrencyPipe,
        DecimalPipe,
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    input = fixture.nativeElement.children[0].children[0].children[0];
    component = fixture.debugElement.children[0].children[0].componentInstance;
    input.value = '1';
    input.focus();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onFocus', () => {
    it('shows a whole number string for the value', () => {
      expect(input.value).toEqual('1');
    });
  });

  describe('#onBlur', () => {
    it('accepts numeric data', () => {
      input.value = '12345';
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toEqual('$12,345');
    });

    it('rounds decimals', () => {
      input.value = '1234.5';
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toEqual('$1,235');
    });

    it('gets rid of extra decimals, and rounds the first decimal', () => {
      input.value = '1.5.3.5';
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toBe('$2');
    });

    it('rejects alphabetic characters', () => {
      input.value = 'aA1bB2cC3dD4eE5';
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toEqual('$12,345');
    });

    it('rejects special characters', () => {
      input.value = '<!1@2#3$4%5>';
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toEqual('$12,345');
    });

    it('takes an empty value and returns zero dollars', () => {
      input.value = '';
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toBe('$0');
    });

    it('takes text, a space and a number and returns only the number', () => {
      input.value = 'a1b2c3 4!5D6E';
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toBe('$123,456');
    });

    it('takes a space and returns zero dollars', () => {
      input.value = ' ';
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toBe('$0');
    });

    it('takes a text value and returns zero dollars', () => {
      input.value = 'abcdEFGH!@#';
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toBe('$0');
    });

    it('takes text and a space and returns zero dollars', () => {
      input.value = 'abcd EFGH!@#';
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toBe('$0');
    });
  });
});
