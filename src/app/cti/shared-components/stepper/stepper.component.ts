import { Component } from '@angular/core';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/common.service';
declare var $: any;

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  criticalBoxShow = false;
  step;
  activeStep;
  activeCase5 = 'inflow-question';
  activeCase6 = 'inflow6';
  activeCase7;
  unitId;
  id;
  constructor(
    private http: ApiRequestService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.activeStep = this.route.snapshot.url[
      this.route.snapshot.url.length - 1
    ].path;
    this.unitId = localStorage.getItem('unitId');
    if (sessionStorage.getItem('ctiUnitGuidance')) {
      this.step = JSON.parse(sessionStorage.getItem('ctiUnitGuidance'));
    }
    this.commonService.step5ActiveCase.subscribe((res) => {
      if (this.activeCase5 !== res && res !== 'inflow-question') {
        this.activeCase5 = res;
      }
    });
    this.commonService.step6ActiveCase.subscribe((res) => {
      if (this.activeCase6 !== res && res !== 'inflow6') {
        this.activeCase6 = res;
      }
    });
    this.commonService.step7ActiveCase.subscribe((res) => {
      this.activeCase7 = res;
    });
    this.commonService.stepsData.subscribe((res) => {
      this.step = res;
    });
    this.commonService.refreshStep.subscribe((res) => {
      sessionStorage.setItem('ctiUnitGuidance', JSON.stringify(res));
      this.step = JSON.parse(sessionStorage.getItem('ctiUnitGuidance'));
    });
    this.criticalBoxShow = JSON.parse(sessionStorage.getItem('Inicators'))
      ? JSON.parse(sessionStorage.getItem('Inicators')).criticalInflow
      : false;
    $('body').scroll(function () {
      const scrolled_val = $('body').scrollTop().valueOf();
      if (scrolled_val > 80) {
        if ($('.patica-sidebar').hasClass('open')) {
          $('.patica-sidebar').addClass('scroll');
        }
      } else {
        if ($('.patica-sidebar').hasClass('open')) {
          $('.patica-sidebar').removeClass('scroll');
        }
      }
    });
  }
  setActiveCase5(active: string) {
    this.activeCase5 = active;
    this.commonService.step5ActiveCase.next(this.activeCase5);
  }
  setActiveCase6(active: string) {
    this.activeCase6 = active;
    this.commonService.step6ActiveCase.next(this.activeCase6);
  }
  setActiveCase7(active: string) {
    this.activeCase7 = active;
    this.commonService.step7ActiveCase.next(this.activeCase7);
  }
}
