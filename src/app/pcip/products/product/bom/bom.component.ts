import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialog } from '@app/shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import { CreateBomDialog } from '@app/shared/dialog/create-bom/create-bom.component';
import { AddExistingComponentDialog } from '@app/shared/dialog/add-existing-component/add-existing.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timeout } from 'q';

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss'],
})
export class BomComponent implements OnInit {
  productId;
  bomList = [];
  data;
  productWeight;
  isOpenNav = false;
  displayedColumns = [
    'edit',
    'productName',
    'numberOfComponets',
    'percentageOfMaterial',
    'percentageOfWeight',
    'status',
    'transitionDate',
    'remove',
    'detail',
  ];
  editId;
  showEdit = false;
  dataSource = new MatTableDataSource(this.bomList);
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public commonService: CommonService,
    public router: Router,
    private dialog: MatDialog,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private http: ApiRequestService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.productId = params.get('id');
      this.getBomList(1, 10, null);
    });
  }
  sortEvent(data: any) {
    const direction = data.direction === 'asc' ? 'ASCENDING' : 'DESCENDING';
    this.getBomList(1, 10, direction);
  }
  getBomList(page: Number, size: Number, direction?: String) {
    this.http
      .callService(
        new Method(
          environment.services.bomList(page, size, direction, this.productId),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.data = res;
        this.bomList = res['components'];
        this.dataSource = new MatTableDataSource(this.bomList);
        this.dataSource.sort = this.sort;
      });
  }
  goToDetail(productId: any) {
    this.router.navigate([`products/${productId}/update`]);
  }
  editBom(item: any) {
    this.editId = item.id;
    this.showEdit = true;
  }
  async saveBom(item: any) {
    this.editId = '';
    this.showEdit = false;
    let itemUsage: any;
    if (item.bomType === 'Material') {
      itemUsage = { percentageOfMaterial: item.percentageOfMaterial };
    }
    if (item.bomType === 'Product') {
      itemUsage = { numberOfComponents: item.numberOfComponents };
    }
    await this.http
      .callService(
        new Method(
          environment.services.editBom(this.productId, item.id),
          { displayName: item.displayName },
          'put'
        )
      )
      .subscribe((res) => {
        if (res) {
          this.snackBar.open('Successfully  Edit', '', {
            duration: 5000,
            panelClass: ['success-snackBar'],
          });
        }
      });
    await this.http.callService(
      new Method(
        environment.services.updateBomProperties(this.productId, item.id),
        itemUsage,
        'put'
      )
    );
    setTimeout(() => {
      this.getBomList(1, 10, null);
    }, 500);
  }
  deleteBom(item: any) {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '80%',
      maxWidth: '430px',
      data: {
        title: `${item.productName}`,
        message: 'Are you sure you want to delete?',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.http
          .callService(
            new Method(
              environment.services.deleteBom(this.productId, item.id),
              '',
              'post'
            )
          )
          .subscribe((res) => {
            if (res) {
              this.getBomList(1, 10);
            }
          });
      } catch (error) {}
    });
  }
  openNav() {
    this.isOpenNav === true
      ? (this.isOpenNav = false)
      : (this.isOpenNav = true);
  }
  createBom() {
    this.isOpenNav = false;
    const dialogRef = this.dialog.open(CreateBomDialog, {
      width: '80%',
      maxWidth: '430px',
      data: {
        title: `Component details`,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        const isGenericMaterial =
          result.isGenericMaterial === true ? 'material' : 'product';
        this.http
          .callService(
            new Method(
              environment.services.createBom(this.productId, isGenericMaterial),
              result,
              'post'
            )
          )
          .subscribe((res) => {
            if (res) {
              this.getBomList(1, 10);
            }
          });
      } catch (error) {}
    });
  }
  createBomOther() {
    this.isOpenNav = false;
    const dialogRef = this.dialog.open(AddExistingComponentDialog, {
      width: '80%',
      maxWidth: '700px',
      data: this.productId,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.getBomList(1, 10, null);
      } catch (error) {}
    });
  }
}
