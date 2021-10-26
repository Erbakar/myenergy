import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent
  implements OnInit, OnChanges, AfterViewChecked {
  @Input() public selectedFlow: string;
  Idies = [];
  firstId;
  lensData;
  get contactFormGroup() {
    return this.form.get('addMultipleAllowed') as FormArray;
  }
  form: FormGroup;
  contactList: FormArray;
  unsubcribe: any;
  text: string;
  hiddenValue = 100;
  language;
  photos = [];
  pictures = [];
  selectedLangugeEnglish;
  questionnaireId;
  categories;
  formShow = false;
  productId;
  addItemCount = 1;
  arrayCount = null;
  totalArrayCount;
  controls;
  payLoad = '';
  displayName;
  formGenarateArray = [];
  data;
  productSummaryData;
  catArray = [];
  formValue = [];
  test = [];
  groupCode = {};
  groupData = [];
  answers;
  constructor(
    public commonService: CommonService,
    public router: Router,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public http: ApiRequestService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {
    this.lensData = this.commonService.lensData;
  }

  public ngOnChanges(changes: SimpleChanges) {
    this.setFormArray();
    const id = changes.selectedFlow.currentValue;
    this.getSummary(id);
  }

  getSummary(id: any) {
    this.http
      .callService(
        new Method(environment.services.productSummary(id, false), '', 'get')
      )
      .subscribe((res) => {
        this.productSummaryData = res;
        sessionStorage.setItem(
          'selectedProduct',
          JSON.stringify(this.productSummaryData)
        );
        if (this.productSummaryData['pictures'].length > 0) {
          this.getAssetPhoto(
            this.productSummaryData['pictures'][0]['fileName']
          );
        }
        this.questionnaireId = this.productSummaryData['questionnaire'][
          'questionnaireId'
        ];
        this.getAnswers(this.questionnaireId);
      });
  }

  getAnswers(id: string) {
    localStorage.setItem('questionId', id);
    this.http
      .callService(new Method(environment.services.answers(id), '', 'get'))
      .subscribe((res) => {
        this.answers = res;
        this.filterQuestion();
      });
  }

  filterQuestion() {
    this.answers.forEach((a) => {
      this.formGenarateArray.forEach((q) => {
        if (a.code === q.code) {
          q.value = a.value;
        }
      });
    });
    this.formGenarate();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  saveTop(name: any) {
    this.pictures.push(JSON.parse(sessionStorage.getItem('uploadFile')));
    const data = {
      displayName: name,
      pictures: this.pictures,
    };
    this.http.callService(
      new Method(environment.services.cloneProduct(this.productId), data, 'put')
    );
  }

  onKeydown(items: any) {
    this.hiddenValue = 100;
    const first = items.filter((x) => x.Code === 'M221')[0];
    const second = items.filter((x) => x.Code === 'M222')[0];
    const third = items.filter((x) => x.Code === 'M223')[0];
    this.hiddenValue =
      this.hiddenValue - first.Value - second.Value - third.Value;
  }

  setFormArray() {
    if (this.lensData) {
      const result = JSON.parse(
        sessionStorage.getItem('questionList')
      ).filter((o1) => this.lensData.some((o2) => o1.code === o2.code));
      this.formGenarateArray = result;
    }
  }

  ngOnInit() {
    this.setFormArray();
    this.selectedLangugeEnglish = this.language === 'en-US' || !this.language;
    this.questionnaireId = localStorage.getItem('questionId');
    const unique = this.formGenarateArray.filter(
      ((set) => (f) => !set.has(f.category) && set.add(f.category))(new Set())
    );
    unique.forEach((item) => {
      if (item.category) {
        this.catArray.push(item.category);
      }
    });
  }

  async getAssetPhoto(filePath: String) {
    this.photos = [
      {
        source: environment.serverUrl + '/assets/download/' + filePath,
        options: {
          type: 'local',
        },
      },
    ];
  }

  onSubmit() {
    const data = {};
    for (const [key, value] of Object.entries(this.form.value.questionnaire)) {
      if (
        value !== 'undefined' &&
        value !== undefined &&
        value !== 'false' &&
        value !== null &&
        value !== ''
      ) {
        if (typeof value !== 'object') {
          data[key] = [value];
        } else {
          data[key] = value;
        }
      }
    }
    if (this.form.value.addMultipleAllowed) {
      this.form.value.addMultipleAllowed.forEach((element) => {
        const mapped = Object.keys(element).map((key) => ({
          code: key,
          value: element[key],
        }));
        const main = Object.keys(data).map((key) => ({
          code: key,
          value: element[key],
        }));
        mapped.forEach((g) => {
          main.forEach((d, i) => {
            if (g.code === d.code) {
              data[d.code].push(d.value);
              data[d.code].forEach((e, index) => {
                if (e === false || e === null) {
                  data[d.code].splice(index, 1);
                }
              });
            }
            this.formGenarateArray.forEach((item) => {
              if (d.code === item.code) {
                data[d.code].splice(item.dubliceCount, 1);
              }
            });
          });
        });
      });
    }
    this.http
      .callService(
        new Method(
          environment.services.putQuestionnaireForm(this.questionnaireId),
          data,
          'put'
        )
      )
      .subscribe(async (res) => {
        this.snackBar.open(
          await this.translateService
            .get('transactionSuccessful')
            .pipe(first())
            .toPromise(),
          '',
          {
            duration: 5000,
            panelClass: ['success-snackBar'],
          }
        );
      });
  }

  formGenarate() {
    this.formValue = this.formGenarateArray;
    this.formShow = true;
    if (this.formValue.length) {
      this.controls = {};
      this.formValue.forEach((v) => {
        if (v.description) {
          v.description = this.selectedLangugeEnglish
            ? v.description.en
            : v.description.nl;
          v.stringLenght = v.description ? v.description.length : 0;
        }
        // v.value.forEach((val) => {
        //   setTimeout(() => {
        //     this.addGroupItem(v, v.value.length);
        //   }, 1500);
        // });
        if (v.type === 'radio') {
          v.value = String(v.value);
        }
        if (!this.formShow) {
          this.formShow = true;
        }
        this.controls[v.code] = new FormControl(false);
        if (v.child) {
          v.child.forEach((element) => {
            if (element.description) {
              element.description = this.selectedLangugeEnglish
                ? element.description.en
                : element.description.nl;
              element.stringLenght = element.description
                ? element.description.length
                : 0;
            }
            if (element.type === 'radio') {
              element.value = String(element.value);
            }
            this.controls[element.code] = new FormControl(false);
            element.child.forEach((groupItem) => {
              if (groupItem.description) {
                groupItem.description = this.selectedLangugeEnglish
                  ? groupItem.description.en
                  : groupItem.description.nl;
                groupItem.stringLenght = groupItem.description
                  ? groupItem.description.length
                  : 0;
              }
              if (groupItem.type === 'radio') {
                groupItem.value = String(groupItem.value);
              }
              this.controls[groupItem.code] = new FormControl(false);
              groupItem.value.forEach((value) => {
                setTimeout(() => {
                  this.addGroupItem(v, groupItem.value.length);
                }, 1500);
              });
            });
          });
        }
      });
      this.form = this.fb.group({
        questionnaire: this.fb.group(this.controls),
        // addMultipleAllowed: this.fb.array([this.createGroup(null)]),
      });
    }
    this.contactList = this.form.get('addMultipleAllowed') as FormArray;
  }
  // contact formgroup
  createGroup(code: any): FormGroup {
    this.groupCode = {};
    this.groupData = [];
    this.formGenarateArray.forEach((element) => {
      if (element.multipleAllowed) {
        element.parent = element.code;
        this.groupData.push(element);
        this.groupCode[element.code] = null;
      }
      // element.child.forEach((child) => {
      //   if (child.multipleAllowed) {
      //     child.child.forEach((groupItem) => {
      //       this.groupData.push(groupItem);
      //       this.groupCode[groupItem.code] = null;
      //     });
      //   }
      // });
    });
    return this.fb.group(this.groupCode);
  }

  // add a contact form group
  addGroupItem(item: any, dubliceCount?: number) {
    if (dubliceCount) {
      item.dubliceCount = dubliceCount;
    } else {
      item.dubliceCount
        ? (item.dubliceCount = item.dubliceCount + 1)
        : (item.dubliceCount = 2);
    }
    this.contactList.push(this.createGroup(item));
  }

  // remove contact from group
  removeContact(index: any, item: any) {
    item.dubliceCount > 1
      ? (item.dubliceCount = item.dubliceCount - 1)
      : (item.dubliceCount = 0);
  }
}
