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
  selector: 'app-outflow6',
  templateUrl: './outflow6.component.html',
  styleUrls: ['./outflow6.component.scss'],
})
export class Outflow6Component implements OnInit, OnDestroy {
  unit;
  isShow = false;
  isPatica = false;
  flowOpportunityOtherUuid;
  flowRisOtherkUuid;
  flowList = [];
  unitId;
  data;
  risks = [];
  opportunities = [];
  questionList;
  response;
  controls;
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

      goToModulePatica(9, 'a3281157513fda29573ceccde5b0bb61');
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
        this.commonService.refreshUnitGuindance(this.unitId);
      });
  }
  ngOnInit() {
    this.controls = {};
    this.http
      .callService(
        new Method(
          environment.services.step6Question(this.unit['id'], 'OUTFLOW'),
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
          environment.services.step6Question(this.unit['id'], 'OUTFLOW'),
          this.data,
          'put'
        )
      )
      .subscribe((res) => {
        this.commonService.step6ActiveCase.next('strategy');
        this.flowComplate('CTI_STEP6_OUTFLOW');
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

  next() {
    const list = [];
    this.flowList.forEach((element) => {
      const item = {
        flowImprovementUuid: element.flowImprovementUuid,
        flowRiskUuid: element.flowRiskUuid === '0' ? '' : element.flowRiskUuid,
        flowOpportunityUuid:
          element.flowOpportunityUuid === '0'
            ? ''
            : element.flowOpportunityUuid,
        flowRiskOtherText:
          element.flowRiskUuid !== 'c6f30f89-64d7-4796-8273-8e95fcc02424'
            ? ' '
            : element.flowRiskOtherName,
        flowOpportunityOtherText:
          element.flowOpportunityUuid !== '0c82a6e3-9f6b-4fb8-a827-c538b524ed97'
            ? ' '
            : element.flowOpportunityOtherName,
      };
      list.push(item);
    });
    const data = {
      flowStrategy: list,
    };
    this.http
      .callService(
        new Method(
          environment.services.saveFlowStrategies(this.unit['id']),
          data,
          'put'
        )
      )
      .subscribe((res) => {
        this.commonService.step6ActiveCase.next('strategy');
        this.flowComplate('CTI_STEP6_OUTFLOW');
      });
  }
}
