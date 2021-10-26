import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class ConfirmDialog {
  // tslint:disable-next-line:typedef
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    $('.mat-dialog-container').css('background', '#F6F4F7');
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
