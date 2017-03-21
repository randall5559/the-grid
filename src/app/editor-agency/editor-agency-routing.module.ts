import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditorAgencyComponent } from './editor-agency.component';

const routes: Routes = [
  {
    path: '',
    component: EditorAgencyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class EditorAgencyRoutingModule { }
