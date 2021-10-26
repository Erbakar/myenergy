import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewChecked,
} from '@angular/core';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { CommonService } from '@app/core/common.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActualRecoveryRatetDialog } from '@app/shared/dialog/actual-recovery-rate-dialog/actual-recovery-rate-dialog.component';
import { ChangeDetectorRef } from '@angular/core';
import { MaterialsComponent } from '../materials.component';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-outflow-question',
  templateUrl: './outflow-question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class OutflowQuestionComponent implements OnChanges, AfterViewChecked {
  @Input() public selectedFlow: string;
  questions = [];
  technical = [];
  biological = [];
  foodAndFeed = [];
  selectPotential;
  isEmptyTI5;
  unit;
  kgValue;
  gramValue;
  totalValue;
  inicators;
  selectedPercentage;
  SelectApplication = 'Select Recovery rate source application';
  questionnaireId;
  controls;
  showForm = false;
  materialType;
  materialId;
  form: FormGroup;
  showTest;
  answers;
  baseQuestionList;
  actualRecoveryRates = {
    'Metals - Steel - MATERIAL': '85',
    'Metals - Steel - building - sheet': '95',
    'Metals - Steel - packaging': '74',
    'Metals - Steel - steel hangers and screws': '95',
    'Metals - Aluminium - MATERIAL (unspcified)': '85',
    'Metals - Aluminium - automotive': '90',
    'Metals - Aluminium - building - sheet': '95',
    'Metals - Aluminium - building - e.g. doors, windows': '90',
    'Metals - Aluminium - appliances - sheet': '90',
    'Metals - Aluminium - packaging - cans, closures, trays': '69',
    'Metals - Copper - building - sheet': '95',
    'Metals - Copper - building - pipes': '95',
    'Metals - Copper - electronic applications': '80',
    'Metals - Copper - electrical applications (cables)': '95',
    'Metals - Copper - mechanical applications': '80',
    'Metals - Copper - building - water supply pipes': '95',
    'Metals - Copper alloys - building - water supply pipes': '95',
    'Metals - Lead - building - sheet': '95',
    'Paper - MATERIAL': '62',
    'Plastics - PET - packaging - bottle': '42',
    'Plastics - PE - PE-LD building and construction': '27.5',
    'Plastics - PE - PE-HD building and construction': '27.5',
    'Plastics - PP - building and construction': '18.3',
    'Plastics - PS - building and construction': '6.7',
    'Plastics - EPS - building and construction': '6.7',
    'Plastics - PVC - building and construction': '32.1',
    'Plastics - Polycarbonate PC - packaging - water': '29.',
    'Plastics - Generic plastics - packaging - generic': '29.',
    'Glass - MATERIAL': '66',
    'Wood - packaging - pallet': '30',
    'Textiles - t-shirts': '11',
  };

  constructor(
    private http: ApiRequestService,
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    public materialsComponent: MaterialsComponent
  ) {
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.baseQuestionList = JSON.parse(sessionStorage.getItem('questionList'));
    this.baseQuestionList.forEach((element) => {
      if (element.code === 'TI11') {
        element.options.forEach((o) => {
          if (o.value === 'landfillMixed') {
            o.potential = ['0'];
          }
          if (
            o.value === 'nutrientAbsorption' ||
            o.value === 'biogasRecovery'
          ) {
            o.potential = ['50'];
          }
          if (
            o.value === 'consumptionAlternative' ||
            o.value === 'consumption'
          ) {
            o.potential = ['100'];
          }
          if (
            o.value === 'reUse' ||
            o.value === 'repairRefurbish' ||
            o.value === 'repurposeRemanufacture' ||
            o.value === 'recycle' ||
            o.value === 'landfillMixed'
          ) {
            this.technical.push(o);
          }
          if (
            o.value === 'reUse' ||
            o.value === 'repairRefurbish' ||
            o.value === 'repurposeRemanufacture' ||
            o.value === 'recycle' ||
            o.value === 'landfillMixed' ||
            o.value === 'nutrientAbsorption' ||
            o.value === 'biogasRecovery'
          ) {
            this.biological.push(o);
          }
          if (
            o.value === 'consumption' ||
            o.value === 'consumptionAlternative' ||
            o.value === 'landfillMixed' ||
            o.value === 'nutrientAbsorption' ||
            o.value === 'biogasRecovery'
          ) {
            this.foodAndFeed.push(o);
          }
        });
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    this.unitdetail();
    this.showForm = false;
    const id = changes.selectedFlow.currentValue;
    this.materialId = id;
    this.materialType = this.commonService.materialType;
    this.getSummary(id);
  }
  unitdetail() {
    this.http
      .callService(
        new Method(
          environment.services.unitDetailed(localStorage.getItem('unitId')),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.inicators = res['indicators'];
      });
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
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  filterQuestion() {
    this.questions = [];
    this.controls = {};
    this.baseQuestionList.forEach((b) => {
      if (
        b.code === 'TI10' ||
        b.code === 'TI23' ||
        b.code === 'M18' ||
        b.code === 'TI4' ||
        b.code === 'TI5' ||
        b.code === 'TI6' ||
        b.code === 'TI12' ||
        b.code === 'TI13' ||
        b.code === 'TI15' ||
        b.code === 'TI19' ||
        b.code === 'TI21' ||
        b.code === 'TI20' ||
        b.code === 'TI11'
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
        if (q.code === 'TI6') {
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
      if (q.code === 'TI21') {
        if (q.value[0] !== 'Yes') {
          q.realValue = false;
        } else {
          q.realValue = true;
        }
      }
      if (q.code === 'TI20') {
        this.selectedPercentage = q.value;
      }
      if (q.code === 'TI19') {
        if (q.value) {
          this.SelectApplication = q.value;
        } else {
          this.SelectApplication = 'Select Recovery rate source application';
        }
      }
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
      this.controls[q.code] = new FormControl(false);
    });
    this.form = this.fb.group({
      questionnaire: this.fb.group(this.controls),
    });
    this.questions.forEach((element) => {
      if (element.code === 'TI12') {
        const changeOption = this.baseQuestionList.filter(
          (item) => item.code === 'TI11'
        );
        switch (element.value[0]) {
          case 'technical':
            changeOption[0].options = this.technical;
            break;
          case 'foodAndFeed':
            changeOption[0].options = this.foodAndFeed;
            break;
          case 'biological':
            changeOption[0].options = this.biological;
            break;
          default:
            break;
        }
      }
      if (element.code === 'TI11') {
        const setPercentage = element.options.filter(
          (o) => o.value === element.value[0]
        );
        this.selectPotential =
          setPercentage.length > 0 ? setPercentage[0].potential : [''];
      }
      if (element.code === 'TI4') {
        if (this.selectPotential) {
          if (this.selectPotential[0] !== '') {
            element.value = this.selectPotential;
            this.controls['TI4'].disable();
          }
        }
      }
    });
    this.showForm = true;
  }
  openPatica(id: string) {
    this.commonService.openPaticaForQuestion.next(false);
    switch (id) {
      case 'TI1':
        this.commonService.openPaticaForQuestion.next({
          path: '6',
          module: 'b66b4d18122b0601da959a0a2e6c9ae8',
        });
        break;
      case 'TI4':
        this.commonService.openPaticaForQuestion.next({
          path: '6',
          module: '1c7b660833a69906110299d40826bf5d',
        });
        break;
      case 'TI15':
        this.commonService.openPaticaForQuestion.next({
          path: '6',
          module: '1c7b660833a69906110299d40826bf5d',
        });
        break;
      case 'TI5':
        this.commonService.openPaticaForQuestion.next({
          path: '6',
          module: '1c7b660833a69906110299d40826bf5d',
        });
        break;
      case 'TI11':
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

  openModel() {
    const dialogRef = this.dialog.open(ActualRecoveryRatetDialog, {
      width: '80%',
      maxWidth: '700px',
      height: '500px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.selectedPercentage = result.percentage;
        this.SelectApplication = result.value;
      } catch (error) {}
    });
  }

  maxValue(item: any, max: any) {
    if (item.value[0] > max) {
      item.value[0] = max;
    }
    if (item.value[0] < 0) {
      item.value[0] = 0;
    }
  }

  maxValueFake(item: any, max: any) {
    if (item.massValue[1] > max) {
      item.massValue[1] = max;
    }
  }

  nameChangeEvenet(q: any) {
    if (q.code === 'TI19') {
      this.questions.forEach((element) => {
        if (element.code === 'TI5') {
          element.value = [this.actualRecoveryRates[q.value]];
        }
      });
    }
    if (q.code === 'TI12') {
      const changeOption = this.baseQuestionList.filter(
        (item) => item.code === 'TI11'
      );
      switch (q.value[0]) {
        case 'technical':
          changeOption[0].options = this.technical;
          break;
        case 'foodAndFeed':
          changeOption[0].options = this.foodAndFeed;
          break;
        case 'biological':
          changeOption[0].options = this.biological;
          break;
        default:
          break;
      }
      this.questions.forEach((element) => {
        if (element.code === 'TI11') {
          element.value = [''];
          this.selectPotential = [''];
        }
      });
    }
    if (q.code === 'TI11') {
      this.questions.forEach((element) => {
        if (element.code === 'TI11') {
          const setPercentage = element.options.filter(
            (o) => o.value === element.value[0]
          );
          this.selectPotential = setPercentage[0].potential;
        }
        if (element.code === 'TI4') {
          if (this.selectPotential) {
            element.value = this.selectPotential;
            this.controls['TI4'].disable();
          } else {
            element.value = [''];
            this.controls['TI4'].enable();
          }
        }
      });
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
        if (key === 'TI21') {
          data[key] = [{ [key]: String(value ? 'Yes' : 'No') }];
        }
        if ($('#TI5').val() === '') {
          data['TI5'] = [{ ['TI5']: null }];
        }
        if (key === 'kg' || key === 'gram') {
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
            data['TI6'] = [{ ['TI6']: this.totalValue }];
          }
        }
        if (key !== 'TI21' && key !== 'TI6' && key !== 'kg' && key !== 'gram') {
          data[key] = [{ [key]: String(value) }];
        }
      }
    }
    if (this.materialType === 'OUTFLOW') {
      data['TI19'] = [{ ['TI19']: String(this.SelectApplication) }];
      data['TI20'] = [{ ['TI20']: String(this.selectedPercentage) }];
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
