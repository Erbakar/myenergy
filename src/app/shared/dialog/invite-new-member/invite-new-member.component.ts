import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'invite-new-member.component-dialog',
  templateUrl: './invite-new-member.component.html',
  styleUrls: ['./invite-new-member.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class InviteNewMemberDialog {
  createUserFrom: FormGroup;
  level;
  constructor(
    private http: ApiRequestService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<InviteNewMemberDialog>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.level = data;
    this.createUserFrom = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      message: [null, []],
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.http
      .callService(
        new Method(
          environment.services.membersOfBusinessLevel(this.level['id']),
          this.createUserFrom.value,
          'post'
        )
      )
      .subscribe((res) => {
        if (res) {
          this.snackBar.open(
            `You have successfully added a new member to ${this.level.name}`,
            '',
            {
              duration: 5000,
              panelClass: ['success-snackBar'],
            }
          );
          this.dialogRef.close(res);
        }
      });
  }
}
