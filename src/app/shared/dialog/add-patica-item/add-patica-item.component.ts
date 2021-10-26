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
import DefaultEditorConfig from '../../../core/DefaultEditorConfig';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-patica-item.dialog',
  templateUrl: './add-patica-item.component.html',
  styleUrls: ['./add-patica-item.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class AddPaticaItemDialog {
  unitId;
  selectedBusiness;
  name;
  businessForm: FormGroup;
  editorConfig = DefaultEditorConfig;
  constructor(
    public dialogRef: MatDialogRef<AddPaticaItemDialog>,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.unitId = localStorage.getItem('unitId');
    this.selectedBusiness = JSON.parse(
      localStorage.getItem('selectedBusiness')
    );
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
      rawContent: ['', Validators.required],
    });
  }
}
