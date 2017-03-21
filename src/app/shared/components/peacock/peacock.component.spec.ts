import { TestBed, ComponentFixture, inject, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PeacockComponent } from './peacock.component';
import { PeacockService } from './peacock.service';
import { Peacock } from '../../../interfaces/peacock.interface';


describe('Peacock Component', () => {

  let component: PeacockComponent;
  let fixture: ComponentFixture<PeacockComponent>;
  let peacockService: PeacockService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeacockComponent ],
      providers: [ PeacockService ]
    });
    TestBed.compileComponents();
  }));

  beforeEach(inject([PeacockService], (_PeacockService) => {
    peacockService = _PeacockService;

    fixture = TestBed.createComponent(PeacockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(document, 'querySelector').and.returnValue({
      style: {
        zIndex: 1
      }
    });
  }));


  it('show peacock', () => {
    peacockService.show();
    let zIx = document.querySelector('.main-content')['style'].zIndex;

    expect(zIx).toEqual(3);
    expect(component.peacockDisplay).toEqual('');
  });

  it('hide peacock', () => {
    peacockService.hide();
    let zIx = document.querySelector('.main-content')['style'].zIndex;

    expect(zIx).toEqual(1);
    expect(component.peacockDisplay).toEqual('hide');
  });

});
