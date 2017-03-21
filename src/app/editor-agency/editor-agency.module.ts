import { NgModule } from '@angular/core';
import { GridModule } from './../shared/components/grid/grid.module';
import { MultiSelectModule } from '../shared/components/multi-select/multi-select.module';
import { InputModule } from '../shared/components/input/input.module';
import { ModalModule } from './../shared/components/modal/modal.module';
import { EditorAgencyRoutingModule } from './editor-agency-routing.module';
import { AddParenthesisToNegative } from '../shared/pipes/add-parenthesis-to-negative.pipe';

import { EditorAgencyComponent } from './editor-agency.component';
import {
  TotalRowComponent,
  AdvertiserRowComponent,
  AgencyRowComponent,
  PropertyRowComponent,
  TitleRowComponent
} from './rows/rows';
import { CommentsComponent } from './modals/comments/comments.component';
import { CommentsTitleComponent } from './modals/comments/comments-title.component';
import { ExportComponent } from './modals/export/export.component';
import { ExportTitleComponent } from './modals/export/export-title/export-title.component';
import { SendNBCUComponent } from './modals/send-nbcu/send-nbcu.component';
import { SendNBCUTitleComponent } from './modals/send-nbcu/send-nbcu-title/send-nbcu-title.component';

@NgModule({
  imports: [
    ModalModule.withComponents([
      ExportComponent,
      ExportTitleComponent,
      CommentsComponent,
      CommentsTitleComponent,
      SendNBCUComponent,
      SendNBCUTitleComponent
    ]),
    GridModule.withComponents([
      TotalRowComponent,
      AgencyRowComponent,
      PropertyRowComponent,
      AdvertiserRowComponent,
      TitleRowComponent
    ]),
    EditorAgencyRoutingModule,
    InputModule,
    MultiSelectModule
  ],
  declarations: [
    EditorAgencyComponent,
    TotalRowComponent,
    AgencyRowComponent,
    PropertyRowComponent,
    AdvertiserRowComponent,
    TitleRowComponent,
    CommentsComponent,
    CommentsTitleComponent,
    SendNBCUComponent,
    SendNBCUTitleComponent,
    ExportComponent,
    ExportTitleComponent,
    AddParenthesisToNegative
  ],
  exports: [
    EditorAgencyComponent
  ]
})
export class EditorAgencyModule { }
