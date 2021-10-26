import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-productivity',
  templateUrl: './productivity.component.html',
  styleUrls: ['./productivity.component.scss'],
})
export class ProductivityComponent implements OnInit {
  data;
  cmpBoxShow = false;
  selectedUnitDetails;
  selectedUnit;
  selectedUnitId;
  whichIsShow;
  constructor(
    private commonServise: CommonService,
    private http: ApiRequestService
  ) {
    this.commonServise.selectedUnit.subscribe((unit) => {
      if (unit['id'] !== this.selectedUnitId) {
        this.selectedUnitId = unit['id'];
        this.selectedUnit = unit;
        this.selectedUnitDetails = unit['details'];
        if (this.selectedUnitId['budget'] > 0) {
          this.whichIsShow = true;
        } else {
          this.whichIsShow = false;
        }
        this.productivity();
        this.cmpBoxShow = JSON.parse(
          sessionStorage.getItem('Inicators')
        ).circularMaterialProductivity;
      }
    });
  }
  currencyTypeChange(type: any) {
    this.selectedUnitDetails.currencyType = type;
  }

  setBudget() {
    this.http
      .callService(
        new Method(
          environment.services.unitDetail(this.selectedUnitId),
          this.selectedUnitDetails,
          'put'
        )
      )
      .subscribe((res) => {
        this.whichIsShow = false;
        this.productivity();
      });
  }

  productivity() {
    this.http
      .callService(
        new Method(
          environment.services.productivity(this.selectedUnitId),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.data = res;
      });
  }
  ngOnInit() {}
}
