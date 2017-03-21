import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorType } from '../../../interfaces';



const ERROR_TYPES: Array<ErrorType> = [
  {
    typeId: 'unsupported',
    typeCode: '403',
    typeName: 'Unsupported',
    typeMsg: 'You are attempting to view this page with an unsupported browser.<br />\
      Agency Gateway currently only supports Google Chrome.<br /> Please visit \
      <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">\
      this page</a> to download Chrome if you have not already.'
  },
  {
    typeId: 'unauthorized',
    typeCode: '403',
    typeName: 'Unauthorized',
    typeMsg: 'You are not authorized to view the page you requested.'
  },
  {
    typeId: 'not-found',
    typeCode: '404',
    typeName: 'Not Found',
    typeMsg: 'The page you requested was not found.'
  },
  {
    typeId: 'server-error',
    typeCode: '500',
    typeName: 'Internal Server Error',
    typeMsg: 'There was an internal server error.'
  }
];

@Component({
  selector: 'ag-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})

export class ErrorsComponent implements OnInit {
  public err: Object;
  public errCode: string;
  public errType: string;
  public errName: string;
  public errMsg: string;


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route
      .params
      .map(params => params['errId'])
      .subscribe(errId => {
        this.err = ERROR_TYPES.filter(type => type.typeId === errId)[0];
        this.errCode = this.err['typeCode'];
        this.errType = this.err['typeId'];
        this.errName = this.err['typeName'];
        this.errMsg = this.err['typeMsg'];
      });

  }
}
