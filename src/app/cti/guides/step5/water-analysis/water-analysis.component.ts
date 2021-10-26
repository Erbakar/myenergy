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
  selector: 'app-water-analysis',
  templateUrl: './water-analysis.component.html',
  styleUrls: ['./water-analysis.component.scss'],
})
export class WaterAnalysisComponent implements OnDestroy {
  data;
  onSiteWaterCirculation;
  unit;
  unitId;
  environment = environment;
  selectedOperation;
  withdrawalChange = false;
  dischargeChange = false;
  waterChange = false;
  totalWaterChange = false;
  diffrent = null;
  circularWaterWithdrawal = null;
  circularWaterDischarge = null;
  currentWater = null;
  currentTotalWater = null;
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
          environment.services.waterImprovement(this.unit['id']),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.data = res;
        this.data['withdrawalChangeValue'] = this.data[
          'currentCircularWaterWithdrawal'
        ];
        this.data['dischargeChangeValue'] = this.data[
          'currentCircularWaterDischarge'
        ];
        this.data['waterChangeValue'] = this.data['currentWaterUse'];
        this.data['totalWaterChange'] = this.data[
          'currentTotalWaterWithdrawal'
        ];
        this.circularWaterWithdrawal = this.data.circularWaterWithdrawalDelta;
        this.circularWaterDischarge = this.data.circularWaterDischargeDelta;
        this.currentWater = this.data.totalWaterUseDelta;
        this.currentTotalWater = this.data.totalWaterWithdrawalDelta;
      });

    this.http
      .callService(
        new Method(environment.services.unitDetailed(this.unitId), '', 'get')
      )
      .subscribe((res) => {
        this.onSiteWaterCirculation =
          res['indicators']['onSiteWaterCirculation'];
      });
  }

  openCalculete(type: string) {
    this.selectedOperation = false;
    this.diffrent = null;
    if (type === 'withdrawalChange') {
      this.withdrawalChange = !this.withdrawalChange;
      this.dischargeChange = false;
      this.waterChange = false;
      this.totalWaterChange = false;
    } else if (type === 'dischargeChange') {
      this.dischargeChange = !this.dischargeChange;
      this.withdrawalChange = false;
      this.waterChange = false;
      this.totalWaterChange = false;
    } else if (type === 'waterChange') {
      this.waterChange = !this.waterChange;
      this.withdrawalChange = false;
      this.dischargeChange = false;
      this.totalWaterChange = false;
    } else if (type === 'totalWaterChange') {
      this.totalWaterChange = !this.totalWaterChange;
      this.withdrawalChange = false;
      this.dischargeChange = false;
      this.waterChange = false;
    }
  }
  calculateDone() {
    this.withdrawalChange = false;
    this.dischargeChange = false;
    this.waterChange = false;
    this.totalWaterChange = false;
    const pure = {
      circularWaterWithdrawalDelta: this.circularWaterWithdrawal,
      circularWaterDischargeDelta: this.circularWaterDischarge,
      totalWaterUseDelta: this.currentWater,
      totalWaterWithdrawalDelta: this.currentTotalWater,
    };
    this.http
      .callService(
        new Method(
          environment.services.waterImprovement(this.unit['id']),
          pure,
          'put'
        )
      )
      .subscribe((res) => {
        this.data = res;
        this.data['withdrawalChangeValue'] = this.data[
          'currentCircularWaterWithdrawal'
        ];
        this.data['dischargeChangeValue'] = this.data[
          'currentCircularWaterDischarge'
        ];
        this.data['waterChangeValue'] = this.data['currentWaterUse'];
        this.data['totalWaterChange'] = this.data[
          'currentTotalWaterWithdrawal'
        ];
      });
  }
  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unitId }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unit['id']);
      });
  }

  submit() {
    this.flowComplate('CTI_STEP5_WATER');
    this.commonService.step5ActiveCase.next('step5Download');
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
    if (target === 'withdrawalChange') {
      if (this.selectedOperation === '-') {
        this.data['withdrawalChangeValue'] = Number(value) - Number(dif);
      } else if (this.selectedOperation === '+') {
        this.data['withdrawalChangeValue'] = Number(value) + Number(dif);
      }
      this.circularWaterWithdrawal =
        this.selectedOperation === '-' ? Number(-dif) : Number(dif);
    }
    if (target === 'dischargeChange') {
      if (this.selectedOperation === '-') {
        this.data['dischargeChangeValue'] = Number(value) - Number(dif);
      } else if (this.selectedOperation === '+') {
        this.data['dischargeChangeValue'] = Number(value) + Number(dif);
      }
      this.circularWaterDischarge =
        this.selectedOperation === '-' ? Number(-dif) : Number(dif);
    }
    if (target === 'waterChange') {
      if (this.selectedOperation === '-') {
        this.data['waterChangeValue'] = Number(value) - Number(dif);
      } else if (this.selectedOperation === '+') {
        this.data['waterChangeValue'] = Number(value) + Number(dif);
      }
      this.currentWater =
        this.selectedOperation === '-' ? Number(-dif) : Number(dif);
    }
    if (target === 'totalWaterChange') {
      if (this.selectedOperation === '-') {
        this.data['totalWaterChangeValue'] = Number(value) - Number(dif);
      } else if (this.selectedOperation === '+') {
        this.data['totalWaterChangeValue'] = Number(value) + Number(dif);
      }
      this.currentTotalWater =
        this.selectedOperation === '-' ? Number(-dif) : Number(dif);
    }
  }

  ngOnDestroy() {
    this.commonService.openPatica.next(false);
    hidePatica();
  }
}
