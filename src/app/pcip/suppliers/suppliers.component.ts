import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { environment } from '@env/environment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { CommonService } from '@app/core/common.service';

export interface SupplierElement {
  alias: string;
  creationDate: string;
  productCount: number;
  openInvitations: number;
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
})
export class SuppliersComponent implements OnInit, AfterViewInit {
  @Output() activeSupplier = new EventEmitter();
  version: string = environment.version;
  suppliers;
  activePageDetail = false;
  selectedSupplier = {
    id: '',
  };
  supplierResults = [];
  displayedColumns: string[] = [
    'alias',
    'creationDate',
    'productCount',
    'openInvitations',
  ];
  dataSource = new MatTableDataSource(this.supplierResults);
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: ApiRequestService,
    private commonService: CommonService
  ) {
    this.commonService.breadcrumbOne.next('Products');
    this.commonService.breadcrumbTwo.next('List');
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
          environment.services.suppliersList(page, size, direction, active),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.suppliers = res;
        this.suppliers.forEach((item, index) => {
          item.id = item.organisation.id;
        });
        this.supplierResults = this.suppliers;
        this.dataSource = new MatTableDataSource(this.supplierResults);
        // this.dataSource.sort = this.sort;
      });
  }

  showDetail(item: any) {
    this.selectedSupplier = item;
    this.activeSupplier.emit(item);
    this.commonService.selectedSupplier.next(item);
    this.activePageDetail = true;
  }
  closeDetail() {
    this.activePageDetail = false;
    this.selectedSupplier = { id: '' };
    this.activeSupplier.emit(this.selectedSupplier);
    this.commonService.selectedSupplier.next(this.selectedSupplier);
  }
  goToDetail(data: any) {}
  ngOnInit() {}
}
