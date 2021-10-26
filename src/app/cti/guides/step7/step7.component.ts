import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../assets/javascript/patica';

@Component({
  selector: 'app-step7',
  templateUrl: './step7.component.html',
  styleUrls: ['./step7.component.scss'],
})
export class Step7Component implements OnInit {
  activeCase7 = 'smartTarget';
  isShowstep7Intro;
  constructor(private commonService: CommonService) {
    hidePatica();
    this.commonService.step7ActiveCase.next('smartTarget');
    this.isShowstep7Intro = localStorage.getItem('isShowstep7Intro');
    this.commonService.step7ActiveCase.subscribe((res) => {
      this.activeCase7 = res;
    });
    this.commonService.isShowstep7Intro.subscribe((res) => {
      this.isShowstep7Intro = res;
    });
  }
  ngOnInit() {}
}
