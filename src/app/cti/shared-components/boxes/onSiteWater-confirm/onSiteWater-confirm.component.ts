import { Component } from '@angular/core';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '@env/environment';
import { BoxesComponent } from '../boxes.component';
@Component({
  selector: 'app-onsitewater-confirm',
  templateUrl: './onSiteWater-confirm.component.html',
  styleUrls: ['./onSiteWater-confirm.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class OnSiteWaterConfirm {
  unitId = '';
  data;
  onsiteWater = new FormGroup({
    totalWaterUse: new FormControl(''),
    totalWaterWithdrawal: new FormControl(''),
    waterUnit: new FormControl(''),
  });
  constructor(
    private http: ApiRequestService,
    private boxesComponent: BoxesComponent
  ) {
    this.unitId = localStorage.getItem('unitId');
    if (this.unitId) {
      this.getEnergy(this.unitId);
    }
  }

  onSubmit() {
    this.http
      .callService(
        new Method(
          environment.services.unitOnsiteWater(this.unitId),
          this.onsiteWater.value,
          'put'
        )
      )
      .subscribe((res) => {
        this.getEnergy(this.unitId);
        this.boxesComponent.modalSave();
      });
  }

  getEnergy(id: string) {
    this.http
      .callService(
        new Method(environment.services.unitOnsiteWater(id), '', 'get')
      )
      .subscribe((res) => {
        this.data = res;
        this.onsiteWater.patchValue({
          totalWaterUse: res['totalWaterUse'],
          totalWaterWithdrawal: res['totalWaterWithdrawal'],
          waterUnit: res['waterUnit'] || 'l',
        });
      });
  }

  unitChangeEvent(q: any) {
    this.onsiteWater.patchValue({
      waterUnit: q,
    });
  }
  cancel() {
    this.boxesComponent.hideModal();
  }
}
