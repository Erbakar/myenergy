import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { CommonService } from '@app/core/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../assets/javascript/patica';
import { MatDialog } from '@angular/material/dialog';
import { PcipReportDialog } from '@app/shared/dialog/pcip-report-dialog/pcip-report-dialog.component';
import { DeleteConfirmDialog } from '@app/shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import { PublishConfirmDialog } from '@app/shared/dialog/publish-confirm-dialog/publish-confirm-dialog.component';
import { InviteExistingSupplierDialog } from '@app/shared/dialog/invite-existing-supplier/invite-existing-supplier.component';
declare var $: any;
import Cohere from 'cohere-js';
Cohere.init('yrGrY9CgNTNuCuz0gnyQPRGx');
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  version: string = environment.version;
  products;
  activePageDetail = false;
  selectedProduct = { id: 0 };
  selectedProductId;
  productImage;
  productResults = [];
  spreadsheetuuid;
  productMetaUuid;
  isShowPatica = false;
  isHidePatica = false;
  displayedColumns: string[] = [
    'displayName',
    'tradeNumber',
    'status',
    'transitionDate',
    'owner',
  ];
  dataSource = new MatTableDataSource(this.productResults);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('myPond') myPond: any;
  pondOptions;

  constructor(
    private http: ApiRequestService,
    private httpClient: HttpClient,
    private commonService: CommonService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.commonService.openPatica.subscribe((res) => {
      if (res) {
        $('.patica-sidebar').css('top', 160);
        goToModulePatica(9, '8587c272259f85745d9f2958888298ed');
        openPatica();
      } else {
        hidePatica();
      }
    });
    this.pondOptions = {
      class: 'my-filepond',
      multiple: false,
      labelIdle: 'Upload product image',
      server: {
        url: environment.serverUrl,
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const snack = this.snackBar;
          const formData = new FormData();
          formData.append('file', file, file.name);
          const request = new XMLHttpRequest();
          request.open(
            'POST',
            environment.serverUrl + environment.services.upload()
          );
          request.upload.onprogress = (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          };
          var currentComp = this.selectedProduct;
          request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
              setTimeout(() => {
                load(request.responseText);

                const image = JSON.parse(request.responseText);

                const token = JSON.parse(sessionStorage.getItem('credentials'))
                  .authToken;
                const data = {
                  pictures: [image],
                  displayName: currentComp['displayName'],
                };
                fetch(
                  environment.serverUrl +
                    environment.services.cloneProduct(currentComp['id']),
                  {
                    headers: {
                      'x-auth-token': token,
                      'Content-Type': 'application/json',
                    },
                    method: 'PUT',
                    body: JSON.stringify(data),
                  }
                )
                  .then((res) => res.json())
                  .then((res) => {
                    if (res['message']) {
                      alert(res['message']);
                    }
                  });
              }, 200);
            } else {
              var msg;
              if (request.response) {
                msg = JSON.parse(request.response)['message'];
              }
              if (!msg) {
                msg = 'unable to upload file';
              }
              snack.open(msg, '', {
                duration: 5000,
                panelClass: ['error-snackBar'],
              });
              error();
            }
          };
          request.send(formData);
          return {
            abort: () => {
              request.abort();
              abort();
            },
          };
        },
        revert: (uniqueFileId, load, error) => {
          error(error);
          load((res) => {});
        },
        load: (uniqueFileId, load, error) => {
          fetch(uniqueFileId)
            .then((res) => res.blob())
            .then((res) => {
              load(new File([res], '', { type: 'image' }));
            })
            .catch(error);
        },
      },
    };
  }

  generateReportIframe(value: any) {
    var isAnalyst = false;
    JSON.parse(sessionStorage.getItem('credentials')).roles.forEach((role) => {
      if (role.name.toUpperCase() === 'ANALYST') {
        isAnalyst = true;
      }
    });
    if (value == 'pcip' && !isAnalyst) {
      this.downloadManualPCIP();
      return;
    }
    if (!this.productMetaUuid) {
      alert('Published product could not be found');
      return;
    }
    const dialogRef = this.dialog.open(PcipReportDialog, {
      width: '96%',
      maxWidth: '96%',
      data: {
        type: value,
        productId: this.productMetaUuid,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
      } catch (error) {}
    });
  }

  openCohere() {
    Cohere.identify('yrGrY9CgNTNuCuz0gnyQPRGx', {
      displayName: 'Kadir Erbakar',
      email: 'kadir@circular-iq.com',
    });
    Cohere.showCode();
  }

  downloadManualPCIP() {
    const fileUrl =
      'https://frontend-playground.s3.us-east-2.amazonaws.com/pcip_reports/' +
      this.selectedProduct.id +
      '.pdf';
    this.httpClient.head(fileUrl, {}).subscribe(
      (res) => {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        this.httpClient
          .get(fileUrl, { headers: headers, responseType: 'blob' })
          .subscribe((fileData) => {
            let b: any = new Blob([fileData], { type: 'application/pdf' });
            var downloadURL = window.URL.createObjectURL(fileData);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = 'pcip_report.pdf';
            link.click();
          });
      },
      (er) => {
        if (er.status == 403) {
          this.snackBar.open('Report not found', '', {
            duration: 5000,
            panelClass: ['error-snackBar'],
          });
        } else {
          this.snackBar.open('Unable to download report', '', {
            duration: 5000,
            panelClass: ['error-snackBar'],
          });
          console.log(er);
        }
      }
    );
  }

  getLens() {
    this.http
      .callService(
        new Method(
          environment.services.columns(`?lens=pcr&lens=pcip`),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.commonService.lensData = res;
      });
  }

  pageEvent(pageInfo: any) {
    this.getProducts(
      pageInfo['pageIndex'] + 1,
      pageInfo['pageSize'],
      null,
      null
    );
  }

  sortEvent(data: any) {
    const direction = data.direction === 'asc' ? 'ASCENDING' : 'DESCENDING';
    const active = data.active === 'displayName' ? 'NAME' : null;
    this.getProducts(1, 10, direction, active);
  }
  ngAfterViewInit() {
    this.getProducts(1, 10, null, null);
  }
  ngOnDestroy() {
    hidePatica();
  }
  getProducts(page: Number, size: Number, direction?: String, active?: String) {
    this.http
      .callService(
        new Method(
          environment.services.productsList(page, size, direction, active),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.products = res;
        this.productResults = this.products.results;
        this.dataSource = new MatTableDataSource(this.productResults);
        // this.dataSource.sort = this.sort;
        this.route.params.subscribe((res2) => {
          if (res2 !== undefined && this.productResults.length > 0) {
            this.productResults.forEach((element) => {
              if (element['id'] === res2['id']) {
                this.selectedProductId = res2['id'];
                this.triggerShow(element);
              }
            });
          }
        });
      });
  }
  showDetail(product: any) {
    this.router.navigate([`/products/${product.id}`]);
  }
  triggerShow(product: any) {
    if (this.myPond) {
      this.myPond.removeFiles();
    }
    this.productImage = null;
    this.selectedProduct = product;
    this.commonService.productId.next(product.id);
    this.activePageDetail = true;
    this.router.navigate([`/products/${product.id}`]);
    this.productMetaUuid = null;
    this.spreadsheetuuid = null;
    this.http
      .callService(
        new Method(environment.services.spreadsheetId(product.id), '', 'get')
      )
      .subscribe((res) => {
        if (res) {
          this.productMetaUuid = res['product_meta_uuid'];
          this.spreadsheetuuid = res['spreadsheet_uuid'];
        }
      });
    this.http
      .callService(
        new Method(
          environment.services.productSummary(product.id, false),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        if (res['pictures'][0] && res['pictures'][0]['fileName']) {
          this.productImage =
            environment.serverUrl +
            '/assets/download/' +
            res['pictures'][0]['fileName'];
        }
      });
  }
  goToSpreadsheetPage() {
    if (this.spreadsheetuuid) {
      this.router.navigate([
        `/products/spreadsheet/${this.spreadsheetuuid}/${this.selectedProductId}`,
      ]);
    } else {
      this.snackBar.open('Spreadsheet could not be created', '', {
        duration: 5000,
        panelClass: ['error-snackBar'],
      });
    }
  }
  closeDetail() {
    this.router.navigate([`/products`]);
    this.activePageDetail = false;
    this.isShowPatica = false;
    this.isHidePatica = false;
    this.selectedProduct = { id: 0 };
  }
  openPatica() {
    this.isShowPatica = true;
    this.isHidePatica = false;
  }
  closePatica() {
    this.isShowPatica = false;
    this.isHidePatica = true;
  }

  inviteSupplier() {
    const dialogRef = this.dialog.open(InviteExistingSupplierDialog, {
      width: '80%',
      maxWidth: '500px',
      data: `${this.selectedProduct['id']}`,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.router.navigate([`/products`]);
      }
    });
  }

  publish() {
    const dialogRef = this.dialog.open(PublishConfirmDialog, {
      width: '80%',
      maxWidth: '500px',
      data: {
        title: `${this.selectedProduct['displayName']}`,
        message:
          'Are you sure you want to publish this product? Please confirm.',
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
              environment.services.authorizeProduct(
                this.selectedProduct.id.toString()
              ),
              {},
              'put'
            )
          )
          .subscribe((res) => {
            this.snackBar.open('Product published successfully', '', {
              duration: 5000,
              panelClass: ['success-snackBar'],
            });
          });
      } catch (error) {}
    });
  }

  removeItem() {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '80%',
      maxWidth: '500px',
      data: {
        title: `${this.selectedProduct['displayName']}`,
        message:
          'Are you sure you want to delete this product? Please confirm.',
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
              environment.services.removeProject(this.selectedProduct.id),
              '',
              'delete'
            )
          )
          .subscribe((res) => {
            this.closeDetail();
          });
      } catch (error) {}
    });
  }
  ngOnInit() {
    this.getLens();
  }
}
