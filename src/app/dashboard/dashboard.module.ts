import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '../shared/components/grid/grid.module';
import { HighlightModule } from '../shared/components/highlight/highlight.module';
import { MultiSelectModule } from '../shared/components/multi-select/multi-select.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { SideGridService } from './side-grid/side-grid.service';
import { DashboardComponent } from './dashboard.component';
import {
  SideGridAdvertiserRowComponent,
  SideGridAgencyRowComponent,
  SideGridTotalRowComponent
} from './side-grid/rows/rows';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { HorizBarChartComponent } from './horiz-bar-chart/horiz-bar-chart.component';



@NgModule({
  imports: [
    CommonModule,
    GridModule.withComponents([
      SideGridAgencyRowComponent,
      SideGridAdvertiserRowComponent,
      SideGridTotalRowComponent
    ]),
    HighlightModule,
    MultiSelectModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    SideGridAdvertiserRowComponent,
    SideGridAgencyRowComponent,
    SideGridTotalRowComponent,
    BarChartComponent,
    DonutChartComponent,
    HorizBarChartComponent
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
