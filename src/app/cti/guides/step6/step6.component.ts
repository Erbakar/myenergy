import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../assets/javascript/patica';

@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.scss'],
})
export class Step6Component implements OnInit {
  activeCase6 = 'inflow6';
  isShowstep6Intro;
  constructor(private commonService: CommonService) {
    hidePatica();
    this.commonService.step6ActiveCase.next('inflow6');
    this.isShowstep6Intro = localStorage.getItem('isShowstep6Intro');
    this.commonService.step6ActiveCase.subscribe((res) => {
      this.activeCase6 = res;
    });
    this.commonService.isShowstep6Intro.subscribe((res) => {
      this.isShowstep6Intro = res;
    });
  }
  ngOnInit() {}
}
