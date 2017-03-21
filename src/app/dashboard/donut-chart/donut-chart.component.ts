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
  selector: 'ag-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit, OnChanges {

  /** Pulbic members */
  @Input() public color: string = '#e05611';
  @Input() public otherColor: string = '#dbd4d4';
  @Input() public label: string;
  @Input() public part: number;
  @Input() public whole: number;
  public percent: number = 0;

  /** Private members */
  @ViewChild('chart') private chart: ElementRef;
  private chartApi: ChartAPI;


  /**
   * LifeCycle Hook: After View Init
   * 
   * 
   * @memberOf DonutChartComponent
   */
  ngOnInit() {
    this.createChart();
  }


  /**
   * LifeCycle Hook: On Changes update the graph
   * 
   * @param {SimpleChanges} changes
   * 
   * @memberOf DonutChartComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['part'] && changes['whole'] && this.chartApi) {
      this.percent = this.part / this.whole;
      this.chartApi.load({
        columns: [
          ['Remaining', this.whole - this.part],
          [this.label, this.part],
        ]
      });
    }
  }


  /**
   * Create the chart
   * 
   * @private
   * 
   * @memberOf DonutChartComponent
   */
  private createChart() {
    this.percent = this.part / this.whole;
    this.chartApi = c3.generate({
      bindto: this.chart.nativeElement,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      // interaction: {
      //   enabled: false
      // },
      data: {
        columns: [
          ['Remaining', this.whole - this.part],
          [this.label, this.part],
        ],
        type: 'donut'
      },
      legend: {
        hide: true
      },
      tooltip: {
        format: {
          value: (value, ratio, id) => `${value}` //  (${ratio})
        }
        // show: false
      },
      size: {
        width: 170,
        height: 190
      },
      color: {
        pattern: [this.otherColor, this.color]
      },
      donut: {
        label: {
          show: false
        },
        width: 24
      }
    });
  }

}
