import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService, ActionsService} from '../../services';
import { Observable} from 'rxjs/Observable';


@Injectable()
export class UserProfilerResolver implements Resolve<any> {
  constructor(private data: DataService, private actions: ActionsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this
      .data
      .getUserProfile()
      .do((data: any) => {
        this.actions.setUserProfile(data);
      });
  }
}

