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
declare var $: any;

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit, OnDestroy {
  remember;
  unitId;
  constructor(
    private commonService: CommonService,
    private http: ApiRequestService,
    public router: Router
  ) {
    this.unitId = localStorage.getItem('unitId');

    goToModulePatica(8, '2919eef40f9b601c43ee1bcf06a76da8');
    openPatica();
  }
  ngOnDestroy() {
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
    this.flowComplate('CTI_STEP5_INTRO');
    localStorage.setItem('isShowstep5Intro', this.remember);
    this.commonService.isShowstep5Intro.next('true');
  }
}
