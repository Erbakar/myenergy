import { Component } from '@angular/core';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '@env/environment';
import { BoxesComponent } from '../boxes.component';
@Component({
  selector: 'app-revenue-confirm',
  templateUrl: './revenue-confirm.component.html',
  styleUrls: ['./revenue-confirm.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class RevenueConfirm {
  res;
  cmpBoxShow = false;
  selectedUnitDetails;
  selectedUnit;
  unitId;
  selectedUnitId;
  data;
  revenue = new FormGroup({
    budget: new FormControl(''),
    currency: new FormControl(''),
  });
  constructor(
    private http: ApiRequestService,
    private boxesComponent: BoxesComponent
  ) {
    this.selectedUnitDetails = JSON.parse(localStorage.getItem('selectedUnit'));
    this.unitId = localStorage.getItem('unitId');
    if (this.unitId) {
      this.getProductivity();
    }
  }
  currencyTypeChange(type: any) {
    this.selectedUnitDetails.currencyType = type;
  }
  onSubmit() {
    this.http
      .callService(
        new Method(
          environment.services.productivity(this.unitId),
          this.revenue.value,
          'put'
        )
      )
      .subscribe((res) => {
        this.getProductivity();
        this.boxesComponent.modalSave();
      });
  }

  getProductivity() {
    this.http
      .callService(
        new Method(environment.services.productivity(this.unitId), '', 'get')
      )
      .subscribe((res) => {
        this.data = res;
        this.revenue.patchValue({
          budget: res['budget'],
          currency: res['currency'],
        });
      });
  }
  unitChangeEvent(q: any) {
    this.revenue.patchValue({
      currency: q,
    });
  }
  cancel() {
    this.boxesComponent.hideModal();
  }
}
