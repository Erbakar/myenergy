import { Component, OnInit, Input } from '@angular/core';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '@app/core/common.service';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss'],
})
export class SupplierDetailComponent implements OnInit {
  @Input() activeSupplier: any;
  public data;
  public isActive;
  public selectedTab = 0;
  public supplierId;
  public isEvent = false;
  constructor(
    private http: ApiRequestService,
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.activeSupplier['id']) {
      this.supplierId = this.activeSupplier['id'];
      sessionStorage.setItem('supplierId', this.supplierId);
      this.supplierDetail(this.supplierId, '', 'get');
      this.isEvent = true;
    }

    this.commonService.selectedSupplier.subscribe((res) => {
      if (res['id'] && !this.isEvent) {
        this.supplierId = res['id'];
        sessionStorage.setItem('supplierId', this.supplierId);
        this.supplierDetail(this.supplierId, '', 'get');
      }
    });
  }
  supplierDetail(id: any, data: any, request: string) {
    this.http
      .callService(
        new Method(environment.services.supplierDetail(id), data, request)
      )
      .subscribe(async (res) => {
        this.data = res;
        this.isActive = res['active'];
        if (request === 'put' && res) {
          this.snackBar.open(
            await this.translateService
              .get('transactionSuccessful')
              .pipe(first())
              .toPromise(),
            '',
            {
              duration: 5000,
              panelClass: ['success-snackBar'],
            }
          );
        }
      });
  }

  saveChangeSupplier(data: any) {
    data.active = this.isActive;
    this.supplierDetail(this.supplierId, data, 'put');
  }

  tabChanged(t: any) {
    this.selectedTab = t.index;
  }
}
