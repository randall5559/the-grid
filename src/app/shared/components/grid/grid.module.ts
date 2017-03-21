import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid-component/grid.component';

@NgModule({
  imports: [CommonModule],
  declarations: [GridComponent],
  exports: [GridComponent]
})
export class GridModule {
  static withComponents(components: any[]) {
    return {
      ngModule: GridModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: components, multi: true }
      ]
    };
  }
}
