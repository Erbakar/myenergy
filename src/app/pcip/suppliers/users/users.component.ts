import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { environment } from '@env/environment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { CommonService } from '@app/core/common.service';
import { ActivatedRoute, Router } from '@angular/router';
export interface SupplierElement {
  fullname: string;
  email: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  version: string = environment.version;
  users;
  supplierId;
  usersResults = [];
  displayedColumns: string[] = ['fullname', 'email'];
  dataSource = new MatTableDataSource(this.usersResults);
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: ApiRequestService,
    public router: Router,
    public route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.commonService.breadcrumbOne.next('Products');
    this.commonService.breadcrumbTwo.next('List');
    this.supplierId = sessionStorage.getItem('supplierId');
  }

  pageEvent(pageInfo: any) {
    this.getProducts(pageInfo.pageIndex + 1, pageInfo.pageSize);
  }

  sortEvent(data: any) {
    const direction = data.direction === 'asc' ? 'ASCENDING' : 'DESCENDING';
    const active = data.active === 'displayName' ? 'NAME' : null;
    this.getProducts(1, 1, direction, active);
  }
  ngAfterViewInit() {
    this.getProducts(1, 1, null, null);
  }

  getProducts(page: Number, size: Number, direction?: String, active?: String) {
    this.http
      .callService(
        new Method(
          environment.services.usersOfSupplier(this.supplierId),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.users = res;
        this.usersResults = this.users;
        this.dataSource = new MatTableDataSource(this.usersResults);
        // this.dataSource.sort = this.sort;
      });
  }
  goToDetail(data: any) {}
  ngOnInit() {}
}
