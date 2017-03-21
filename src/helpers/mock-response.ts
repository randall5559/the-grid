import { Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

/**
 * Mock Http Response types
 *
 * @enum {number}
 */
export enum MockType { Response, Error }


/**
 * Mock response method
 *
 * @param {MockBackend} mockBackend
 * @param {Object} response
 * @param {MockType} [type=MockType.Response]
 * @param {Function} [connectionCallBack=()=>{}]
 */
export function MockResponse(
  mockBackend: MockBackend,
  response: Object,
  type: MockType = MockType.Response,
  connectionCallBack: Function = () => {}
) {
  mockBackend.connections
    .subscribe(connection => {

      // call the connection callback and supply the connection object
      connectionCallBack(connection);

      // create the response
      if (type === MockType.Response) {
        connection.mockRespond(new Response(new ResponseOptions(response)));
      } else
      if (type === MockType.Error) {
        connection.mockError(new Response(new ResponseOptions(response)));
      }

    });
}
