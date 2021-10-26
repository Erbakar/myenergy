import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InviteColleagueDialog } from '../invite-colleague/invite-colleague.component';
import { Router } from '@angular/router';
import { CommonService } from '@app/core/common.service';

@Component({
  selector: 'app-supplier-user',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss'],
})
export class NewSupplierDialogComponent {
  createUserFrom: FormGroup;
  readonly = false;
  unitName;
  availableUser;
  activeStep = 'first';
  userData;
  constructor(
    private http: ApiRequestService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    public router: Router,
    public dialogRef: MatDialogRef<NewSupplierDialogComponent>,
    // tslint:disable-next-line:typedef
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.createUserFrom = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      organization: ['', Validators.required],
    });
    const credentials = JSON.parse(sessionStorage.getItem('credentials'));

    this.unitName = credentials['organisation']['name'];
  }

  checkMail() {
    if (
      this.createUserFrom.controls.email.valid ||
      this.createUserFrom.controls.email.untouched
    ) {
      this.activeStep = 'second';
      this.http
        .callService(
          new Method(
            environment.services.emailCheckForSupplier(
              this.createUserFrom.controls.email.value
            ),
            '',
            'get'
          )
        )
        .subscribe((res) => {
          if (res) {
            this.availableUser = res;
            this.readonly = true;
            this.createUserFrom.patchValue({
              organization: res['organization'],
            });
          }
        });
    }
  }

  inviteColleague() {
    this.dialogRef.close(false);
    this.dialog.open(InviteColleagueDialog, {
      width: '80%',
      maxWidth: '600px',
      data: this.data,
    });
  }
  onNoClick() {
    this.dialogRef.close(false);
  }
  onYesClick() {
    this.dialogRef.close(this.createUserFrom.controls.email.value);

    this.userData = {
      ownerOrganisationName: this.createUserFrom.controls.organization.value,
      responsibleUserEmail: this.createUserFrom.controls.email.value,
      invitationText: '',
      tradeName: this.data.selectMaterial['displayName'],
      displayName: this.data.selectMaterial['displayName'],
    };
    this.http
      .callService(
        new Method(
          environment.services.newSupplier(this.data.unitId, 'INFLOW'),
          this.userData,
          'post'
        )
      )
      .subscribe((res) => {
        this.commonService.lastCreateMaterial = {
          id: res['id'],
          type: 'INFLOW',
        };
        this.router.navigate(['/cti/materials']);
      });
  }
}
