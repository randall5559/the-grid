import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { Comment } from './../interfaces/comment.interface';
import { environment } from '../../environments/environment';
import { MessageService } from './../shared/components/messaging/message.service';
import { PeacockService } from './../shared/components/peacock/peacock.service';

@Injectable()
export class DataService {

  constructor(
    private Http: HttpService,
    private message: MessageService,
    private peacock: PeacockService) { }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberOf DataService
   */
  public getAgencyData(): Observable<any> {
    let url = '../../assets/omg.json';
    // let url: string = environment.apiBase + '';
    return this.Http.get(url)
      .map((response: Response) => {
        return response.json();
      });
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberOf DataService
   */
  public saveAgencyData(data): Observable<any> {
    let url: string = environment.apiBase + '';

    return this.Http
      .post(url, data)
      .map((res: Response) => res)
      .catch(err => {
        this.peacock.hide();
        this.message.showError('Something went wrong! Please contact your Gateway Administrator.', 0);
        return Observable.throw(err);
      });
  }


  /**
   *
   *
   * @param {any} parent_agency_id
   * @returns
   *
   * @memberOf DataService
   */
  public notifyNBCU(parent_agency_id) {
    let url: string = environment.apiBase;
    let data = { parent_agency_id: parent_agency_id };

    return this.Http
      .post(url, data)
      .map((res: Response) => res)
      .catch(err => {
        this.peacock.hide();
        this.message.showError('Something went wrong! Please contact your Gateway Administrator.', 0);
        return Observable.throw(err);
      });
  }

  /**
   *
   *
   * @returns {Observable<Blob>}
   *
   * @memberOf DataService
   */
  public saveExcelFile(): Observable<Blob> {
    let url = environment.apiBase;

    return this.Http.get(url, { responseType: ResponseContentType.Blob })
      .map(res => res.blob())
      .catch(err => {
        this.message.showError('Something went wrong! Please contact your Gateway Administrator.', 0);
        return Observable.throw(err);
      });
  }


  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberOf DataService
   */
  public getUserProfile(): Observable<any> {
    let url: string = environment.apiBase;
    return this.Http.get(url)
      .map((response: Response) => {
        return response.json();
      });
  }

  /**
   * Saves a comment
   * @returns {Observable<any>}
   *
   * @memberOf DataService
   */
  public saveComment(dealId: number, text: string) {
    const url: string = environment.apiBase + '/comments';
    const data = {
      deal_id: dealId,
      text: text
    };

    return this.Http
      .post(url, data)
      .map((res: Response) => res)
      .catch(err => {
        this.peacock.hide();
        this.message.showError('Something went wrong! Please contact your Gateway Administrator.', 0);
        return Observable.throw(err);
      });
  }

  /**
   * Delete a comment
   * @returns {Observable<any>}
   *
   * @memberOf DataService
   */
  public deleteComment(id: string, dealId: number) {
    const url: string = environment.apiBase + '/comments/';

    return this.Http
      .delete(url)
      .map((res: Response) => res)
      .catch(err => {
        this.peacock.hide();
        this.message.showError('Something went wrong! Please contact your Gateway Administrator.', 0);
        return Observable.throw(err);
      });
  }

}
