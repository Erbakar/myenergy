import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { InviteNewMemberDialog } from '../invite-new-member/invite-new-member.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'manage-members-dialog',
  templateUrl: './manage-members-dialog.component.html',
  styleUrls: ['./manage-members-dialog.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class ManageMemebersDialog {
  // tslint:disable-next-line:
  userData;
  members;
  userEmail;
  level;
  isUserAdmin;
  isAdmin;
  memberList = [];
  selectUser = null;
  constructor(
    private http: ApiRequestService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public router: Router,
    // tslint:disable-next-line:typedef
    public dialogRef: MatDialogRef<ManageMemebersDialog>,
    // tslint:disable-next-line:typedef
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    const credentials = JSON.parse(sessionStorage.getItem('credentials'));
    credentials['roles'].forEach((element) => {
      if (element.name === 'Company admin') {
        this.isAdmin = true;
      }
    });
    this.getUser();
    this.getMembers(data.members);
    this.level = data;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
  settings(i: any) {
    if (this.selectUser !== i) {
      this.selectUser = i;
    } else {
      this.selectUser = null;
    }
  }
  addMember(item: any) {
    const index = this.memberList.indexOf(item.id);
    if (index === -1) {
      this.memberList.push(item.id);
      item.added = true;
    } else {
      this.memberList.splice(index, 1);
      item.added = false;
    }
  }

  inviteNewMember() {
    const dialogRef = this.dialog.open(InviteNewMemberDialog, {
      width: '80%',
      maxWidth: '600px',
      data: this.level,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.getMembers(result);
        this.getUser();
        this.clearMemberArray();
      } catch (error) {}
    });
  }

  removeMember(member: any) {
    this.http
      .callService(
        new Method(
          environment.services.removeMembersOfBusinessLevel(
            this.level['id'],
            member.id
          ),
          '',
          'delete'
        )
      )
      .subscribe((res) => {
        this.getMembers(res);
        this.getUser();
        this.clearMemberArray();
        this.selectUser = null;
      });
  }

  addMemberPut() {
    const setData = {
      memberList: this.memberList,
    };
    this.http
      .callService(
        new Method(
          environment.services.membersOfBusinessLevel(this.level['id']),
          setData,
          'put'
        )
      )
      .subscribe((res) => {
        this.getMembers(res);
        this.getUser();
        this.clearMemberArray();
      });
  }

  clearMemberArray() {
    this.members.forEach((element) => {
      element.added = false;
    });
    this.memberList = [];
  }

  getMembers(member: any) {
    this.members = member;
    this.members.forEach((element) => {
      if (element.firstname) {
        element.ff = element.firstname.slice(0, 1);
      }
      if (element.lastname) {
        element.lf = element.lastname.slice(0, 1);
      }
      if (this.userEmail === element.email) {
        element.roles.forEach((role) => {
          if (role.name === 'Company admin') {
            this.isUserAdmin = true;
          }
        });
      }
      element.roles.forEach((role) => {
        if (role.name === 'Company admin') {
          element.admin = true;
        }
      });
    });
  }

  getUser() {
    this.http
      .callService(
        new Method(environment.services.user() + '?size=999', '', 'get')
      )
      .subscribe((res) => {
        this.userData = res['results'];
        this.members.forEach((member) => {
          this.userData.forEach((element, index) => {
            if (element.id === member.id) {
              this.userData.splice(index, 1);
            }
          });
        });
        this.userData.forEach((element, index) => {
          if (element.firstname) {
            element.ff = element.firstname.slice(0, 1);
          }
          if (element.lastname) {
            element.lf = element.lastname.slice(0, 1);
          }
          if (this.userEmail === element.email) {
            element.roles.forEach((role) => {
              if (role.name === 'Company admin') {
                this.isUserAdmin = true;
              }
            });
          }
          element.roles.forEach((role) => {
            if (role.name === 'Company admin') {
              element.admin = true;
            }
          });
        });
      });
  }
}
