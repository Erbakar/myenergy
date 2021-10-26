import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '@app/core/common.service';
import { environment } from '@env/environment';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { MatDialog } from '@angular/material/dialog';
import { InviteExistingSupplierDialog } from '@app/shared/dialog/invite-existing-supplier/invite-existing-supplier.component';
import { InviteColleagueDialog } from '../../../shared/dialog/invite-colleague/invite-colleague.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  selectedTab;
  activeUrl;
  navShow = false;
  productId;
  data;
  selectedProduct;
  constructor(
    private activatedRoute: ActivatedRoute,
    public commonService: CommonService,
    public router: Router,
    private dialog: MatDialog,
    public http: ApiRequestService
  ) {
    this.commonService.breadcrumbOne.next('Product');
    this.selectedProduct = JSON.parse(
      sessionStorage.getItem('selectedProduct')
    );
    this.commonService.productId.subscribe((id) => {
      this.productId = id;
      this.productPermissions(this.productId);
    });
  }

  ngOnInit() {}

  productPermissions(id: any) {
    this.http
      .callService(
        new Method(environment.services.productPermissions(id), '', 'get')
      )
      .subscribe((res) => {
        this.data = res;
      });
  }

  inviteExistingSupplier() {
    this.navShow = false;
    const dialogRef = this.dialog.open(InviteExistingSupplierDialog, {
      width: '80%',
      maxWidth: '600px',
      data: this.productId,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
      } catch (error) {}
    });
  }

  inviteColleague() {
    this.navShow = false;
    const dialogRef = this.dialog.open(InviteColleagueDialog, {
      width: '80%',
      maxWidth: '600px',
      data: this.productId,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
      } catch (error) {}
    });
  }
}
