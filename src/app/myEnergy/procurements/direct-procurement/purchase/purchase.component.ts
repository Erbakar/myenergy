import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { ConfirmDialog } from '@app/shared/dialog/confirm-dialog/confirm-dialog.component';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { ProcurementsService } from '../../procurements.service';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM/YYYY',
  },
  display: {
    dateInput: 'MMM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY',
  },
};
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PurchasComponent {
  date = new FormControl(moment());
  activePurchasTab = 0;
  labelsButtonActive = false;
  labelsData;
  labelUuids;
  mounthList = [
    { name: 'January', num: '1' },
    { name: 'February', num: '2' },
    { name: 'March', num: '3' },
    { name: 'April', num: '4' },
    { name: 'May', num: '5' },
    { name: 'June', num: '6' },
    { name: 'July', num: '7' },
    { name: 'August', num: '8' },
    { name: 'September', num: '9' },
    { name: 'October', num: '10' },
    { name: 'November', num: '11' },
    { name: 'December', num: '12' },
  ];
  yearList = Array.from(
    { length: 5 },
    (v, i) => new Date().getFullYear() - 2 + i + 1
  );
  currentDate = moment(new Date());
  productId;
  purchaseId;
  subCategories;
  categoryData;
  MYE2;
  MYE3;
  MYE4;
  MYE5;
  MYE9;
  detailData;
  showLabelsForm = false;
  detailForm: FormGroup;
  labelsForm: FormGroup;
  dataForm: FormGroup;
  controls;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public procurementsService: ProcurementsService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private http: ApiRequestService
  ) {
    this.createDetailForm();
    this.createDataForm();
    this.procurementsService.getCategory().then((res) => {
      this.categoryData = res;
      sessionStorage.setItem('categoryData', JSON.stringify(this.categoryData));
    });
    this.router.events.subscribe(async (val) => {
      if (val instanceof NavigationEnd) {
        const routeParams = this.activatedRoute.snapshot.paramMap;
        this.productId = routeParams.get('productId');
        this.purchaseId = routeParams.get('purchaseId');
        if (this.purchaseId !== 'new' && !this.detailForm.value.name) {
          this.procurementsService
            .purchaseDetail(this.purchaseId, '', 'get')
            .then((res) => {
              this.detailData = res;
              this.MYE2 = this.detailData.products[0]?.answers?.MYE2;
              this.MYE3 = this.detailData.products[0]?.answers?.MYE3;
              this.MYE4 = this.detailData.products[0]?.answers?.MYE4;
              this.MYE5 = this.detailData.products[0]?.answers?.MYE5;
              this.MYE9 = this.detailData.products[0]?.answers?.MYE9;
              this.detailData.purchaseDate = new Date(
                this.detailData.purchaseDate
              );
              this.selectedCategory(this.detailData.purchase.categoryId);
              if (this.detailData.products[0].answers) {
                this.createDataForm();
              }
              if (this.detailData.purchaseDate) {
                this.date.setValue(new Date(this.detailData.purchaseDate));
              }
              this.createDetailForm();
            });
        }
        if (this.router.url.indexOf('detail') > -1) {
          this.activePurchasTab = 0;
        }
        if (this.router.url.indexOf('labels') > -1) {
          this.activePurchasTab = 1;
          if (!this.labelsData) {
            this.getLabels();
          }
        }
        if (this.router.url.indexOf('data') > -1) {
          this.activePurchasTab = 2;
        }
      }
    });
  }
  close() {
    alert('what will happen when this button is click?');
  }
  selectedCategory(categoryId: any) {
    if (this.categoryData) {
      this.categoryData.forEach((element) => {
        if (element.uuid === categoryId) {
          this.subCategories = element.subCategories;
        }
      });
    }
  }
  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  // first tab save
  productDetailSave() {
    this.detailForm.value.purchaseDate = new Date();
    this.detailForm.value.purchaseDate.setMonth(this.detailForm.value.mounth);
    this.detailForm.value.purchaseDate.setFullYear(this.detailForm.value.year);
    this.detailForm.value.state = 'IN_PROGRESS';
    delete this.detailForm.value.mounth;
    delete this.detailForm.value.year;
    // this.detailForm.value.purchaseDate = this.date.value._d;
    if (this.purchaseId === 'new') {
      const data = this.detailForm.value;
      this.http
        .callService(
          new Method(
            environment.myEnergyServices.procurementPurchase(),
            data,
            'post'
          )
        )
        .subscribe((res) => {
          this.subsEvent(res);
        });
    } else {
      this.detailForm.value.product_subcategory_uuid = this.detailForm.value.subCategoryId;
      this.detailForm.value.uuid = this.purchaseId;
      delete this.detailForm.value.categoryId;
      delete this.detailForm.value.subCategoryId;
      const data = this.detailForm.value;
      this.procurementsService.purchase(data, 'put').then((res) => {
        this.subsEvent(res);
      });
    }
  }
  subsEvent(res: any) {
    this.detailData = res;
    const pathData = `myenergy/purchases/direct-procurement/purchase/${res.purchase.uuid}/detail/${res.products[0].uuid}`;
    this.router.navigate([pathData]);
    this.activePurchasTab = 1;
    this.getLabels();
    const pathLabel = `myenergy/purchases/direct-procurement/purchase/${res.purchase.uuid}/labels/${res.products[0].uuid}`;
    setTimeout(() => {
      this.router.navigate([pathLabel]);
    }, 500);
  }

  // second tab events
  getLabels() {
    this.procurementsService.getLabels().then(async (res) => {
      this.labelsData = res;
      if (this.detailData) {
        if (this.detailData.products[0].labels) {
          this.labelsButtonActive = true;
          await this.labelsData.forEach((label) => {
            this.detailData.products[0].labels.forEach((selectedLabel) => {
              if (label.uuid === selectedLabel.uuid) {
                label.isselected = true;
              }
            });
          });
        }
        await this.createLabelsForm();
      } else {
        this.getLabels();
      }
    });
  }
  selectLabelList() {
    this.labelUuids = [];
    for (const [key, value] of Object.entries(this.labelsForm.value.labels)) {
      if (value === true) {
        this.labelUuids.push(key);
      }
      this.labelsButtonActive = this.labelUuids.length > 0 ? true : false;
    }
  }
  labelsSubmit() {
    const data = { productUuid: this.productId, labelUuids: this.labelUuids };
    this.procurementsService.putLabels(data);
    this.activePurchasTab = 2;
    const path = `myenergy/purchases/direct-procurement/purchase/${this.purchaseId}/data/${this.productId}`;
    setTimeout(() => {
      this.router.navigate([path]);
    }, 500);
  }

  // last tab events
  async productDataSave() {
    const answerArray = [];
    for (const [key, value] of Object.entries(this.dataForm.value)) {
      answerArray.push({ code: key, text: value });
    }
    const data = {
      answers: answerArray,
      productUuid: this.productId,
    };
    this.procurementsService.questionnaire(data, 'put');
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '80%',
      maxWidth: '680px',
      data: {
        title: `Confirm new purchase?`,
        message:
          'Go back to edit purchase information or confirm to add it to the platform.',
        yesButtonText: 'CONFIRM',
        noButtonText: 'GO BACK',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.procurementsService
          .purchaseConfirm(this.purchaseId, {})
          .then((res) => {
            this.router.navigate([
              '/myenergy/purchases/direct-procurement/overview/',
              this.purchaseId,
            ]);
          });
      } catch (error) {}
    });
  }

  // all forms event
  private createDetailForm() {
    this.detailForm = this.formBuilder.group({
      name: [
        this.detailData ? this.detailData.purchase.name : '',
        Validators.required,
      ],
      categoryId: [
        this.detailData
          ? this.detailData.purchase.categoryId
          : 'Choose a category',
        Validators.required,
      ],
      subCategoryId: [
        this.detailData
          ? this.detailData.purchase.subCategoryId
          : 'Choose a sub-category',
        Validators.required,
      ],
      mounth: [
        this.detailData
          ? String(new Date(this.detailData.purchase.purchaseDate).getMonth())
          : this.currentDate.format('M'),
        Validators.required,
      ],
      year: [
        this.detailData
          ? new Date(this.detailData.purchase.purchaseDate).getFullYear()
          : Number(this.currentDate.format('YYYY')),
        Validators.required,
      ],
      purchaseDate: [''],
      quantity: [
        this.detailData ? this.detailData.purchase.quantity : '',
        Validators.required,
      ],
      period: [
        this.detailData ? this.detailData.purchase.period : 'NONE',
        Validators.required,
      ],
      budget: [
        this.detailData ? this.detailData.purchase.budget : '',
        Validators.required,
      ],
    });
  }
  private createLabelsForm() {
    this.controls = {};
    this.labelsData.forEach((label) => {
      this.controls[label.uuid] = new FormControl(
        label.isselected ? label.isselected : false
      );
    });
    this.labelsForm = this.formBuilder.group({
      labels: this.formBuilder.group(this.controls),
    });
    this.showLabelsForm = true;
  }
  private createDataForm() {
    this.dataForm = this.formBuilder.group({
      MYE1: [this.detailData ? this.detailData.products[0].answers.MYE1 : ''],
      MYE2: [this.detailData ? this.detailData.products[0].answers.MYE2 : ''],
      MYE3: [this.detailData ? this.detailData.products[0].answers.MYE3 : ''],
      MYE4: [this.detailData ? this.detailData.products[0].answers.MYE4 : ''],
      MYE5: [this.detailData ? this.detailData.products[0].answers.MYE5 : ''],
      MYE6: [this.detailData ? this.detailData.products[0].answers.MYE6 : ''],
      MYE7: [this.detailData ? this.detailData.products[0].answers.MYE7 : ''],
      MYE8: [this.detailData ? this.detailData.products[0].answers.MYE8 : ''],
      MYE9: [this.detailData ? this.detailData.products[0].answers.MYE9 : ''],
    });
  }
}
