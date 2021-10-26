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
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'myenergy-goals-video.dialog',
  templateUrl: './myenergy-goals-video.component.html',
  styleUrls: ['./myenergy-goals-video.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class MyenergyGoalsVideoDialog {
  unitId;
  name;
  videoUrl;
  nevershowForm: FormGroup;
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<MyenergyGoalsVideoDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      data.videoUrl
    );
    console.log(data);
    this.unitId = localStorage.getItem('unitId');
    this.createForm();
    $('.mat-dialog-container').css('background', '#F6F4F7');
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close({
      neverShow: this.nevershowForm.value.again,
      start: true,
    });
  }
  private createForm() {
    this.nevershowForm = this.formBuilder.group({
      again: [false, Validators.required],
    });
  }
}
