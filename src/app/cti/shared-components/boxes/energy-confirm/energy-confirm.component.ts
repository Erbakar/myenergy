import { Component } from '@angular/core';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '@env/environment';
import { BoxesComponent } from '../boxes.component';
@Component({
  selector: 'app-energy-confirm',
  templateUrl: './energy-confirm.component.html',
  styleUrls: ['./energy-confirm.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class EnergyConfirm {
  unitId = '';
  energyValue;
  energy = new FormGroup({
    renewableEnergyConsumption: new FormControl(''),
    totalEnergyConsumption: new FormControl(''),
    energyUnit: new FormControl(''),
  });
  // tslint:disable-next-line:typedef
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
          environment.services.energy(this.unitId),
          this.energy.value,
          'put'
        )
      )
      .subscribe((res) => {
        this.getEnergy(this.unitId);
        this.boxesComponent.modalSave();
      });
  }
  cancel() {
    this.boxesComponent.hideModal();
  }

  getEnergy(id: string) {
    this.http
      .callService(new Method(environment.services.energy(id), '', 'get'))
      .subscribe((res) => {
        this.energyValue = res;
        this.energy.patchValue({
          renewableEnergyConsumption: res['renewableEnergyConsumption'],
          totalEnergyConsumption: res['totalEnergyConsumption'],
          energyUnit: res['energyUnit'],
        });
      });
  }
  unitChangeEvent(q: any) {
    this.energy.patchValue({
      energyUnit: q,
    });
  }
}
