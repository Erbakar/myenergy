import {
  Component,
  Inject,
  AfterContentInit,
  AfterViewInit,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'iframe-report-dialog.component',
  templateUrl: './iframe-report-dialog.component.html',
  styleUrls: ['./iframe-report-dialog.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class IframeReportDialog implements AfterViewInit {
  trustedUrl;
  iframeUrl;
  constructor(
    public dialogRef: MatDialogRef<IframeReportDialog>,
    // tslint:disable-next-line:typedef
    @Inject(MAT_DIALOG_DATA) public data,
    public router: Router,
    private http: ApiRequestService,
    private sanitizer: DomSanitizer
  ) {
    const unitId = localStorage.getItem('unitId');
    const authToken = JSON.parse(sessionStorage.getItem('credentials'))
      .authToken;
    const base = environment.serverUrlShort;
    const version = new Date().getTime();
    this.iframeUrl = `${environment.reportHost}/#${version}=${authToken}=${unitId}=${base}`;
    console.log(this.iframeUrl);
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.iframeUrl
    );
    // this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeUrl);
    console.log(this.trustedUrl);
    if (data.show === false) {
      $('.cdk-overlay-container').css('opacity', '0');
      setTimeout(() => {
        this.dialogRef.close(false);
      }, 2000);
    }
  }

  ngAfterViewInit() {
    $('#report').css('height', $(window).height() - 100 + 'px');
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
