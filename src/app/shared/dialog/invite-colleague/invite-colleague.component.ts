import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { NewUserDialogComponent } from '../new-user/new-user.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'invite-colleague.component-dialog',
  templateUrl: './invite-colleague.component.html',
  styleUrls: ['./invite-colleague.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class InviteColleagueDialog {
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filterItems = this.filtering(value);
  }
  selectedProduct;
  message;
  resObj = {};
  resObj2 = {};
  resObj3 = {};
  items = [];
  filterItems;
  supplierData;
  isNewUser = true;
  isDisabled = true;
  isShowOtherFields = false;
  companyName;
  selectColleague;
  email;
  searchMember;
  selectItems = [];
  private _searchTerm: string;

  constructor(
    private http: ApiRequestService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<InviteColleagueDialog>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.selectedProduct = data;
    const credentials = JSON.parse(sessionStorage.getItem('credentials'));
    this.companyName = credentials['organisation']['name'];

    this.message = `Hello ${
      this.selectColleague ? this.selectColleague.firstname : ''
    }, We are currently updating information in our ${
      this.selectedProduct ? this.selectedProduct.tradeName : ''
    } product. We kindly ask that you support us by providing data about this specific  ${
      this.selectColleague ? this.selectColleague.firstname : ''
    }.`;
    this.filterItems = this.items;
    const currentUserId = credentials['userId'];
    this.http
      .callService(new Method(environment.services.companyAdmin(), '', 'get'))
      .subscribe((res) => {
        if (res) {
          this.resObj = res;
          for (const key in this.resObj) {
            if (res.hasOwnProperty(key)) {
              const element = res[key];
              if (element.id !== currentUserId) {
                this.items.push(element);
              }
            }
          }
        }
      });
    this.http
      .callService(new Method(environment.services.productManager(), '', 'get'))
      .subscribe((res) => {
        if (res) {
          this.resObj2 = res;
          for (const key in this.resObj2) {
            if (res.hasOwnProperty(key)) {
              const element = res[key];
              if (element.id !== currentUserId) {
                this.items.push(element);
              }
            }
          }
        }
      });
    this.http
      .callService(new Method(environment.services.dataEntryUser(), '', 'get'))
      .subscribe((res) => {
        if (res) {
          this.resObj3 = res;
          for (const key in this.resObj3) {
            if (res.hasOwnProperty(key)) {
              const element = res[key];
              if (element.id !== currentUserId) {
                this.items.push(element);
              }
            }
          }
        }
      });
  }

  filtering(searchString: string) {
    return this.items.filter(
      (item) =>
        item.fullname.toLowerCase().indexOf(searchString.toLowerCase()) !==
          -1 ||
        item.email.toLowerCase().indexOf(searchString.toLowerCase()) !== -1
    );
  }

  selectItem(item: any) {
    this.selectColleague = item;
    this.message = `Hello ${
      this.selectColleague ? this.selectColleague.firstname : ''
    }, We are currently updating information in our ${
      this.selectedProduct ? this.selectedProduct.tradeName : ''
    } product. We kindly ask that you support us by providing data about this specific  ${
      this.selectColleague ? this.selectColleague.firstname : ''
    }.`;
    this.items.forEach((element) => {
      element.selected = false;
      this.isDisabled = false;
      if (element.id === item.id) {
        element.selected = true;
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  addUser(): void {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      width: '80%',
      maxWidth: '600px',
      data: this.selectedProduct,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        const data = { userId: result.userId, text: '' };
        this.http
          .callService(
            new Method(
              environment.services.responsible(this.selectedProduct.id),
              data,
              'post'
            )
          )
          .subscribe((res) => {
            if (res === null) {
              this.snackBar.open('Invitation sent successfully!', '', {
                duration: 5000,
                panelClass: ['success-snackBar'],
              });
            }
          });
      } catch (error) {}
    });
    this.dialogRef.close(false);
  }

  onYesClick(message: any): void {
    const data = { userId: this.selectColleague['id'], text: message };
    this.http
      .callService(
        new Method(
          environment.services.responsible(this.selectedProduct.id),
          data,
          'post'
        )
      )
      .subscribe((res) => {
        if (res === null) {
          this.snackBar.open('Invitation sent successfully!', '', {
            duration: 5000,
            panelClass: ['success-snackBar'],
          });
        }
      });
    this.dialogRef.close(true);
  }
}
