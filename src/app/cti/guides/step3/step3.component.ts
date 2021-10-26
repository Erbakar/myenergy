import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../assets/javascript/patica';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
declare var $: any;

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit, OnDestroy {
  unitId;
  constructor(
    private commonService: CommonService,
    private http: ApiRequestService,
    public router: Router
  ) {
    this.unitId = localStorage.getItem('unitId');
    goToModulePatica(6, '8254d9f3170b5559aaf470f515de9415');
    openPatica();
  }
  ngOnDestroy() {
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
    this.flowComplate('CTI_STEP3_INTRO');
    this.router.navigate(['/cti/guide/materials/step3']);
  }
}
