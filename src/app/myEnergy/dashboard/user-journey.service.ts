import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class UserJourneyService {
  public userJourneyData = new Subject<any>();

  constructor(private http: ApiRequestService) {}
  public guindance(type: string, data?: any) {
    this.http
      .callService(
        new Method(environment.myEnergyServices.userJourney(), data, type)
      )
      .subscribe((res) => {
        this.userJourneyData.next(res);
      });
  }
}
