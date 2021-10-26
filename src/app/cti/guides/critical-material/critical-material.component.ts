import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../assets/javascript/patica';
import { MaterialsComponent } from '../../materials/materials.component';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
@Component({
  selector: 'app-critical-material',
  templateUrl: './critical-material.component.html',
  styleUrls: ['./critical-material.component.scss'],
})
export class CriticalMaterialComponent implements OnDestroy, AfterViewInit {
  unitId;
  criticalMaterials;
  selectedCriticalGrup = 'all';
  selectedItems = [];

  criticlaUSA = [
    { name: 'Aluminum (bauxite)' },
    { name: 'Antimony' },
    { name: 'Arsenic' },
    { name: 'Baryte / Barite' },
    { name: 'Beryllium' },
    { name: 'Bismuth' },
    { name: 'Cesium' },
    { name: 'Chromium' },
    { name: 'Fluorspar' },
    { name: 'Gallium' },
    { name: 'Germanium' },
    { name: 'Graphite (natural)' },
    { name: 'Hafnium' },
    { name: 'Helium' },
    { name: 'HREEs' },
    { name: 'Indium' },
    { name: 'Lithium' },
    { name: 'LREEs' },
    { name: 'Magnesium' },
    { name: 'Manganese' },
    { name: 'Niobium' },
    { name: 'PGMs' },
    { name: 'Potash' },
    { name: 'Rhenium' },
    { name: 'Rubidium' },
    { name: 'Scandium' },
    { name: 'Strontium' },
    { name: 'Tantalum' },
    { name: 'Tellurium' },
    { name: 'Tin' },
    { name: 'Titanium' },
    { name: 'Tungsten' },
    { name: 'Uranium' },
    { name: 'Vanadium' },
    { name: 'Zirconium' },
  ];
  criticlaEU = [
    { name: 'Antimony' },
    { name: 'Baryte / Barite' },
    { name: 'Beryllium' },
    { name: 'Bismuth' },
    { name: 'Borate' },
    { name: 'Cobalt' },
    { name: 'Coking coal' },
    { name: 'Fluorspar' },
    { name: 'Gallium' },
    { name: 'Germanium' },
    { name: 'Graphite (natural)' },
    { name: 'Hafnium' },
    { name: 'Helium' },
    { name: 'HREEs' },
    { name: 'Indium' },
    { name: 'LREEs' },
    { name: 'Magnesium' },
    { name: 'Natural rubber' },
    { name: 'Niobium' },
    { name: 'PGMs' },
    { name: 'Phosphate rock' },
    { name: 'Phosphorus' },
    { name: 'Scandium' },
    { name: 'Silicon metal' },
    { name: 'Tantalum' },
    { name: 'Tungsten' },
    { name: 'Vanadium' },
    { name: 'Aluminum (bauxite)' },
    { name: 'Lithium' },
    { name: 'Titanium' },
    { name: 'Strontium' },
  ];
  circularAll = [
    { name: 'Aluminum (bauxite)' },
    { name: 'Antimony' },
    { name: 'Arsenic' },
    { name: 'Baryte / Barite' },
    { name: 'Beryllium' },
    { name: 'Bismuth' },
    { name: 'Borate' },
    { name: 'Cesium' },
    { name: 'Chromium' },
    { name: 'Cobalt' },
    { name: 'Coking coal' },
    { name: 'Fluorspar' },
    { name: 'Gallium' },
    { name: 'Germanium' },
    { name: 'Graphite (natural)' },
    { name: 'Hafnium' },
    { name: 'Helium' },
    { name: 'HREEs' },
    { name: 'Indium' },
    { name: 'Lithium' },
    { name: 'LREEs' },
    { name: 'Magnesium' },
    { name: 'Manganese' },
    { name: 'Natural rubber' },
    { name: 'Niobium' },
    { name: 'PGMs' },
    { name: 'Phosphate rock' },
    { name: 'Phosphorus' },
    { name: 'Potash' },
    { name: 'Rhenium' },
    { name: 'Rubidium' },
    { name: 'Scandium' },
    { name: 'Silicon metal' },
    { name: 'Strontium' },
    { name: 'Tantalum' },
    { name: 'Tellurium' },
    { name: 'Tin' },
    { name: 'Titanium' },
    { name: 'Tungsten' },
    { name: 'Uranium' },
    { name: 'Vanadium' },
    { name: 'Zirconium' },
  ];
  constructor(
    private materialsComponent: MaterialsComponent,
    private http: ApiRequestService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    public router: Router
  ) {
    this.unitId = localStorage.getItem('unitId');
    openPatica();
    goToModulePatica(6, '65683b137ba21dcd0213848ef01d5066');
    if (this.unitId) {
      this.getCritical();
    }
  }
  ngAfterViewInit() {}
  ngOnDestroy() {
    hidePatica();
  }
  getCritical() {
    this.http
      .callService(
        new Method(environment.services.critical(this.unitId), '', 'get')
      )
      .subscribe((res) => {
        this.criticalMaterials = res;
        this.criticlaEU.forEach((element) => {
          this.criticalMaterials.forEach((item) => {
            if (element.name === item) {
              element['selected'] = true;
              this.selectedItems.push(element.name);
            }
          });
        });
        this.criticlaUSA.forEach((element) => {
          this.criticalMaterials.forEach((item) => {
            if (element.name === item) {
              element['selected'] = true;
              this.selectedItems.push(element.name);
            }
          });
        });
        this.circularAll.forEach((element) => {
          this.criticalMaterials.forEach((item) => {
            if (element.name === item) {
              element['selected'] = true;
              this.selectedItems.push(element.name);
            }
          });
        });
      });
  }
  selectItem(item: string) {
    const index = this.selectedItems.indexOf(item);
    if (index === -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }
  }

  save() {
    this.http
      .callService(
        new Method(
          environment.services.critical(this.unitId),
          this.selectedItems,
          'put'
        )
      )
      .subscribe(async (res) => {
        this.materialsComponent.hideModal();
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
        this.materialsComponent.getInflows(this.unitId, 'INFLOW', 1, 10);
      });
  }
  cancel() {
    this.materialsComponent.hideModal();
  }
}
