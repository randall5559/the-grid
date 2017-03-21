import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal-components/modal.component';
import { ModalService } from './modal.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    ModalComponent
  ],
  declarations: [
    ModalComponent
  ],
  providers: [ModalService]
})
export class ModalModule {
   static withComponents(components: any[]) {
    return {
      ngModule: ModalModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: components, multi: true }
      ]
    };
  }
}
