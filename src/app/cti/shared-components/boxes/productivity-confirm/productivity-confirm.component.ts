import { Component } from '@angular/core';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '@env/environment';
import { BoxesComponent } from '../boxes.component';
@Component({
  selector: 'app-productivity-confirm',
  templateUrl: './productivity-confirm.component.html',
  styleUrls: ['./productivity-confirm.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class ProductivityConfirm {
  res;
  cmpBoxShow = false;
  selectedUnitDetails;
  selectedUnit;
  unitId;
  selectedUnitId;
  data;
  productivity = new FormGroup({
    budget: new FormControl(''),
    linearInflowWeight: new FormControl(''),
    currency: new FormControl(''),
    mass: new FormControl(''),
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
          this.productivity.value,
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
        this.productivity.patchValue({
          budget: res['budget'],
          linearInflowWeight: res['linearInflowWeight'],
          currency: res['currency'],
          mass: 'kg',
        });
      });
  }
  unitChangeEvent(q: any) {
    this.productivity.patchValue({
      currency: q,
    });
  }
  cancel() {
    this.boxesComponent.hideModal();
  }
}
