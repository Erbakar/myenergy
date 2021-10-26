import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  EmailValidator,
} from '@angular/forms';
import { environment } from '@env/environment';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-business-level.dialog',
  templateUrl: './edit-business-level.component.html',
  styleUrls: ['./edit-business-level.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class EditBusinessLevelDialog implements OnInit {
  businessLevels = [
    'Select business level',
    'Company level',
    'Business unit',
    'Product line',
    'Site location',
    'Other',
  ];
  unitId;
  name;
  active = 1;
  businessForm: FormGroup;
  assessmentForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditBusinessLevelDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public router: Router,
    private snackBar: MatSnackBar,
    private http: ApiRequestService,
    private formBuilder: FormBuilder
  ) {
    this.unitId = localStorage.getItem('unitId');
    this.createForm();
  }
  ngOnInit() {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    const data = {
      name: this.businessForm.value.name,
      type: this.businessForm.value.type,
      otherType: this.businessForm.value.otherType,
    };
    this.dialogRef.close(data);
  }

  private createForm() {
    this.businessForm = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      type: [this.data.type, Validators.required],
      otherType: [this.data.otherType],
    });
  }
}
