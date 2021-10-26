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
  selector: 'app-intro7',
  templateUrl: './intro7.component.html',
  styleUrls: ['./intro7.component.scss'],
})
export class Intro7Component implements OnInit, OnDestroy {
  remember;
  unitId;
  constructor(
    private commonService: CommonService,
    private http: ApiRequestService,
    public router: Router
  ) {
    this.unitId = localStorage.getItem('unitId');
    this.commonService.step7ActiveCase.next('step7Intro');
    goToModulePatica(10, 'b800c5cb4899c95ed8fc8b675ecc3927');
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
  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unitId }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unitId);
      });
  }
  nextStep() {
    this.flowComplate('CTI_STEP7_INTRO');
    localStorage.setItem('isShowstep7Intro', this.remember);
    this.commonService.isShowstep7Intro.next('true');
    this.commonService.step7ActiveCase.next('smartTarget');
  }
  rememeberme(val: boolean) {
    this.remember = val;
  }
}
