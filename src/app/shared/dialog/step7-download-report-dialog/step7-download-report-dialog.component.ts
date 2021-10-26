import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'step7-download-report-dialog.component',
  templateUrl: './step7-download-report-dialog.component.html',
  styleUrls: ['./step7-download-report-dialog.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class Step7DownloadReportDialog {
  unitId;
  constructor(
    public dialogRef: MatDialogRef<Step7DownloadReportDialog>,
    public router: Router,
    private http: ApiRequestService
  ) {
    this.unitId = localStorage.getItem('unitId');
  }

  onNoClick(): void {
    this.router.navigate(['/cti/dashboard']);
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
