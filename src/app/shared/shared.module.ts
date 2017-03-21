import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridComponent } from './components/grid/grid-component/grid.component';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { InputComponent } from './components/input/input.component';
import { HighlightComponent } from './components/highlight/highlight.component';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    GridComponent,
    MultiSelectComponent,
    HighlightComponent,
    InputComponent
  ],
  declarations: [
    GridComponent,
    MultiSelectComponent,
    HighlightComponent,
    InputComponent
  ]
})
export class SharedModule {
  static withComponents(components: any[]) {
    return {
      ngModule: SharedModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: components, multi: true }
      ]
    };
  }
}
