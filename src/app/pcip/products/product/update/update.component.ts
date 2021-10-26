import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { findIndex } from 'rxjs/operators';
import { timeout } from 'q';
export interface PRODUCT {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit {
  data;
  productId;
  constructor(
    public commonService: CommonService,
    public router: Router,
    public route: ActivatedRoute,
    public http: ApiRequestService
  ) {
    this.commonService.breadcrumbTwo.next('Update');
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.productId = params.get('id');
      sessionStorage.setItem('productId', this.productId);
      this.productSummary(this.productId, false);
    });
  }

  productSummary(id: any, status: Boolean) {
    this.http
      .callService(
        new Method(environment.services.productSummary(id, status), '', 'get')
      )
      .subscribe((res) => {
        this.data = res;
        sessionStorage.setItem(
          'questionnaireId',
          this.data['questionnaire']['questionnaireId']
        );
        sessionStorage.setItem(
          'categories',
          this.data['questionnaire']['categories']
        );
      });
  }
}
