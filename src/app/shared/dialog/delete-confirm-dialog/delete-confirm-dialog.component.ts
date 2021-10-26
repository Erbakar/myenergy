import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class DeleteConfirmDialog {
  // tslint:disable-next-line:typedef
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
