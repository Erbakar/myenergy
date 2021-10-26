import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'report-status-dialog',
  templateUrl: './report-status-dialog.component.html',
  styleUrls: ['./report-status-dialog.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class ReportStatusDialog {
  constructor(
    public dialogRef: MatDialogRef<ReportStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
