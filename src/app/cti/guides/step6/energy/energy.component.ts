import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../../assets/javascript/patica';
import { Step6DownloadReportDialog } from '@app/shared/dialog/step6-download-report-dialog/step6-download-report-dialog.component';
import { ReportStatusDialog } from '@app/shared/dialog/report-status-dialog/report-status-dialog.component';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IframeReportDialog } from '@app/shared/dialog/iframe-report-dialog/iframe-report-dialog.component';

@Component({
  selector: 'app-step6-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.scss'],
})
export class Step6EnergyComponent implements OnInit, OnDestroy {
  unit;
  isShow = false;
  isPatica = false;
  flowOpportunityOtherUuid;
  flowRisOtherkUuid;
  flowSolutionOtherUuid;
  flowList = [];
  risks = [];
  opportunities = [];
  solutions = [];
  questionList;
  unitId;
  data;
  response;
  controls;
  form: FormGroup;
  constructor(
    private commonService: CommonService,
    private http: ApiRequestService,
    public router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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

      goToModulePatica(9, 'd6f4ce62dd0b8654392d9e9b695a3ab7');
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
  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unitId }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unitId);
      });
  }
  ngOnInit() {
    this.controls = {};
    this.http
      .callService(
        new Method(
          environment.services.step6Question(this.unit['id'], 'ENERGY'),
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
    this.goNext();
  }

  goNext() {
    this.http
      .callService(
        new Method(
          environment.services.step6Question(this.unit['id'], 'ENERGY'),
          this.data,
          'put'
        )
      )
      .subscribe((res) => {
        this.commonService.step6ActiveCase.next('water');
        this.flowComplate('CTI_STEP6_STRATEGY');
      });
  }

  saveComplate() {
    this.http
      .callService(
        new Method(
          environment.services.step6Question(this.unit['id'], 'ENERGY'),
          this.data,
          'put'
        )
      )
      .subscribe((res) => {
        this.flowComplate('CTI_STEP6_DONE');
        this.flowComplate('CTI_STEP6_BUSINESS');
        const dialogRef = this.dialog.open(Step6DownloadReportDialog, {
          width: '80%',
          maxWidth: '600px',
          height: '400px',
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          if (!result) {
            return;
          }
          try {
            this.reportStatus(this.unit['id']);
          } catch (error) {}
        });
      });
  }
  reportStatus(unitId: any) {
    this.http
      .callService(
        new Method(environment.services.reportStatus(unitId), '', 'get')
      )
      .subscribe((res) => {
        if (res['canDownload']) {
          if (res['warningMessage']) {
            const dialogRef = this.dialog.open(ReportStatusDialog, {
              width: '80%',
              maxWidth: '430px',
              data: {
                title: `Report status`,
                message: res['warningMessage'],
              },
            });
            dialogRef.afterClosed().subscribe(async (result) => {
              if (!result) {
                return;
              }
              try {
                // this.generateReport();
                this.generateReportIframe();
              } catch (error) {}
            });
          } else {
            // this.generateReport();
            this.generateReportIframe();
          }
        } else {
          this.snackBar.open(res['warningMessage'], '', {
            duration: 5000,
            panelClass: ['error-snackBar'],
          });
        }
      });
  }

  generateReportIframe() {
    const dialogRef = this.dialog.open(IframeReportDialog, {
      width: '96%',
      maxWidth: '96%',
      data: {
        show: true,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.reportStatus(this.unit['id']);
      } catch (error) {}
    });
  }

  generateReport() {
    const token = JSON.parse(sessionStorage.getItem('credentials')).authToken;

    fetch(
      environment.serverUrl +
        environment.services.unitReport(localStorage.getItem('unitId')),
      {
        headers: {
          'x-auth-token': token,
        },
        method: 'GET',
      }
    )
      .then((response) => {
        if (response.status !== 200) {
          throw response.json();
        }
        return response.arrayBuffer();
      })
      .then((buffer) => {
        const FileSaver = require('file-saver');
        let unit_name = this.unit['name'];
        if (!unit_name || 0 === unit_name.length) {
          unit_name = 'business level';
        }
        const reportName = unit_name + ' cti report.pdf';
        const file = new File([buffer], reportName, {
          type: 'application/pdf',
        });
        FileSaver.saveAs(file);
      })
      .catch((error) => {
        error.then((result) => {
          let message = 'Unable to create report.';
          if (result.message) {
            message = result.message;
          }
          this.snackBar.open(message, '', {
            duration: 5000,
            panelClass: ['error-snackBar'],
          });
        });
      });
    this.router.navigate(['/cti/guide/step7']);
  }

  uncheck(name: string, value: number, oldValue: number) {
    if (value == oldValue) {
      setTimeout(() => {
        this.data[`${name}`] = null;
      }, 50);
    }
  }

  generateForm() {
    this.flowList.forEach((element) => {
      this.controls[
        element.organisationUnitFlowUuid + 'risks'
      ] = new FormControl(false);
      this.controls[
        element.organisationUnitFlowUuid + 'opportunities'
      ] = new FormControl(false);
      this.controls[
        element.organisationUnitFlowUuid + 'solutions'
      ] = new FormControl(false);
      this.controls[
        element.organisationUnitFlowUuid + 'flowRiskOtherName'
      ] = new FormControl(false);
      this.controls[
        element.organisationUnitFlowUuid + 'flowOpportunityOtherName'
      ] = new FormControl(false);
      this.controls[
        element.organisationUnitFlowUuid + 'flowSolutionOtherName'
      ] = new FormControl(false);
      element.opportunities.forEach((o) => {
        if (o.text === 'OTHER') {
          this.flowOpportunityOtherUuid = o.uuid;
        }
      });
      element.risks.forEach((o) => {
        if (o.text === 'OTHER') {
          this.flowRisOtherkUuid = o.uuid;
        }
      });
      element.solutions.forEach((o) => {
        if (o.text === 'OTHER') {
          this.flowSolutionOtherUuid = o.uuid;
        }
      });
    });
    this.form = this.fb.group({
      question: this.fb.group(this.controls),
    });
    this.isShow = true;
  }

  next() {
    const list = [];
    this.flowList.forEach((element) => {
      const item = {
        flowImprovementUuid: element.flowImprovementUuid,
        flowSolutionUuid:
          element.flowSolutionUuid === '0' ? ' ' : element.flowSolutionUuid,
        flowSolutionOtherText:
          element.flowSolutionUuid !== '62cf7bd9-4248-41af-aef7-7c52c92db9fe'
            ? ' '
            : element.flowSolutionOtherName,
      };
      list.push(item);
    });
    const data = {
      flowSolutionRequests: list,
    };
    this.http
      .callService(
        new Method(
          environment.services.saveFlowSolution(this.unit['id']),
          data,
          'put'
        )
      )
      .subscribe((res) => {
        this.commonService.step6ActiveCase.next('water');
        this.flowComplate('CTI_STEP6_STRATEGY');
      });
  }
}
