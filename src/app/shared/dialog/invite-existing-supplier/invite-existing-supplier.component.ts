import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
@Component({
  selector: 'invite-existing-supplier.component-dialog',
  templateUrl: './invite-existing-supplier.component.html',
  styleUrls: ['./invite-existing-supplier.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class InviteExistingSupplierDialog {
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filterItems = this.filtering(value);
  }
  productId;
  message;
  items;
  filterItems;
  new = {};
  supplierData;
  isNewUser = true;
  isDisabled = true;
  create = true;
  isShowOtherFields = false;
  companyName;
  selectSupplier;
  email;
  organisationName;
  searchMember;
  firstName;
  middleName;
  lastName;
  selectItems = [];
  private _searchTerm: string;

  constructor(
    private http: ApiRequestService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InviteExistingSupplierDialog>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.productId = data;
    this.http
      .callService(
        new Method(environment.services.suppliersList(1, 1000), '', 'get')
      )
      .subscribe((res) => {
        this.items = res;
        this.filterItems = this.items;
        if (this.items.length > 0) {
          this.create = false;
        }
      });
    const credentials = JSON.parse(sessionStorage.getItem('credentials'));
    this.companyName = credentials['organisation']['name'];
    this.message = `To map the circular & sustainable performance of our products we need our collective knowledge.
  herefore I am inviting you to connect to the circular IQ platform to provide information about component(s) and/or material(s) for product ${this.companyName}.`;
  }

  filtering(searchString: string) {
    return this.items.filter(
      (item) =>
        item.users[0].fullname
          .toLowerCase()
          .indexOf(searchString.toLowerCase()) !== -1 ||
        item.users[0].email
          .toLowerCase()
          .indexOf(searchString.toLowerCase()) !== -1
    );
  }

  selectItem(item: any) {
    this.selectSupplier = item;
    this.items.forEach((element) => {
      element.selected = false;
      this.isDisabled = false;
      if (element.organisation.id === item.organisation.id) {
        element.selected = true;
      }
    });
  }

  emailVal(email: any) {
    // if (email.indexOf('@') !== -1 && email.indexOf('.') !== -1 && email.indexOf('com') !== -1) {
    this.http
      .callService(
        new Method(environment.services.checkEmail(email), '', 'get')
      )
      .subscribe((res) => {
        this.isDisabled = false;
        if (res) {
          this.new = res;
          this.isNewUser = false;
        }
        this.isShowOtherFields = true;
      });
    // }
    // else {
    //   this.isShowOtherFields = false;
    // }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  createNewSupplier(item: any, message: any) {
    if (this.isNewUser) {
      this.supplierData = {
        email: item.email,
        text: message,
        organisationName: item.organisationName,
        firstName: item.firstname,
        middleName: item.middlename,
        lastName: item.lastname,
      };
    } else {
      this.supplierData = {
        email: item.email,
        text: message,
        organisationName: item.organisationName,
      };
    }
    this.http
      .callService(
        new Method(
          environment.services.invitationsProduct(
            this.productId,
            this.isNewUser
          ),
          this.supplierData,
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

  onYesClick(message: any): void {
    const data = {
      email: this.selectSupplier['users'][0]['email'],
      text: message,
    };
    this.http
      .callService(
        new Method(
          environment.services.invitationsProduct(this.productId, false),
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
