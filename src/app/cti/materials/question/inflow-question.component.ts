import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { CommonService } from '@app/core/common.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialsComponent } from '../materials.component';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-inflow-question',
  templateUrl: './inflow-question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class InflowQuestionComponent implements OnChanges {
  @Input() public selectedFlow: string;
  unit;
  kgValue;
  gramValue;
  totalValue;
  materialId;
  questionnaireId;
  controls;
  showForm = false;
  criticalBoxShow = false;
  materialType;
  maxPercentage;
  TI2ValidValue = 0;
  TI1ValidValue = 0;
  TI17ValidValue = 0;
  TI14Value;
  form: FormGroup;
  answers;
  baseQuestionList;
  questions = [];
  constructor(
    private http: ApiRequestService,
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private translateService: TranslateService,
    public materialsComponent: MaterialsComponent
  ) {
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.baseQuestionList = JSON.parse(sessionStorage.getItem('questionList'));
    this.criticalBoxShow = JSON.parse(
      sessionStorage.getItem('Inicators')
    ).criticalInflow;
  }
  public ngOnChanges(changes: SimpleChanges) {
    this.showForm = false;
    const id = changes.selectedFlow.currentValue;
    this.materialId = id;
    this.materialType = this.commonService.materialType;
    this.getSummary(id);
  }
  getSummary(id: any) {
    this.http
      .callService(
        new Method(environment.services.productSummary(id, false), '', 'get')
      )
      .subscribe((res) => {
        this.questionnaireId = res['questionnaire']['questionnaireId'];
        this.getAnswers(this.questionnaireId);
      });
  }
  getAnswers(id: string) {
    localStorage.setItem('questionId', id);
    this.http
      .callService(new Method(environment.services.answers(id), '', 'get'))
      .subscribe((res) => {
        this.answers = [];
        this.answers = res;
        this.filterQuestion();
      });
  }
  filterQuestion() {
    this.questions = [];
    this.controls = {};
    this.baseQuestionList.forEach((b) => {
      if (
        b.code === 'TI10' ||
        b.code === 'TI1' ||
        b.code === 'TI2' ||
        b.code === 'TI22' ||
        b.code === 'TI3' ||
        b.code === 'TI7' ||
        b.code === 'TI9' ||
        b.code === 'TI17' ||
        b.code === 'M18'
      ) {
        b.value = [''];
        b.evidenceFiles = [''];
        this.questions.push(b);
      }
    });
    this.answers.forEach((a) => {
      this.questions.forEach((q) => {
        if (a.code === q.code) {
          q.value = a.value;
          q.evidenceFiles = a.evidenceFiles;
        }
        if (q.code === 'TI3') {
          q.massValue = ['', ''];
          q.massValue = q.value[0].split('.', 2);
          if (q.massValue[1]) {
            if (q.massValue[1].length === 1) {
              q.massValue[1] = q.massValue[1] + '00';
            }
            if (q.massValue[1].length === 2) {
              q.massValue[1] = q.massValue[1] + '0';
            }
            if (q.massValue[1].length > 2) {
              q.massValue[1] = q.massValue[1].substring(0, 3);
            }
          }
        }
      });
    });
    this.generateForm();
  }
  generateForm() {
    this.showForm = false;
    this.controls['kg'] = new FormControl();
    this.controls['gram'] = new FormControl();
    this.questions.forEach((q) => {
      q.documentation = '';
      q.verification = '';
      if (q.evidenceFiles) {
        if (q.evidenceFiles.length > 0) {
          q.evidenceFiles.reverse().forEach((element) => {
            if (element.s3FileUuid) {
              q.documentation = element.s3FileUuid;
            }
            if (element.description) {
              q.verification = element.description;
            }
          });
        }
      }
      if (
        (q.code === 'TI17' && !q.value) ||
        (q.code === 'TI2' && !q.value) ||
        (q.code === 'TI1' && !q.value) ||
        (q.code === 'TI9' && !q.value)
      ) {
        if (q.code === 'TI9') {
          q.value = [100];
        }
      }
      this.controls[q.code] = new FormControl();
    });
    this.form = this.fb.group({
      questionnaire: this.fb.group(this.controls),
    });
    this.showForm = true;
  }
  openPatica(id: string) {
    this.commonService.openPaticaForQuestion.next(false);
    switch (id) {
      case 'TI7':
        this.commonService.openPaticaForQuestion.next({
          path: '6',
          module: '1580151592115',
        });
        break;
      case 'TI9':
        this.commonService.openPaticaForQuestion.next({
          path: '6',
          module: 'b66b4d18122b0601da959a0a2e6c9ae8',
        });
        break;
      case 'TI17':
        this.commonService.openPaticaForQuestion.next({
          path: '6',
          module: 'b66b4d18122b0601da959a0a2e6c9ae8',
        });
        break;
      case 'TI1':
        this.commonService.openPaticaForQuestion.next({
          path: '6',
          module: 'b66b4d18122b0601da959a0a2e6c9ae8',
        });
        break;
      case 'TI5':
        this.commonService.openPaticaForQuestion.next({
          path: '6',
          module: '1c7b660833a69906110299d40826bf5d',
        });
        break;
      default:
        this.commonService.openPaticaForQuestion.next(false);
        break;
    }
  }

  inputKeyUp() {
    this.maxPercentage = 100;
    this.questions.forEach((element) => {
      if (element.code === 'TI17') {
        if (element.value > 100) {
          element.value = 100;
        }
        if (element.value < 0) {
          element.value = 0;
        }
        this.TI17ValidValue = element.value;
      }
      if (element.code === 'TI2') {
        if (element.value > this.maxPercentage - this.TI17ValidValue) {
          element.value = this.maxPercentage - this.TI17ValidValue;
        }
        if (element.value < 0) {
          element.value = 0;
        }
        this.TI2ValidValue = element.value;
      }
      if (element.code === 'TI1') {
        if (
          element.value >
          this.maxPercentage - this.TI2ValidValue - this.TI17ValidValue
        ) {
          element.value =
            this.maxPercentage - this.TI2ValidValue - this.TI17ValidValue;
        }
        if (element.value < 0) {
          element.value = 0;
        }
        this.TI1ValidValue = element.value;
      }
      if (element.code === 'TI9') {
        element.value =
          this.maxPercentage -
          this.TI2ValidValue -
          this.TI1ValidValue -
          this.TI17ValidValue;
        if (element.value < 0) {
          element.value = 0;
        }
      }
      if (element.code === 'TI5') {
        if (element.value > 100) {
          element.value = 100;
        }
        if (element.value < 0) {
          element.value = 0;
        }
      }
    });
  }
  maxValueFake(item: any, max: any) {
    if (item.massValue[1] > max) {
      item.massValue[1] = max;
    }
  }
  saveForm(isPublish: boolean) {
    const data = {};
    this.totalValue = null;
    this.kgValue = 0;
    this.gramValue = 0;
    for (const [key, value] of Object.entries(
      this.form.getRawValue().questionnaire
    )) {
      if (
        key.indexOf('verification') === -1 &&
        value !== undefined &&
        value !== 'false' &&
        value !== null &&
        value !== ''
      ) {
        if (key === 'kg' || key === 'gram') {
          if (key === 'kg') {
            this.kgValue = value;
          }
          if (key === 'gram') {
            if (String(value).length === 1) {
              this.gramValue = `00${value}`;
            } else if (String(value).length === 2) {
              this.gramValue = `0${value}`;
            } else {
              this.gramValue = String(value).substr(String(value).length - 3);
            }
          }
          this.totalValue = this.kgValue + '.' + this.gramValue;
          data['TI3'] = [{ ['TI3']: this.totalValue }];
        } else {
          data[key] = [{ [key]: String(value) }];
        }
      }
      if (key === 'TI7') {
        if (value === undefined) {
          data['TI7'] = [{ ['TI7']: '' }];
        }
      }
    }

    this.http
      .callService(
        new Method(
          environment.services.ctiQuestionsSave(this.questionnaireId),
          { 'Product Details': data },
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
        if (isPublish) {
          this.http
            .callService(
              new Method(
                environment.services.ctiQuestionsPublish(this.questionnaireId),
                { questionnaireId: this.questionnaireId },
                'post'
              )
            )
            .subscribe((res2) => {
              this.materialsComponent.closeDetail();
              this.materialsComponent.getUnitGuidance(this.unit['id']);
              this.materialsComponent.initData();
            });
        }
      });
  }
  saveAndPublishForm() {
    this.saveForm(true);
  }
}
