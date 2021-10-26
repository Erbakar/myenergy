import { Component, OnInit, OnDestroy, ContentChild } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../../assets/javascript/patica';
import { environment } from '@env/environment';
import { element } from 'protractor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Step7DownloadReportDialog } from '@app/shared/dialog/step7-download-report-dialog/step7-download-report-dialog.component';
import { IframeReportDialog } from '@app/shared/dialog/iframe-report-dialog/iframe-report-dialog.component';
import { ReportStatusDialog } from '@app/shared/dialog/report-status-dialog/report-status-dialog.component';
@Component({
  selector: 'app-smart-target',
  templateUrl: './smart-target.component.html',
  styleUrls: ['./smart-target.component.scss'],
})
export class SmartTargetComponent implements OnDestroy {
  isPatica = false;
  unit;
  alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  mock = {
    text: '',
    what: [
      {
        whatItem: '',
      },
    ],
    when: [
      {
        whenItem: '',
      },
    ],
    who: [
      {
        whoItem: '',
      },
    ],
    departments: [
      {
        departmentItem: '',
      },
    ],
    others: [
      {
        otherItem: '',
      },
    ],
    considerations: [
      {
        considerationItem: '',
      },
    ],
  };
  data;

  smartTagetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public router: Router,
    private http: ApiRequestService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.smartTagetForm = this.fb.group({
      targets: this.fb.array([]),
    });
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.http
      .callService(
        new Method(
          environment.services.step7SamartTarget(this.unit['id']),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.data = res;
        this.setTargets();
      });
  }

  addNewTarget() {
    const control = <FormArray>this.smartTagetForm.controls.targets;
    control.push(
      this.fb.group({
        text: [''],
        what: this.setwhat(this.mock),
        when: this.setwhen(this.mock),
        who: this.setwho(this.mock),
        departments: this.setdepartment(this.mock),
        others: this.setother(this.mock),
        considerations: this.setconsideration(this.mock),
      })
    );
  }

  deleteTarget(index: any) {
    const control = <FormArray>this.smartTagetForm.controls.targets;
    control.removeAt(index);
  }

  addNewWhat(control: any) {
    control.push(
      this.fb.group({
        whatItem: [''],
      })
    );
  }

  deleteWhat(control: any, index: any) {
    control.removeAt(index);
  }

  addNewWhen(control: any) {
    control.push(
      this.fb.group({
        whenItem: [''],
      })
    );
  }
  deleteWhen(control: any, index: any) {
    control.removeAt(index);
  }
  addNewWho(control: any) {
    control.push(
      this.fb.group({
        whoItem: [''],
      })
    );
  }
  deleteWho(control: any, index: any) {
    control.removeAt(index);
  }

  addNewDepartment(control: any) {
    control.push(
      this.fb.group({
        departmentItem: [''],
      })
    );
  }

  deleteDepartment(control: any, index: any) {
    control.removeAt(index);
  }

  addNewOther(control: any) {
    control.push(
      this.fb.group({
        otherItem: [''],
      })
    );
  }

  deleteOther(control: any, index: any) {
    control.removeAt(index);
  }

  addNewConsideration(control: any) {
    control.push(
      this.fb.group({
        considerationItem: [''],
      })
    );
  }

  deleteConsideration(control: any, index: any) {
    control.removeAt(index);
  }

  setTargets() {
    const control = <FormArray>this.smartTagetForm.controls.targets;
    this.data.targets.forEach((x) => {
      control.push(
        this.fb.group({
          text: x.text,
          what: this.setwhat(x),
          when: this.setwhen(x),
          who: this.setwho(x),
          departments: this.setdepartment(x),
          others: this.setother(x),
          considerations: this.setconsideration(x),
        })
      );
    });
  }

  setwhen(x: any) {
    const arr = new FormArray([]);
    x.when.forEach((y) => {
      arr.push(
        this.fb.group({
          whenItem: y.whenItem,
        })
      );
    });
    return arr;
  }
  setwhat(x: any) {
    const arr = new FormArray([]);
    x.what.forEach((y) => {
      arr.push(
        this.fb.group({
          whatItem: y.whatItem,
        })
      );
    });
    return arr;
  }
  setwho(x: any) {
    const arr = new FormArray([]);
    x.who.forEach((y) => {
      arr.push(
        this.fb.group({
          whoItem: y.whoItem,
        })
      );
    });
    return arr;
  }

  setdepartment(x: any) {
    const arr = new FormArray([]);
    x.departments.forEach((y) => {
      arr.push(
        this.fb.group({
          departmentItem: y.departmentItem,
        })
      );
    });
    return arr;
  }
  setother(x: any) {
    const arr = new FormArray([]);
    x.others.forEach((y) => {
      arr.push(
        this.fb.group({
          otherItem: y.otherItem,
        })
      );
    });
    return arr;
  }
  setconsideration(x: any) {
    const arr = new FormArray([]);
    x.considerations.forEach((y) => {
      arr.push(
        this.fb.group({
          considerationItem: y.considerationItem,
        })
      );
    });
    return arr;
  }

  onSubmit() {
    this.http
      .callService(
        new Method(
          environment.services.step7SamartTarget(this.unit['id']),
          this.smartTagetForm.value,
          'put'
        )
      )
      .subscribe((res) => {
        this.flowComplate('CTI_STEP7_DONE');
        this.flowComplate('CTI_STEP7_TARGETS');
        const dialogRef = this.dialog.open(Step7DownloadReportDialog, {
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
        if (response.status != 200) {
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
    this.router.navigate(['/cti/dashboard']);
  }

  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unit['id'] }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unit['id']);
      });
  }
  openPatica(res: boolean) {
    if (res) {
      this.isPatica = true;
      goToModulePatica(10, '4c006bef384e8f7511899778abcadac6');
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
}
