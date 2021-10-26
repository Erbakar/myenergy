import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'delete-confirm-dialog',
  templateUrl: './create-bom.component.html',
  styleUrls: ['./create-bom.component.scss'],
})
export class CreateBomDialog {
  isGenericMaterial;
  displayName;
  productName;
  weight;
  constructor(
    public dialogRef: MatDialogRef<CreateBomDialog>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(
    isGenericMaterial: boolean,
    displayName: string,
    productName: string,
    weight: string
  ): void {
    const req = {
      isGenericMaterial: isGenericMaterial,
      displayName: displayName,
      productName: productName,
      weight: weight,
    };
    this.dialogRef.close(req);
  }
}
