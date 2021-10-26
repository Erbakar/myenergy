import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public isLogin = new BehaviorSubject<any>('');
  public familyData = null;
  constructor() {}
}
