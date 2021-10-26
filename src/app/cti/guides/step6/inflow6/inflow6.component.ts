import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../../assets/javascript/patica';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-inflow6',
  templateUrl: './inflow6.component.html',
  styleUrls: ['./inflow6.component.scss'],
})
export class Inflow6Component implements OnInit, OnDestroy {
  unit;
  isShow = false;
  flowOpportunityOtherUuid;
  flowRisOtherkUuid;
  unitId;
  flowList = [];
  risks = [];
  opportunities = [];
  questionList;
  isPatica = false;
  response;
  controls;
  data;
  form: FormGroup;
  constructor(
    private commonService: CommonService,
    private http: ApiRequestService,
    private fb: FormBuilder
  ) {
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.unitId = localStorage.getItem('unitId');
    this.commonService.openPatica.subscribe((res) => {
      this.openPatica(res);
    });
  }
  openPatica(res: boolean) {
    if (res) {
      this.isPatica = true;

      goToModulePatica(9, '7afd2a789dd17bf12ccefba66a330dae');
      openPatica();
    } else {
      this.isPatica = false;
      hidePatica();
    }
  }
  ngOnDestroy() {
    this.commonService.openPatica.next(false);
    hidePatica();
  }

  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unitId }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unit['id']);
      });
  }
  ngOnInit() {
    this.controls = {};
    this.http
      .callService(
        new Method(
          environment.services.step6Question(this.unit['id'], 'INFLOW'),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.data = res;
        this.generateForm2();
      });
  }
  generateForm2() {
    for (const [key, value] of Object.entries(this.data)) {
      this.controls[key] = new FormControl(false);
    }
    this.form = this.fb.group({
      question: this.fb.group(this.controls),
    });
    this.isShow = true;
  }

  next2() {
    this.http
      .callService(
        new Method(
          environment.services.step6Question(this.unit['id'], 'INFLOW'),
          this.data,
          'put'
        )
      )
      .subscribe((res) => {
        if (JSON.parse(sessionStorage.getItem('Inicators')).criticalInflow) {
          this.commonService.step6ActiveCase.next('business-case');
        } else {
          this.commonService.step6ActiveCase.next('outflow6');
        }
        this.flowComplate('CTI_STEP6_INFLOW');
      });
  }
  uncheck(name: string, value: number, oldValue: number) {
    if (value == oldValue) {
      setTimeout(() => {
        this.data[`${name}`] = null;
      }, 50);
    }
  }

  generateForm() {
    this.flowList.forEach((element) => {
      this.controls[
        element.organisationUnitFlowUuid + 'risks'
      ] = new FormControl(false);
      this.controls[
        element.organisationUnitFlowUuid + 'opportunities'
      ] = new FormControl(false);
      this.controls[
        element.organisationUnitFlowUuid + 'flowRiskOtherName'
      ] = new FormControl(false);
      this.controls[
        element.organisationUnitFlowUuid + 'flowOpportunityOtherName'
      ] = new FormControl(false);
      element.opportunities.forEach((o) => {
        if (o.text === 'OTHER') {
          this.flowOpportunityOtherUuid = o.uuid;
        }
      });
      element.risks.forEach((o) => {
        if (o.text === 'OTHER') {
          this.flowRisOtherkUuid = o.uuid;
        }
      });
    });
    this.form = this.fb.group({
      question: this.fb.group(this.controls),
    });
    this.isShow = true;
  }
}
