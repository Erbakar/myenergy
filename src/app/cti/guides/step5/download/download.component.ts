import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { IframeReportDialog } from '@app/shared/dialog/iframe-report-dialog/iframe-report-dialog.component';
import { ReportStatusDialog } from '@app/shared/dialog/report-status-dialog/report-status-dialog.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
})
export class DownloadComponent implements OnInit {
  unitId;
  unit;
  constructor(
    public router: Router,
    private http: ApiRequestService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.unitId = localStorage.getItem('unitId');
    this.reportStatus(this.unit['id']);
  }

  ngOnInit(): void {
    this.router.navigate(['/cti/guide/step6']);
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
  }
}
