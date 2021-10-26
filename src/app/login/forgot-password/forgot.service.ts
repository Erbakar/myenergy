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
export class ForgotService {
  constructor(private httpClient: HttpClient) {}

  resetPassword(context: any) {
    return this.httpClient
      .request('POST', environment.serverUrl + `/forgottenPassword`, context)
      .pipe(
        map((body: any) => body.value),
        catchError(() => of('Error, could not load joke :-('))
      );
  }
}
