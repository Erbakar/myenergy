import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserDialogComponent {
  createUserFrom: FormGroup;
  firstNameReadonly = false;
  activeStep = 'first';
  mainData;
  availableUser;
  userData;
  lastNameReadonly = false;
  constructor(
    private http: ApiRequestService,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public router: Router,
    public dialogRef: MatDialogRef<NewUserDialogComponent>,
    // tslint:disable-next-line:typedef
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.mainData = data;
    this.createUserFrom = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      firstName: [null, [Validators.required]],
      lastName: [null, []],
    });
  }

  // deleteSpaces(email: string) {
  //   // this.createUserFrom.controls.email.value = email.trim();
  //   console.log(this.createUserFrom.controls.email.value);

  // }

  checkMail() {
    if (
      this.createUserFrom.controls.email.valid ||
      this.createUserFrom.controls.email.untouched
    ) {
      this.activeStep = 'second';
      this.http
        .callService(
          new Method(
            environment.services.emailCheck(
              this.createUserFrom.controls.email.value
            ),
            '',
            'get'
          )
        )
        .subscribe((res) => {
          if (res) {
            this.availableUser = res;
          }
        });
    }
  }

  onNoClick() {
    this.dialogRef.close(false);
  }
  onYesClick() {
    this.userData = {
      email: this.createUserFrom.controls.email.value,
      firstName: this.createUserFrom.controls.firstName.value,
      lastName: this.createUserFrom.controls.lastName.value,
      roles: {
        roleNames: ['Product manager'],
      },
      organisationId: null,
    };
    this.http
      .callService(
        new Method(environment.services.user(), this.userData, 'post')
      )
      .subscribe((res) => {
        const materialData = { userId: res['id'], email: res['email'] };
        this.dialogRef.close(materialData);
      });
  }
}
