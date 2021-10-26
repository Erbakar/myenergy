import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  EmailValidator,
} from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-assessment.dialog',
  templateUrl: './add-assessment.component.html',
  styleUrls: ['./add-assessment.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class AddAssessmentDialog {
  unitId;
  name;
  businessForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddAssessmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.unitId = localStorage.getItem('unitId');
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    if (this.businessForm.value) {
      this.dialogRef.close(this.businessForm.value.name);
    }
  }
  private createForm() {
    this.businessForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }
}
