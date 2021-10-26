import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable()
export class SetPasswordService {
  constructor(private httpClient: HttpClient) {}

  checkToken(context: any) {
    return this.httpClient
      .request(
        'get',
        environment.serverUrl + environment.myEnergyServices.token(context)
      )
      .pipe(
        map((body: any) => body),
        catchError((body) => of(body.error.message))
      );
  }
  reSend(data: any) {
    return this.httpClient
      .post(
        environment.serverUrl + environment.myEnergyServices.resendSingup(),
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(
        map((body: any) => body),
        catchError((body) => of(body.error.message))
      );
  }
  setPassword(data: any) {
    return this.httpClient
      .post(
        environment.serverUrl + environment.myEnergyServices.setPassword(),
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(
        map((body: any) => body),
        catchError((body) => of(body.error.message))
      );
  }
}
