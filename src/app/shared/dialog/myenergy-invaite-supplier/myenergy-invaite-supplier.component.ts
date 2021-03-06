import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'myenergy-invaite-supplier',
  templateUrl: './myenergy-invaite-supplier.component.html',
  styleUrls: ['./myenergy-invaite-supplier.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class MyenergyInvaiteSupplier {
  createUserFrom: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MyenergyInvaiteSupplier>
  ) {
    $('.mat-dialog-container').css('background', '#F6F4F7');
    this.createUserFrom = this.formBuilder.group({
      organisationName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    const data = {
      userUuid: null,
      organisationUuid: null,
      organisationName: this.createUserFrom.value.organisationName,
      firstName: this.createUserFrom.value.firstName,
      lastName: this.createUserFrom.value.lastName,
      email: this.createUserFrom.value.email,
    };
    this.dialogRef.close(data);
  }
}
