/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, Response, BaseRequestOptions } from '@angular/http';
import { HttpService } from './http.service';

import { MockType, MockResponse } from '../../helpers/mock-response';
import { DataService } from './data.service';
import { environment } from '../../environments/environment.dev';
import { PeacockService } from './../shared/components/peacock/peacock.service';
import { MessageService } from './../shared/components/messaging/message.service';


xdescribe('DataService', () => {
  let dataService: DataService,
    peacock: PeacockService,
    message: MessageService,
    mockBackend: MockBackend;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataService,
        MessageService,
        PeacockService,
        {
          provide: HttpService,
          useFactory: (_mockBackend, _options) => {
            return new Http(_mockBackend, _options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions,
      ]
    });
  });


  beforeEach(inject([DataService, PeacockService, MessageService, MockBackend], (
    _dataService: DataService,
    _peacockService: PeacockService,
    _messageService: MessageService,
    _mockBackend: MockBackend
    ) => {
    dataService = _dataService;
    peacock = _peacockService;
    message = _messageService;
    mockBackend = _mockBackend;

    spyOn(peacock, 'hide').and.callThrough();
    spyOn(message, 'showError').and.callThrough();
  }));


  it('should retreive the agency data - getAgencyData()', () => {
    setMockBackend({fake: 'test'}, `${environment.apiBase}/`, 200);

    dataService.getAgencyData()
      .subscribe((x) => {
        expect(x).toEqual({fake: 'test'});
      });
  });


  describe('saveAgencyData', () => {
    let data = {
      fake : 'post data'
    };

    it('should post the agency data success', () => {
      setMockBackend({fake: 'successful post'}, `${environment.apiBase}/`, 200);

      dataService.saveAgencyData(data)
        .subscribe((x) => {
          expect(x.json()).toEqual({fake: 'successful post'});
        });
    });

    it('should post the agency data but throw error', () => {
      setMockBackend({fake: 'error throw'}, `${environment.apiBase}/`, 404);

      dataService.saveAgencyData(data)
        .subscribe(
          () => {},
          (err) => {
            expect(peacock.hide).toHaveBeenCalled();
            expect(message.showError).toHaveBeenCalledWith(
              'Something went wrong! Please contact your Gateway Administrator at Gateway.support@nbcuni.com.',
              0
            );
            expect(err.json()).toEqual({fake: 'error throw'});
          }
        );
    });
  });

  describe('Comments - [ saveComment(), deleteComment() ]', () => {
    let dealId = 1234;
    let text = 'Comment Text';

    it('should post the comment save success', () => {
      setMockBackend({fake: 'successful post'}, `${environment.apiBase}/comments`, 200);

      dataService.saveComment(dealId, text)
        .subscribe((x) => {
          expect(x.json()).toEqual({fake: 'successful post'});
        });
    });

    it('should post the comment but throw error', () => {
      setMockBackend({fake: 'error throw'}, `${environment.apiBase}/comments`, 404);

      dataService.saveComment(dealId, text)
        .subscribe(
          () => {},
          (err) => {
            expect(peacock.hide).toHaveBeenCalled();
            expect(message.showError).toHaveBeenCalledWith(
              'Something went wrong! Please contact your Gateway Administrator at Gateway.support@nbcuni.com.',
              0
            );
            expect(err.json()).toEqual({fake: 'error throw'});
          }
        );
    });

    it('should delete a comment', () => {
      setMockBackend({fake: 'comment deleted'}, `${environment.apiBase}/comments/1234567890?deal_id=1234`, 200);

      dataService.deleteComment('1234567890', dealId)
        .subscribe((x) => {
          expect(x.json()).toEqual({fake: 'comment deleted'});
        });
    });
  });

  function setMockBackend(body, url, status) {
    return MockResponse(mockBackend, {
        body: JSON.stringify(body),
        status: status
      },
      MockType.Response,
      (connection) => {
        expect(connection.request.url)
          .toEqual(url);
      }
    );
  };

});
