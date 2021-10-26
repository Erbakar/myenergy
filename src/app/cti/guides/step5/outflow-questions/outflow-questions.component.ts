import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../../assets/javascript/patica';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { CommonService } from '@app/core/common.service';
declare var $: any;

@Component({
  selector: 'app-outflow-questions',
  templateUrl: './outflow-questions.component.html',
  styleUrls: ['./outflow-questions.component.scss'],
})
export class OutflowQuestionsComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  rightItems;
  outflowCircularPercentage;
  unit;
  constructor(
    private formBuilder: FormBuilder,
    private http: ApiRequestService,
    private commonService: CommonService
  ) {
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
  }
  ngOnDestroy() {
    hidePatica();
  }

  goToPatica(path: any, module: String) {
    goToModulePatica(path, module);
  }

  ngOnInit() {
    openPatica();
    goToModulePatica(8, '2938190fa6aef02ce2f07a90a8a41d73');
    $('.patica-sidebar').addClass('sub-page');

    this.http
      .callService(
        new Method(
          environment.services.improvement(this.unit['id'], 'OUTFLOW'),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.rightItems = res;
        this.createForm();
      });
    this.http
      .callService(
        new Method(environment.services.graph(this.unit['id']), '', 'get')
      )
      .subscribe((res) => {
        this.outflowCircularPercentage = res['outflowCircularPercentage'];
      });
  }
  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unit['id'] }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unit['id']);
      });
  }
  submit() {
    const data = {
      why: this.registerForm.value.why,
      expect: this.registerForm.value.expect,
      whyExpect: this.registerForm.value.whyExpect,
      focus: this.registerForm.value.focus,
      whyFocus: this.registerForm.value.whyFocus,
      limitations: this.registerForm.value.limitations,
      whyLimitations: this.registerForm.value.whyLimitations,
    };
    this.http
      .callService(
        new Method(
          environment.services.improvementQuestiont(this.unit['id'], 'OUTFLOW'),
          data,
          'put'
        )
      )
      .subscribe((res) => {
        this.flowComplate('CTI_STEP5_OUTFLOW_QUESTIONS');
        this.commonService.step5ActiveCase.next('outflow');
      });
  }
  private createForm() {
    this.registerForm = this.formBuilder.group({
      why: [this.rightItems ? this.rightItems.why : '', Validators.required],
      expect: [this.rightItems ? this.rightItems.expect : ''],
      whyExpect: [this.rightItems ? this.rightItems.whyExpect : ''],
      focus: [this.rightItems ? this.rightItems.focus : ''],
      whyFocus: [this.rightItems ? this.rightItems.whyFocus : ''],
      limitations: [this.rightItems ? this.rightItems.limitations : ''],
      whyLimitations: [this.rightItems ? this.rightItems.whyLimitations : ''],
    });
  }
}
