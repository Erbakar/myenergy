import { Component } from '@angular/core';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { FormControl, FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import { BoxesComponent } from '../boxes.component';
@Component({
  selector: 'app-water-confirm',
  templateUrl: './water-confirm.component.html',
  styleUrls: ['./water-confirm.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class WaterConfirm {
  unitId = '';
  test;
  data;
  water = new FormGroup({
    circularWaterWithdrawal: new FormControl(''),
    totalWaterWithdrawal: new FormControl(''),
    circularWaterDischarge: new FormControl(''),
    waterUnit: new FormControl(''),
  });

  constructor(
    private http: ApiRequestService,
    private boxesComponent: BoxesComponent
  ) {
    this.unitId = localStorage.getItem('unitId');
    if (this.unitId) {
      this.getWater(this.unitId);
    }
  }

  onSubmit() {
    this.http
      .callService(
        new Method(
          environment.services.unitWater(this.unitId),
          this.water.value,
          'put'
        )
      )
      .subscribe((res) => {
        this.getWater(this.unitId);
        this.boxesComponent.modalSave();
      });
  }

  getWater(id: string) {
    this.http
      .callService(new Method(environment.services.unitWater(id), '', 'get'))
      .subscribe((res) => {
        this.data = res;
        this.test = res['totalWaterWithdrawal'];
        this.water.patchValue({
          circularWaterWithdrawal: res['circularWaterWithdrawal'],
          totalWaterWithdrawal: res['totalWaterWithdrawal'],
          circularWaterDischarge: res['circularWaterDischarge'],
          waterUnit: res['waterUnit'] || 'l',
        });
      });
  }

  unitChangeEvent(q: any) {
    this.water.patchValue({
      waterUnit: q,
    });
  }
  cancel() {
    this.boxesComponent.hideModal();
  }
}
