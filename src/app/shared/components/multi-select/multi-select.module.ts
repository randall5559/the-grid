import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MultiSelectComponent],
  exports: [MultiSelectComponent]
})
export class MultiSelectModule { }
