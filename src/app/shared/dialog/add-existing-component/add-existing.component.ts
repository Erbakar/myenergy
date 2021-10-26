import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
@Component({
  selector: 'add-existing-component-dialog',
  templateUrl: './add-existing.component.html',
  styleUrls: ['./add-existing.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class AddExistingComponentDialog {
  productId;
  items;
  Product = [];
  Material = [];
  Supplier = [];
  selectItems = [];
  constructor(
    private http: ApiRequestService,
    public dialogRef: MatDialogRef<AddExistingComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.productId = data;
    this.http
      .callService(
        new Method(environment.services.bomListOther(data), '', 'get')
      )
      .subscribe((res) => {
        this.items = res;
        this.items.forEach((element) => {
          if (element.bomType === 'Product') {
            this.Product.push(element);
          }
          if (element.bomType === 'Material') {
            this.Material.push(element);
          }
          if (element.bomType === 'Supplier') {
            this.Supplier.push(element);
          }
        });
      });
  }

  selectItem(item: any, event: any) {
    if (event.checked) {
      this.selectItems.push(item);
    } else {
      const i = this.selectItems.findIndex(
        (order) => order.bomItemId === item.bomItemId
      );
      if (i !== -1) {
        this.selectItems.splice(i, 1);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.selectItems.forEach((element) => {
      this.http
        .callService(
          new Method(
            environment.services.createBomComponent(this.productId),
            element,
            'post'
          )
        )
        .subscribe((res) => {});
    });
    this.dialogRef.close(true);
  }
}
