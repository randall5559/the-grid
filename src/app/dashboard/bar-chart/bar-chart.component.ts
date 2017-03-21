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
import * as $ from 'jquery';
import * as c3 from 'c3';
import { ChartAPI } from 'c3';

@Component({
  selector: 'ag-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnChanges {

  /** Public Members */
  @Input() public color: string = '#e05611';
  @Input() public values: Array<{name: string, value: number}>;
  @Input() public displayCount: number;

  /** Private member */
  @ViewChild('chart') private chart: ElementRef;
  private chartApi: ChartAPI;


  /**
   * LifeCycle Hook: On Init
   *
   *
   * @memberOf BarChartComponent
   */
  ngOnInit() {
    this.createChart();
  }


  /**
   * LifeCycle Hook: handle changes
   *
   * @param {SimpleChanges} changes
   *
   * @memberOf BarChartComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['values'] && this.chartApi) {
      this.chartApi.load({
        columns: this.processValues(this.values, this.displayCount)
      });
    }
  }


  /**
   * Process the Values into a two dimensional array
   *
   * @private
   * @param {Array<{name: string, value: number}>} values
   * @param {number} [displayCount=10]
   * @returns {Array<Array<any>>}
   *
   * @memberOf BarChartComponent
   */
  private processValues(
    values: Array<{name: string, value: number}>,
    displayCount = 10
  ): Array<Array<any>> {
    if (displayCount === 0) { displayCount = values.length; }
    return values.slice(0, displayCount)
      .reduce((arr, point: {name: string, value: number}) => {
        let new_arr = arr.slice(0);
        new_arr[0].push(point.name);
        new_arr[1].push(point.value);
        return new_arr;
      }, [
        ['x'],
        ['spend']
      ]);
  }


  /**
   * Create the chart
   *
   * @private
   *
   * @memberOf BarChartComponent
   */
  private createChart() {
    this.chartApi = c3.generate({
      bindto: this.chart.nativeElement,
      data: {
        x: 'x',
        color: (color, d) => '#6d5175',
        columns: this.processValues(this.values, this.displayCount),
        type: 'bar',
        // labels: true
      },
      legend: {
        hide: true
      },
      // tooltip: {
      //   show: false
      // },
      size: {
        // width: 170,
        height: 400
      },
      axis: {
        // rotated: true,
        y: {
          show: false,
          padding: {top: 0, bottom: 0}
        },
        x: {
          type: 'category',
          tick: {
            rotate: -90,
            multiline: false,
            fit: true
          },
          height: 100
        }
      },
      bar: {
        width: {
          ratio: 0.5
        }
      }
    });
  }

}
