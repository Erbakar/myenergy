import { Component, OnDestroy } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../assets/javascript/patica';
declare var $: any;
@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss'],
})
export class Step5Component implements OnDestroy {
  activeCase = 'inflow-question';
  isShowstep5Intro;
  constructor(private commonService: CommonService) {
    hidePatica();
    this.isShowstep5Intro = localStorage.getItem('isShowstep5Intro');
    this.commonService.step5ActiveCase.subscribe((res) => {
      this.activeCase = res;
      $('.patica-sidebar').addClass('sub-page');
    });
    this.commonService.isShowstep5Intro.subscribe((res) => {
      this.isShowstep5Intro = res;
    });
  }
  ngOnDestroy() {
    this.commonService.step5ActiveCase.next('inflow-question');
    this.commonService.openPatica.next(false);
    hidePatica();
    $('.patica-sidebar').removeClass('sub-page');
  }
}
