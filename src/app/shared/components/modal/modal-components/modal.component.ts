import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  OnInit,
  ReflectiveInjector,
  ComponentFactoryResolver,
  Type,
  ElementRef,
  ComponentRef} from '@angular/core';
import { Observable } from 'rxjs';
import { Modal } from '../../../../interfaces/modal.interface';
import { ModalService } from '../modal.service';


@Component({
  selector: 'ag-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild('contentAnchor', {read: ViewContainerRef}) private contentAnchor: ViewContainerRef;
  @ViewChild('titlesAnchor', {read: ViewContainerRef}) private titlesAnchor: ViewContainerRef;
  public shown: boolean = false;


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.modalService.display$
      .subscribe((display: Modal) => {
        this.shown = display.state;
      });

    this.modalService.title$
      .subscribe(<T>(title: T) => {
        this.titlesAnchor.clear();
        this.createTitleComponent(title).instance;
      });

    this.modalService.content$
      .subscribe(<T>(content: T) => {
        this.contentAnchor.clear();
        this.createContentComponent(content).instance;
      });
  }

  private createTitleComponent<T>(titleClass) {
    return this.titlesAnchor.createComponent(
      this.componentFactoryResolver.resolveComponentFactory<T>(titleClass)
    );
  }

  private createContentComponent<T>(contentClass) {
    return this.contentAnchor.createComponent(
      this.componentFactoryResolver.resolveComponentFactory<T>(contentClass)
    );
  }

  public close() {
    this.modalService.hide();
  }

}
