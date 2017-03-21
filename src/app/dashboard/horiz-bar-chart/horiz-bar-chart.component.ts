import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import * as c3 from 'c3';
import { ChartAPI } from 'c3';

@Component({
  selector: 'ag-horiz-bar-chart',
  templateUrl: './horiz-bar-chart.component.html',
  styleUrls: ['./horiz-bar-chart.component.scss']
})
export class HorizBarChartComponent implements OnInit {

  /** Public members */
  @Input() public values: Array<{name: string, value: number}>;

  /** Private members */
  @ViewChild('chart') private chart: ElementRef;
  private chartApi: ChartAPI;


  ngOnInit() {
    this.createChart();
  }


  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('changes', changes);
  //   if (changes['values']) {
  //     if (this.chartApi) {
  //         let processedValues = this.processValues(this.values);
  //         this.chartApi.load({
  //           columns: processedValues.data
  //         });
  //     }
  //   }
  // }


  /**
   * Create the chart
   * 
   * @private
   * 
   * @memberOf HorizBarChartComponent
   */
  private createChart() {
    let processedValues = this.processValues(this.values);
    this.chartApi = c3.generate({
      bindto: this.chart.nativeElement,
      data: {
        order: 'asc',
        columns: processedValues.data,
        // color: (color, d) => '#635e5e',
        type: 'bar',
        groups: [
          processedValues.groups
        ]
      },
      tooltip: {
        grouped: false
      },
      size: {
        height: 140
      },
      axis: {
        rotated: true,
        x: {
          show: false
        },
        y: {
          show: false,
          max: processedValues.data.reduce((acc, point) => acc + point[1], 0),
          padding: {top: 0, bottom: 0}
        }
      }
    });
  }


  /**
   * Process the incomming values
   * 
   * @private
   * @param {Array<{name: string, value: number}>} values
   * @returns {{data: Array<any>, groups: Array<string>}}
   * 
   * @memberOf HorizBarChartComponent
   */
  private processValues(values: Array<{name: string, value: number}>): {data: Array<any>, groups: Array<string>} {
    return values.slice(0)
      .reduce((collection, point: {name: string, value: number}): {data: Array<any>, groups: Array<string>} => {
        let new_collection = Object.assign({}, collection);
        new_collection.data = collection.data.slice(0);
        new_collection.groups = collection.groups.slice(0);

        new_collection.data.push([point.name, point.value]);
        new_collection.groups.push(point.name);

        return new_collection;
      }, {data: [], groups: []});
  }

}
