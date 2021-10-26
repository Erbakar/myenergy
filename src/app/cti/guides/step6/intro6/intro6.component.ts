import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../../assets/javascript/patica';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
@Component({
  selector: 'app-intro6',
  templateUrl: './intro6.component.html',
  styleUrls: ['./intro6.component.scss'],
})
export class Intro6Component implements OnInit, OnDestroy {
  remember;
  unitId;
  constructor(
    private commonService: CommonService,
    private http: ApiRequestService,
    public router: Router
  ) {
    this.unitId = localStorage.getItem('unitId');

    goToModulePatica(9, 'e255c42577a3c2c8dcc86782b75fec41');
    openPatica();
  }
  ngOnDestroy() {
    this.commonService.openPatica.next(false);
    hidePatica();
  }
  ngOnInit() {}

  goToPatica(path: any, module: String) {
    goToModulePatica(path, module);
  }

  rememeberme(val: boolean) {
    this.remember = val;
  }
  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unitId }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unitId);
      });
  }
  nextStep() {
    this.flowComplate('CTI_STEP6_INTRO');
    localStorage.setItem('isShowstep6Intro', this.remember);
    this.commonService.isShowstep6Intro.next('true');
    this.commonService.step6ActiveCase.next('inflow6');
  }
}
