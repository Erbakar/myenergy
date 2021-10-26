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
import { environment } from '@env/environment';
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pcip-report-dialog.component',
  templateUrl: './pcip-report-dialog.component.html',
  styleUrls: ['./pcip-report-dialog.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class PcipReportDialog implements AfterViewInit {
  trustedUrl;

  constructor(
    public dialogRef: MatDialogRef<PcipReportDialog>,
    // tslint:disable-next-line:typedef
    @Inject(MAT_DIALOG_DATA) public data,
    public router: Router,
    private sanitizer: DomSanitizer
  ) {
    const authToken = JSON.parse(sessionStorage.getItem('credentials'))
      .authToken;
    const base = environment.serverUrlShort;
    const iframeUrl = `${environment.reportHost}/pcip.html#=${authToken}=${data.productId}=${base}=${data.type}`;
    console.log(iframeUrl);
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(iframeUrl);
  }
  ngAfterViewInit() {
    $('#report').css('height', $(window).height() - 100 + 'px');
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
