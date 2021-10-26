import { Component, OnInit } from '@angular/core';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from '@app/core/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ReportStatusDialog } from '@app/shared/dialog/report-status-dialog/report-status-dialog.component';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { MatDialog } from '@angular/material/dialog';
import { IframeReportDialog } from '@app/shared/dialog/iframe-report-dialog/iframe-report-dialog.component';
declare var require: any;
@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss'],
})
export class Step4Component implements OnInit {
  selectedUnitId;
  data;
  fileUrl;
  reportData;
  constructor(
    private commonService: CommonService,
    private http: HttpClient,
    private http2: ApiRequestService,
    private dialog: MatDialog,
    private https: ApiRequestService,
    private snackBar: MatSnackBar,
    public router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.commonService.selectedUnit.subscribe((unit) => {
      this.data = unit;
      this.selectedUnitId = unit['id'];
    });
  }

  ngOnInit() {}

  reportStatus() {
    this.https
      .callService(
        new Method(
          environment.services.reportStatus(this.selectedUnitId),
          '',
          'get'
        )
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
    this.flowComplate('CTI_REPORT_DONE');
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
        this.reportStatus();
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
        let unit_name = this.data['name'];
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
  }

  exportCsv() {
    const token = JSON.parse(sessionStorage.getItem('credentials')).authToken;

    fetch(
      environment.serverUrl +
        environment.services.unitExport(localStorage.getItem('unitId')),
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
        let unit_name = this.data['name'];
        if (!unit_name || 0 === unit_name.length) {
          unit_name = 'business level';
        }
        const reportName = unit_name + ' export.csv';
        const file = new File([buffer], reportName, { type: 'text/csv' });
        FileSaver.saveAs(file);
      })
      .catch((error) => {
        error.then((result) => {
          let message = 'Unable to create export csv.';
          if (result.message) {
            message = result.message;
          }
          this.snackBar.open(message, '', {
            duration: 5000,
            panelClass: ['error-snackBar'],
          });
        });
      });
  }
  flowComplate(flow: string) {
    const data = [
      { question: flow, value: true, entityId: localStorage.getItem('unitId') },
    ];
    this.http2
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.selectedUnitId);
      });
  }
}
