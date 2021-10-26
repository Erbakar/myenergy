import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { Router } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../../assets/javascript/patica';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-step6-critical-material',
  templateUrl: './critical-materials.component.html',
  styleUrls: ['./critical-materials.component.scss'],
})
export class Step6CriticalMaterialComponent implements OnInit, OnDestroy {
  businessForm;
  isShow = false;
  isPatica = false;
  unit;
  flowItems;
  unitId;
  businessCase;
  data;
  controls;
  form: FormGroup;
  constructor(
    private commonService: CommonService,
    public router: Router,
    private fb: FormBuilder,
    private http: ApiRequestService
  ) {
    this.unitId = localStorage.getItem('unitId');
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.commonService.openPatica.subscribe((res) => {
      this.openPatica(res);
    });
  }

  openPatica(res: boolean) {
    if (res) {
      this.isPatica = true;

      goToModulePatica(9, '036e132f6f664b1112f07001b3b96f00');
      openPatica();
    } else {
      this.isPatica = false;
      hidePatica();
    }
  }
  ngOnDestroy() {
    this.commonService.openPatica.next(false);
    hidePatica();
  }
  ngOnInit() {
    this.controls = {};
    this.http
      .callService(
        new Method(
          environment.services.step6Question(this.unit['id'], 'CRITICAL'),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.data = res;
        this.generateForm2();
      });
  }

  generateForm2() {
    for (const [key, value] of Object.entries(this.data)) {
      this.controls[key] = new FormControl(false);
    }
    this.form = this.fb.group({
      question: this.fb.group(this.controls),
    });
    this.isShow = true;
  }

  next2() {
    this.http
      .callService(
        new Method(
          environment.services.step6Question(this.unit['id'], 'CRITICAL'),
          this.data,
          'put'
        )
      )
      .subscribe((res) => {
        this.flowComplate('CTI_STEP6_BUSINESS');
        this.commonService.step6ActiveCase.next('outflow6');
      });
  }

  uncheck(name: string, value: number, oldValue: number) {
    if (value == oldValue) {
      setTimeout(() => {
        this.data[`${name}`] = null;
      }, 50);
    }
  }

  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unitId }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unitId);
      });
  }
}
