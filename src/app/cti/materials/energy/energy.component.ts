import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonService } from '@app/core/common.service';
import { goToModulePatica } from '../../../../assets/javascript/patica';

@Component({
  selector: 'app-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.scss'],
})
export class EnergyComponent implements OnInit {
  energyValue;
  energyBoxShow = false;
  unitId = '';
  whichIsShow;
  renewableEnergy;
  data;
  selectedUnit;
  selectedUnitId;
  energy = new FormGroup({
    renewableEnergyConsumption: new FormControl(''),
    totalEnergyConsumption: new FormControl(''),
    energyUnit: new FormControl(''),
  });

  constructor(
    private http: ApiRequestService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.unitId = localStorage.getItem('unitId');
    if (this.unitId) {
      this.getEnergy(this.unitId);
      this.energyBoxShow = JSON.parse(
        sessionStorage.getItem('Inicators')
      ).renewableEnergy;
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
      });
  }

  getEnergy(id: string) {
    this.http
      .callService(new Method(environment.services.energy(id), '', 'get'))
      .subscribe((res) => {
        this.energyValue = res;
        if (
          res['renewableEnergyConsumption'] &&
          res['totalEnergyConsumption']
        ) {
          this.whichIsShow = true;
          // this.renewableEnergy = this.energyValue.renewableEnergyConsumption / this.energyValue.totalEnergyConsumption;
        } else {
          this.whichIsShow = false;
        }
        this.energy.patchValue({
          renewableEnergyConsumption: res['renewableEnergyConsumption'],
          totalEnergyConsumption: res['totalEnergyConsumption'],
          energyUnit: res['energyUnit'],
        });
      });
  }
  goToPatica(p: any, m: String) {
    goToModulePatica(p, m);
    this.whichIsShow = false;
  }
  unitChangeEvent(q: any) {
    this.energy.patchValue({
      energyUnit: q,
    });
  }
}
