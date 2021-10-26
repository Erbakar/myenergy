import { Component, OnDestroy } from '@angular/core';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../../assets/javascript/patica';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { CommonService } from '@app/core/common.service';
declare var $: any;
@Component({
  selector: 'app-energy-analysis',
  templateUrl: './energy-analysis.component.html',
  styleUrls: ['./energy-analysis.component.scss'],
})
export class EnergyAnalysisComponent implements OnDestroy {
  data;
  unit;
  unitId;
  environment = environment;
  selectedOperation;
  renewableChange = false;
  totalChange = false;
  diffrent = null;
  renewableEnergyConsumption = null;
  totalEnergyConsumption = null;
  constructor(
    private http: ApiRequestService,
    private commonService: CommonService
  ) {
    this.unitId = localStorage.getItem('unitId');
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.onReady();
  }

  onReady() {
    openPatica();
    goToModulePatica(8, '6b7adef87e144dea43b209c3ca86f34c');
    $('.patica-sidebar').addClass('sub-page');
    this.http
      .callService(
        new Method(
          environment.services.energyImprovement(this.unit['id']),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.data = res;
        this.data['renewableChangeValue'] = this.data[
          'currentRenewableEnergyConsumption'
        ];
        this.data['totalChangeValue'] = this.data[
          'currentTotalEnergyConsumption'
        ];
        this.renewableEnergyConsumption = this.data.renewableEnergyConsumptionDelta;
        this.totalEnergyConsumption = this.data.totalEnergyConsumptionDelta;
      });
  }

  openCalculete(type: string) {
    this.selectedOperation = false;
    this.diffrent = null;
    if (type === 'renewableChange') {
      this.renewableChange = !this.renewableChange;
      this.totalChange = false;
    } else if (type === 'totalChange') {
      this.totalChange = !this.totalChange;
      this.renewableChange = false;
    }
  }
  calculateDone() {
    this.renewableChange = false;
    this.totalChange = false;
    const pure = {
      renewableEnergyConsumptionDelta: this.renewableEnergyConsumption,
      totalEnergyConsumptionDelta: this.totalEnergyConsumption,
    };
    this.http
      .callService(
        new Method(
          environment.services.energyImprovement(this.unit['id']),
          pure,
          'put'
        )
      )
      .subscribe((res) => {
        this.data = res;
        this.data['renewableChangeValue'] = this.data[
          'currentRenewableEnergyConsumption'
        ];
        this.data['totalChangeValue'] = this.data[
          'currentTotalEnergyConsumption'
        ];
      });
  }
  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unitId }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unitId);
      });
  }

  submit() {
    this.flowComplate('CTI_STEP5_ENERGY');
    this.commonService.step5ActiveCase.next('waterAnalaysis');
  }

  setRenewable(value: number, dif: number, target: string) {
    this.calculate(value, dif, target);
  }
  setTotal(value: number, dif: number, target: string) {
    this.calculate(value, dif, target);
  }
  setOperation(set: string, value: number, dif: number, target: string) {
    this.selectedOperation = set;
    this.calculate(value, dif, target);
  }

  calculate(value: number, dif: number, target: string) {
    if (target === 'renewableChange') {
      if (this.selectedOperation === '-') {
        this.data['renewableChangeValue'] = Number(value) - Number(dif);
      } else if (this.selectedOperation === '+') {
        this.data['renewableChangeValue'] = Number(value) + Number(dif);
      }
      this.renewableEnergyConsumption =
        this.selectedOperation === '-' ? Number(-dif) : Number(dif);
    }
    if (target === 'totalChange') {
      if (this.selectedOperation === '-') {
        this.data['totalChangeValue'] = Number(value) - Number(dif);
      } else if (this.selectedOperation === '+') {
        this.data['totalChangeValue'] = Number(value) + Number(dif);
      }
      this.totalEnergyConsumption =
        this.selectedOperation === '-' ? Number(-dif) : Number(dif);
    }
  }

  ngOnDestroy() {
    this.commonService.openPatica.next(false);
    hidePatica();
  }
}
