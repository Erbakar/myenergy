import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../assets/javascript/patica';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  businessLevels = [
    'Select business level',
    'Company level',
    'Business unit',
    'Product line',
    'Site location',
  ];
  scroll;
  data;
  unitId = localStorage.getItem('unitId');
  energyBoxShow = [false, false, false, false, false, false, false];
  energyTooltip = false;
  waterTooltip = false;
  selectedTooltip;
  cmpBoxShow = false;
  environment = environment;
  constructor(
    private commonService: CommonService,
    private http: ApiRequestService,
    private router: Router
  ) {
    this.commonService.openPatica.subscribe((res) => {
      if (res) {
        goToModulePatica(6, ' 1586960736994');
        openPatica();
      } else {
        hidePatica();
      }
    });
    this.unitdetail();
  }

  unitdetail() {
    this.http
      .callService(
        new Method(environment.services.unitDetailed(this.unitId), '', 'get')
      )
      .subscribe((res) => {
        this.data = res;
      });
  }
  tooltipShow(idx: number) {
    this.energyBoxShow.forEach((e, i) => {
      if (i !== idx) {
        this.energyBoxShow[i] = false;
      } else {
        this.energyBoxShow[i] = true;
        setTimeout(() => {
          this.energyBoxShow[i] = false;
        }, 8 * 1000);
      }
    });
  }

  goToTheStep2(item: string) {
    this.router.navigateByUrl('/cti/guide/step2', {
      state: { selectedProduct: item },
    });
  }

  ngOnInit() {
    hidePatica();
  }
  ngOnDestroy() {
    this.commonService.openPatica.next(false);
    hidePatica();
  }
}
