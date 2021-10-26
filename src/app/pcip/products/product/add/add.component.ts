import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PRODUCT {
  id: string;
}
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  encapsulation: ViewEncapsulation.None;
  ContinueForm: FormGroup;
  areYouProducer;
  name;
  productList;
  cloneProductId;
  supplierstMail;
  tradeNumaber;
  matcher;
  productId;
  message;
  suppliersList;
  forbiddenWeight;
  fileToUpload: File = null;
  infoType;
  fileUploadName;
  easy;
  error = false;
  accessible;
  subData;
  supplierName;
  supplierMiddleName;
  supplierLastName;
  supplierOrganisationName;
  supplierNewMail;
  cvsUploadResponse;
  isNewUser: boolean;

  constructor(
    public commonService: CommonService,
    private http: ApiRequestService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.ContinueForm = new FormGroup({
      weight: new FormControl(null, [Validators.required]),
      connectons: new FormControl(null, [Validators.required]),
    });
  }
  csvFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileUploadName = this.fileToUpload.name;
    const formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.http
      .callService(
        new Method(environment.services.addProductCSV(), formData, 'post')
      )
      .subscribe((res) => {
        this.cvsUploadResponse = res;
        this.http
          .callService(
            new Method(
              environment.services.uploadCSV(),
              this.cvsUploadResponse,
              'post'
            )
          )
          .subscribe((response) => {
            this.router.navigateByUrl('/products');
          });
      });
  }

  productNameList() {
    this.http
      .callService(
        new Method(environment.services.productNameList(), '', 'get')
      )
      .subscribe((res) => {
        this.productList = res;
      });
  }

  getSuppliersList() {
    this.http
      .callService(new Method(environment.services.suppliersList(), '', 'get'))
      .subscribe((res) => {
        this.suppliersList = res;
      });
  }

  selectProductId(id: any) {
    this.cloneProductId = id;
  }

  selectSuppliersId(mail: any) {
    this.supplierstMail = mail;
  }

  inviteSupplier() {
    const data = {
      displayName: this.name,
      tradeNumber: this.tradeNumaber,
    };
    if (data.displayName && data.tradeNumber) {
      this.http
        .callService(
          new Method(environment.services.addProduct(), data, 'post')
        )
        .subscribe((res) => {
          this.productId = res['id'];
          if (!this.isNewUser) {
            this.subData = {
              email: this.supplierstMail,
              text: this.message,
            };
          } else {
            this.subData = {
              firstName: this.supplierName,
              middleName: this.supplierMiddleName,
              lastName: this.supplierLastName,
              organisationName: this.supplierOrganisationName,
              email: this.supplierNewMail,
              text: this.message,
            };
          }
          this.http
            .callService(
              new Method(
                environment.services.createSuppliers(
                  this.productId,
                  this.isNewUser
                ),
                this.subData,
                'post'
              )
            )
            .subscribe((response) => {
              this.router.navigateByUrl('/products');
            });
        });
    } else {
      // this.snackBar.open('all field is required', '', {
      //     duration: 5000,
      //    panelClass: ['success-snackBar']
      // });
      this.error = true;
    }
  }
  cloneProduct() {
    if (this.cloneProductId) {
      this.http
        .callService(
          new Method(
            environment.services.cloneProduct(this.cloneProductId),
            '',
            'post'
          )
        )
        .subscribe((res) => {
          const id = res['id'];
          if (id) {
            const data = {
              displayName: this.name,
              tradeNumber: this.tradeNumaber,
              pictures: [],
            };
            if (data.displayName && data.tradeNumber) {
              this.http
                .callService(
                  new Method(environment.services.cloneProduct(id), data, 'put')
                )
                .subscribe((respone) => {
                  this.router.navigateByUrl('/products');
                });
            } else {
              // this.snackBar.open('all field is required', '', {
              //     duration: 5000,
              //    panelClass: ['success-snackBar']
              // });
              this.error = true;
            }
          }
        });
    }
  }

  onContinue() {
    const data = {
      displayName: this.name,
      tradeNumber: this.tradeNumaber,
      // easyDisassembly: this.easy,
      // connectionAccessible: this.accessible,
      // weight: this.ContinueForm.value.weight,
      // connectionType: this.ContinueForm.value.connectons
    };
    if (data.displayName && data.tradeNumber) {
      // if (data.displayName && data.tradeNumber && data.weight && data.connectionType) {
      this.http
        .callService(
          new Method(environment.services.addProduct(), data, 'post')
        )
        .subscribe((res) => {
          if (res) {
            this.router.navigateByUrl('/products');
          }
        });
    } else {
      // this.snackBar.open('all field is required', '', {
      //     duration: 5000,
      //    panelClass: ['success-snackBar']
      // });
      this.error = true;
    }
  }
}
