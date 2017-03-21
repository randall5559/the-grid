/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddParenthesisToNegative } from './add-parenthesis-to-negative.pipe';

describe('InputComponent', () => {
  let pipe: AddParenthesisToNegative;

  beforeEach(() => {
    pipe = new AddParenthesisToNegative();
  });

  it('transforms should add parenthesis "-1" to "(-1)"', () => {
    let value: any = '-1';
    expect(pipe.transform(value)).toEqual('( -1)');
  });
});
