import { Component } from '@angular/core';
import { CommonService } from '@app/core/common.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent {
  step0;
  step1;
  step2;
  step3;
  step4;
  step5;
  step6;
  step7;
  constructor(private commonService: CommonService) {
    this.commonService.refreshStep.subscribe((res) => {
      console.log('res');
      console.log(res);
      if (res.step7) {
        this.step7 = true;
      } else if (res.step6) {
        this.step6 = true;
      } else if (res.step5) {
        this.step5 = true;
      } else if (res.step4) {
        this.step4 = true;
      } else if (res.step3) {
        this.step3 = true;
      } else if (res.step2) {
        this.step2 = true;
      } else if (res.step1) {
        this.step1 = true;
      } else if (
        res.step1 === false &&
        res.step2 === false &&
        res.step3 === false &&
        res.step4 === false &&
        res.step5 === false &&
        res.step6 === false &&
        res.step7 === false
      ) {
        this.step0 = true;
      }
    });
  }
}
