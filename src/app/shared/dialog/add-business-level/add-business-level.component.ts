import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  EmailValidator,
} from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from '@env/environment';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-business-level.dialog',
  templateUrl: './add-business-level.component.html',
  styleUrls: ['./add-business-level.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class AddBusinessLevelDialog implements OnInit {
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
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    center: true,
    margin: 100,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    rewind: false,
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: true,
  };
  assessmentForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddBusinessLevelDialog>,
    public router: Router,
    private snackBar: MatSnackBar,
    private http: ApiRequestService,
    private formBuilder: FormBuilder
  ) {
    this.unitId = localStorage.getItem('unitId');
    this.createForm();
  }
  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    const data = {
      name: this.businessForm.value.name,
      type: this.businessForm.value.type,
      otherType: this.businessForm.value.otherType,
      assessmentName: this.assessmentForm.value.assessmentName,
    };
    this.dialogRef.close(data);
  }

  onNextClick(): void {
    this.active = 2;
    $('.owl-next').trigger('click');
  }
  onBackClick(): void {
    this.active = 1;
    $('.owl-prev').trigger('click');
  }
  private createForm() {
    this.businessForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      otherType: [''],
    });
    this.assessmentForm = this.formBuilder.group({
      assessmentName: ['', Validators.required],
    });
  }
}
