import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class OverviewComponent {
  date = new FormControl(moment());
  detailForm: FormGroup;
  labelsForm: FormGroup;
  dataForm: FormGroup;
  labelsButtonActive = false;
  detailEdit = false;
  labelsEdit = false;
  productData = false;
  showLabelsForm = false;
  showOverview = false;
  labelsData;
  MYE2;
  MYE3;
  MYE4;
  MYE5;
  MYE9;
  labelUuids;
  productId;
  purchaseId;
  subCategories;
  categoryData;
  detailData;
  controls;
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public procurementsService: ProcurementsService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe(async (val) => {
      if (val instanceof NavigationEnd) {
        const routeParams = this.activatedRoute.snapshot.paramMap;
        this.purchaseId = routeParams.get('purchaseId');
        this.getDetail();
      }
    });
  }

  getDetail() {
    this.procurementsService
      .purchaseDetail(this.purchaseId, '', 'get')
      .then((res) => {
        this.detailData = res;
        this.detailData.purchaseDate = new Date(this.detailData.purchaseDate);
        this.MYE2 = this.detailData.products[0]?.answers?.MYE2;
        this.MYE3 = this.detailData.products[0]?.answers?.MYE3;
        this.MYE4 = this.detailData.products[0]?.answers?.MYE4;
        this.MYE5 = this.detailData.products[0]?.answers?.MYE5;
        this.MYE9 = this.detailData.products[0]?.answers?.MYE9;
        this.productId = this.detailData.products[0].uuid;
        this.procurementsService.getCategory().then((resp) => {
          this.categoryData = resp;
          this.categoryData.forEach((element) => {
            if (element.uuid === this.detailData.purchase.categoryId) {
              this.subCategories = element.subCategories;
            }
          });
        });
        this.createDetailForm();
        this.getLabels();
        this.createDataForm();
        this.showOverview = true;
        this.date.setValue(new Date(this.detailData.purchaseDate));
      });
  }

  selectedCategory(categoryId: any) {
    this.categoryData.forEach((element) => {
      if (element.uuid === categoryId) {
        this.subCategories = element.subCategories;
      }
    });
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
  close() {
    alert('what will happen when this button is click?');
  }
  edit() {
    alert('what will happen when this button is click?');
  }
  // first tab save
  detailSave() {
    this.detailEdit = false;
    // this.detailForm.value.purchaseDate = this.date.value._d;
    this.detailForm.value.purchaseDate = new Date();
    this.detailForm.value.purchaseDate.setMonth(this.detailForm.value.mounth);
    this.detailForm.value.purchaseDate.setFullYear(this.detailForm.value.year);
    delete this.detailForm.value.mounth;
    delete this.detailForm.value.year;
    this.detailForm.value.product_subcategory_uuid = this.detailForm.value.subCategoryId;
    this.detailForm.value.uuid = this.purchaseId;
    this.detailForm.value.state = 'IN_PROGRESS';
    delete this.detailForm.value.categoryId;
    delete this.detailForm.value.subCategoryId;
    const data = this.detailForm.value;
    console.log(data);
    this.procurementsService.purchase(data, 'put').then((res) => {
      this.snackBar.open('edited successfully!', '', {
        duration: 5000,
        panelClass: ['success-snackBar'],
      });
    });
  }
  // second tab events
  labelsEditEvent() {
    this.labelsEdit = true;
  }
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
    this.labelsEdit = false;
    this.procurementsService.putLabels(data).then((res) => {
      this.getDetail();
      this.snackBar.open('edited successfully!', '', {
        duration: 5000,
        panelClass: ['success-snackBar'],
      });
    });
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
    this.procurementsService.questionnaire(data, 'put').then((res) => {
      this.productData = false;
      this.snackBar.open('edited successfully!', '', {
        duration: 5000,
        panelClass: ['success-snackBar'],
      });
    });
  }

  // all forms event
  private createDetailForm() {
    console.log(new Date(this.detailData.purchase.purchaseDate).getMonth());
    this.detailForm = this.formBuilder.group({
      name: [this.detailData.purchase.name, Validators.required],
      categoryId: [this.detailData.purchase.categoryId, Validators.required],
      subCategoryId: [
        this.detailData
          ? this.detailData.purchase.subCategoryId
          : 'Choose a sub-category',
        Validators.required,
      ],

      period: [this.detailData.purchase.period, Validators.required],
      quantity: [this.detailData.purchase.quantity, Validators.required],
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
      budget: [this.detailData.purchase.budget, Validators.required],
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
      MYE1: [
        this.detailData.products[0].answers
          ? this.detailData.products[0].answers.MYE1
          : '-',
      ],
      MYE2: [
        this.detailData.products[0].answers
          ? this.detailData.products[0].answers.MYE2
          : '',
      ],
      MYE3: [
        this.detailData.products[0].answers
          ? this.detailData.products[0].answers.MYE3
          : '',
      ],
      MYE4: [
        this.detailData.products[0].answers
          ? this.detailData.products[0].answers.MYE4
          : '',
      ],
      MYE5: [
        this.detailData.products[0].answers
          ? this.detailData.products[0].answers.MYE5
          : '',
      ],
      MYE6: [
        this.detailData.products[0].answers
          ? this.detailData.products[0].answers.MYE6
          : '',
      ],
      MYE7: [
        this.detailData.products[0].answers
          ? this.detailData.products[0].answers.MYE7
          : '',
      ],
      MYE8: [
        this.detailData.products[0].answers
          ? this.detailData.products[0].answers.MYE8
          : '',
      ],
      MYE9: [
        this.detailData.products[0].answers
          ? this.detailData.products[0].answers.MYE9
          : '',
      ],
    });
  }
}
