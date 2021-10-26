import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewUserDialogComponent } from '../../shared/dialog/new-user/new-user.component';
import { NewSupplierDialogComponent } from '@app/shared/dialog/new-supplier/new-supplier.component';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../assets/javascript/patica';
import { MaterialsComponent } from '../materials/materials.component';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.scss'],
})
export class AddMaterialComponent implements OnInit, OnDestroy {
  unitId;
  users;
  suppliers = [];
  dontShow = false;
  showCotinue = false;
  categoryhidden = false;
  supplierInfoDontShow;
  addColleagueMail;
  addColleagueId;
  addSupplierMail;
  suppliersRes;
  material = {
    displayName: '',
    category: '',
    ownership: '',
    hasData: '',
    responsibleUserEmail: '',
    suppliers: '',
    colleague: '',
  };

  constructor(
    private http: ApiRequestService,
    private materialsComponent: MaterialsComponent,
    public router: Router,
    public route: ActivatedRoute,
    public commonService: CommonService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.unitId = localStorage.getItem('unitId');
    this.supplierInfoDontShow = localStorage.getItem('supplierInfoDontShow');
    if (this.commonService.addmaterialType === 'INFLOW') {
      this.material['category'] = 'INFLOW';
      this.categoryhidden = true;
    }
    if (this.commonService.addmaterialType === 'OUTFLOW') {
      this.material['category'] = 'OUTFLOW';
      this.categoryhidden = true;
    }
    const category = this.material['category'];
    if (category === 'OUTFLOW') {
      goToModulePatica(6, '7d5b2109b74488f8d2b437daaeb8c21b');
    } else {
      goToModulePatica(6, '1586960736994');
    }
    openPatica();
  }
  categoryChange() {
    this.material['hasData'] = '';
    this.material['ownership'] = '';
  }
  hasDataChange() {
    this.material['ownership'] = '';
    goToModulePatica(6, '761fe0cb67f1c287b809c787371d2364');
  }
  hide(dontShow: any) {
    this.showCotinue = true;
    if (dontShow) {
      localStorage.setItem('supplierInfoDontShow', dontShow);
    }
  }
  createMaterial(material: any, isAddUser: any) {
    material['tradeName'] = material['displayName'];
    material['unitId'] = this.unitId;
    if (!isAddUser) {
      if (material['hasData'] === 'SUPPLIER HAS THE DATA') {
        material['responsibleUserEmail'] = material['suppliers'];
        const data = {
          unitId: this.unitId,
          displayName: material['displayName'],
          responsibleUserEmail: material['responsibleUserEmail'],
          tradeName: material['displayName'],
        };
        this.http
          .callService(
            new Method(
              environment.services.addSuppliers(
                this.unitId,
                material['category']
              ),
              data,
              'post'
            )
          )
          .subscribe((res) => {
            this.commonService.lastCreateMaterial = {
              id: res['id'],
              type: material['category'],
            };
            this.materialsComponent.hideModal();
            this.materialsComponent.initData();
          });
      } else {
        material['responsibleUserEmail'] = '';
        if (material['ownership'] === 'COLLEAGUE') {
          material['responsibleUserEmail'] = material['colleague'];
        } else {
          material['responsibleUserEmail'] = '';
        }
        this.http
          .callService(
            new Method(
              environment.services.addMaterial(
                this.unitId,
                material['category']
              ),
              material,
              'post'
            )
          )
          .subscribe((res) => {
            this.commonService.lastCreateMaterial = {
              id: res['id'],
              type: material['category'],
            };
            this.materialsComponent.hideModal();
            this.materialsComponent.initData();
          });
      }
    } else {
      this.http
        .callService(
          new Method(
            environment.services.addMaterial(
              localStorage.getItem('unitId'),
              material['category']
            ),
            this.material,
            'post'
          )
        )
        .subscribe((res) => {
          this.commonService.lastCreateMaterial = {
            id: res['id'],
            type: material['category'],
          };
          this.materialsComponent.hideModal();
          this.materialsComponent.initData();
        });
    }
  }

  addUser(material: any): void {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      width: '80%',
      maxWidth: '600px',
      data: material,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.addColleagueMail = result['email'];
        this.addColleagueId = result['userId'];
        material['responsibleUserEmail'] = result['email'];
        this.createMaterial(material, true);
        this.getUser();
      } catch (error) {}
    });
  }

  addSupplier(material: string): void {
    if (material) {
      const dialogRef = this.dialog.open(NewSupplierDialogComponent, {
        width: '80%',
        maxWidth: '600px',
        data: { unitId: this.unitId, selectMaterial: material },
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (!result) {
          return;
        }
        try {
          this.addSupplierMail = result;
          this.getSuppliers();
        } catch (error) {}
      });
    } else {
      this.snackBar.open('Material name is required', '', {
        duration: 5000,
        panelClass: ['error-snackBar'],
      });
    }
  }

  ngOnInit() {
    this.getUser();
    this.getSuppliers();
  }
  ngOnDestroy() {
    hidePatica();
  }
  getUser() {
    this.http
      .callService(
        new Method(environment.services.user() + '?size=999', '', 'get')
      )
      .subscribe((res) => {
        const newUserArray = [];
        res['results'].forEach((element) => {
          if (element.email !== localStorage.getItem('user-email')) {
            newUserArray.push(element);
          }
        });
        this.users = newUserArray;
        if (this.addColleagueMail) {
          this.material.colleague = this.addColleagueMail;
        }
      });
  }
  getSuppliers() {
    this.http
      .callService(new Method(environment.services.suppliers(999), '', 'get'))
      .subscribe((res) => {
        this.suppliersRes = res;
        if (this.addSupplierMail) {
          this.material.suppliers = this.addColleagueMail;
        }
      });
  }
  inviteColleague(val: string) {
    this.material.colleague = val;
  }

  inviteSupplier(val: string) {
    this.material.suppliers = val;
  }
  cancel() {
    this.materialsComponent.hideModal();
  }
  goToPatica() {
    if (this.material['category'] === 'INFLOW') {
      goToModulePatica(6, '569254f95416cf001c61a5421707786c');
    } else {
      goToModulePatica(6, '7d5b2109b74488f8d2b437daaeb8c21b');
    }
  }
}
