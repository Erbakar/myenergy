import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'step5-download-report-dialog.component',
  templateUrl: './step5-download-report-dialog.component.html',
  styleUrls: ['./step5-download-report-dialog.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class Step5DownloadReportDialog {
  unitId;
  constructor(
    public dialogRef: MatDialogRef<Step5DownloadReportDialog>,
    public router: Router,
    private commonService: CommonService,
    private http: ApiRequestService
  ) {
    this.unitId = localStorage.getItem('unitId');
  }
  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unitId }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unitId);
      });
  }
  onNoClick(): void {
    this.flowComplate('CTI_STEP5_DONE');
    this.router.navigate(['/cti/guide/step6']);
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
