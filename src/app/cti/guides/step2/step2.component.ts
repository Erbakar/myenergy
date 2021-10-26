import { Component, OnDestroy } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import {
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../assets/javascript/patica';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnDestroy {
  data;
  unit;
  selectedUnitId;
  selectedProduct;
  constructor(
    private commonService: CommonService,
    private http: ApiRequestService,
    public router: Router,
    private location: Location
  ) {
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.selectedUnitId = this.unit['id'];
    goToModulePatica(5, '25cc38d6c83b273d275bc186bc33d20a');
    openPatica();

    this.commonService.selectedUnit.subscribe((unit) => {
      this.unit = unit;
      this.selectedUnitId = unit['id'];
    });
    this.ctiStep2Inicators();
    const local = this.location.getState();
    this.selectedProduct = local['selectedProduct'] || null;
  }
  ngOnDestroy() {
    hidePatica();
  }
  ctiStep2Inicators() {
    this.http
      .callService(
        new Method(
          environment.services.ctiStep2Inicators(this.selectedUnitId),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.data = res;
      });
  }
  saveStep2(data: any) {
    this.http
      .callService(
        new Method(
          environment.services.ctiStep2Inicators(this.selectedUnitId),
          data,
          'put'
        )
      )
      .subscribe((res) => {
        sessionStorage.setItem('Inicators', JSON.stringify(data));
        this.commonService.refreshUnitGuindance(this.selectedUnitId);
        this.router.navigate(['/cti/guide/step3']);
      });
  }
}
