import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { ConfirmDialog } from '@app/shared/dialog/confirm-dialog/confirm-dialog.component';

import { ProcurementsService } from '@app/myEnergy/procurements/procurements.service';
import { MyenergyGoalsVideoDialog } from '@app/shared/dialog/myenergy-goals-video/myenergy-goals-video.component';
import { element } from 'protractor';
import { MyenergyInvaiteSupplier } from '@app/shared/dialog/myenergy-invaite-supplier/myenergy-invaite-supplier.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent {
  showMoreLabels = false;
  familyData;
  activePurchasTab = 0;
  labelsButtonActive = false;
  critariaButtonActive = false;
  allprocurementData;
  allSelectedClass1 = false;
  allSelectedClass2 = false;
  criteriaData;
  allCriteria;
  labelsData;
  labelsSplitData;
  labelUuids;
  criteriaArray = [];
  supplierList;
  selectedSuppliers = [];
  recommendationId;
  subCategories;
  categoryData;
  showLabelsForm = false;
  criteriaForm: FormGroup;
  labelsForm: FormGroup;
  supplierForm: FormGroup;
  controls;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public procurementsService: ProcurementsService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // this.infoVideoModal('recommendation');
    this.router.navigate([`/myenergy/product-recommendation/new/detail`]);
    if (!sessionStorage.getItem('allCriteria')) {
      this.procurementsService.allCriteria().then((res) => {
        this.allCriteria = res;
        sessionStorage.setItem('allCriteria', JSON.stringify(this.allCriteria));
      });
    } else {
      this.allCriteria = JSON.parse(sessionStorage.getItem('allCriteria'));
    }

    if (!sessionStorage.getItem('categoryData')) {
      this.procurementsService.getCategory().then((res) => {
        this.categoryData = res;
        sessionStorage.setItem(
          'categoryData',
          JSON.stringify(this.categoryData)
        );
      });
    } else {
      this.categoryData = JSON.parse(sessionStorage.getItem('categoryData'));
    }
    this.router.events.subscribe(async (val) => {
      if (val instanceof NavigationEnd) {
        const routeParams = this.activatedRoute.snapshot.paramMap;
        if (routeParams.get('activeTab') === 'confirm') {
          console.log('confirm');
          this.getRecommendation(routeParams.get('recommendationId'));
        }
      }
    });
  }
  getRecommendation(recommendationId: any) {
    this.procurementsService.getRecommendation(recommendationId).then((res) => {
      this.activePurchasTab = 2;
      const path = `/myenergy/product-recommendation/${recommendationId}/confirm`;
      setTimeout(() => {
        this.router.navigate([path]);
      }, 500);
      this.allprocurementData = res;
      this.labelUuids = this.allprocurementData.labels;
      (this.familyData = {
        description: this.allprocurementData.description,
        brick_uuid: this.allprocurementData.brick_uuid,
      }),
        (this.selectedSuppliers = this.allprocurementData.suppliers);
      this.criteriaArray = this.allprocurementData.criteria;
    });
  }

  close() {
    alert('what will happen when this button is click?');
  }
  selectedCategory(categoryId: any) {
    this.categoryData.forEach((ele) => {
      if (ele.uuid === categoryId) {
        this.subCategories = ele.subCategories;
      }
    });
  }

  async selectedSubCategory(familyData: any) {
    this.familyData = familyData;
    if (this.familyData.req) {
      await this.allCriteria.forEach((item) => {
        item.criteria.forEach((cr) => {
          cr.match = false;
        });
      });
      await this.procurementsService
        .subCategoryCriteria(familyData.brick_uuid)
        .then((res) => {
          this.allCriteria.forEach((item) => {
            item.criteria.forEach((cr) => {
              res.forEach((ri) => {
                if (ri.uuid === cr.uuid) {
                  cr.match = true;
                }
              });
            });
          });
          this.criteriaData = res;
          this.labelsSplitData = '';
          this.createCriteriaForm();
        });
    }
  }
  selectLabelList(match?: any, index?: any) {
    this.labelUuids = [];
    for (const [key, value] of Object.entries(this.labelsForm.value.labels)) {
      if (value === true) {
        this.labelUuids.push(key);
      }
      this.labelsData.forEach((lab) => {
        if (key === lab.uuid) {
          lab.selected = value;
        }
      });
      this.labelsButtonActive = this.labelUuids.length > 0 ? true : false;
    }
    if (match) {
      const isAllSelected = this.labelsData.some(
        (lab) => lab.match === match && lab.selected === false
      );
      if (index === 0) {
        this.allSelectedClass1 = !isAllSelected;
      }
      if (index === 1) {
        this.allSelectedClass2 = !isAllSelected;
      }
    }
    console.log(this.labelUuids);
  }

  async allLabelSelected(match: any, index: any) {
    this.labelUuids = [];
    if (index === 0) {
      this.allSelectedClass1 = !this.allSelectedClass1;
      await this.labelsData.forEach((lab) => {
        if (lab.match === match) {
          lab.selected = this.allSelectedClass1;
        }
      });
    }
    if (index === 1) {
      this.allSelectedClass2 = !this.allSelectedClass2;
      await this.labelsData.forEach((lab) => {
        if (lab.match === match) {
          lab.selected = this.allSelectedClass2;
        }
      });
    }
    this.labelsData.forEach((lab) => {
      if (lab.selected) {
        this.labelUuids.push(lab.uuid);
      }
    });
    await this.createLabelsForm();
  }

  criteriaSubmit(request: boolean) {
    this.criteriaArray = [];
    for (const [key, value] of Object.entries(
      this.criteriaForm.value.criteria
    )) {
      if (value === true) {
        this.criteriaArray.push(key);
      }
      this.critariaButtonActive = this.criteriaArray.length > 0 ? true : false;
    }
    if (request) {
      this.procurementsService
        .getCriteriaLabels(
          this.criteriaArray.toString().replace(/\,/gi, '&id=')
        )
        .then((res) => {
          this.labelsData = res;
          this.createLabelsForm();
          const labelsSplitData = this.labelsData.reduce((res2, curr) => {
            if (res2[curr.match]) {
              res2[curr.match].push(curr);
            } else {
              Object.assign(res2, { [curr.match]: [curr] });
            }
            return res2;
          }, {});
          const test = [];
          for (const [key, value] of Object.entries(labelsSplitData)) {
            test.push(value);
          }
          this.labelsSplitData = test.reverse();
          console.log(this.labelsSplitData);
        });
    }
  }

  infoVideoModal(topic: any) {
    const dialogRef = this.dialog.open(MyenergyGoalsVideoDialog, {
      width: '80%',
      maxWidth: '680px',
      data: topic,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        if (result.neverShow) {
        }
      } catch (error) {}
    });
  }

  setActiveTab(tab: number) {
    this.activePurchasTab = tab;
    if (tab === 0) {
      const path = `/myenergy/product-recommendation/${this.recommendationId}/detail`;
      setTimeout(() => {
        this.router.navigate([path]);
      }, 500);
    }
    if (tab === 1) {
      const path = `/myenergy/product-recommendation/${this.recommendationId}/supplier`;
      setTimeout(() => {
        this.router.navigate([path]);
      }, 500);
    }
  }

  labelsSubmit() {
    const data = {
      description: this.familyData.description,
      brick_uuid: this.familyData.brick_uuid,
      criteria: this.criteriaArray,
      labels: this.labelUuids,
      suppliers: [],
    };
    if (this.recommendationId) {
      data['uuid'] = this.recommendationId;
    }
    this.procurementsService
      .createRecommendation(data, this.recommendationId ? 'put' : 'post')
      .then((res) => {
        this.recommendationId = res.uuid;
        this.procurementsService
          .getSuppliers(this.familyData.brick_uuid)
          .then((sup) => {
            this.supplierList = sup;
            this.activePurchasTab = 1;
            this.createSupplierForm();
            const path = `/myenergy/product-recommendation/${this.recommendationId}/supplier`;
            setTimeout(() => {
              this.router.navigate([path]);
            }, 500);
          });
      });
  }
  invaiteSupplierModal() {
    const dialogRef = this.dialog.open(MyenergyInvaiteSupplier, {
      width: '80%',
      maxWidth: '680px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.supplierList.unshift(result);
        this.selectedSuppliers.push(result);
      } catch (error) {}
    });
  }

  productSupplierSave() {
    for (const [key, value] of Object.entries(
      this.supplierForm.value.supplier
    )) {
      if (value === true) {
        this.selectedSuppliers.push({
          uuid: key,
          email: '',
          supplier_name: '',
          first_name: '',
          last_name: '',
        });
      }
    }

    const data = {
      uuid: this.recommendationId,
      description: this.familyData.description,
      brick_uuid: this.familyData.brick_uuid,
      criteria: this.criteriaArray,
      labels: this.labelUuids,
      suppliers: this.selectedSuppliers,
    };
    this.procurementsService.createRecommendation(data, 'put').then((res) => {
      this.selectedSuppliers = [];
      this.getRecommendation(res.uuid);
    });
  }

  recommendationConfirm() {
    const data = {
      uuid: this.recommendationId,
      description: this.familyData.description,
      brick_uuid: this.familyData.brick_uuid,
      criteria: this.criteriaArray,
      labels: this.labelUuids,
      suppliers: this.selectedSuppliers,
    };
    this.procurementsService
      .recommendationConfirm(this.recommendationId, data)
      .then((res) => {});
  }

  private createCriteriaForm() {
    this.controls = {};
    this.allCriteria.forEach((cr) => {
      cr.criteria.forEach((item) => {
        this.controls[item.uuid] = new FormControl(false);
      });
    });
    this.criteriaForm = this.formBuilder.group({
      criteria: this.formBuilder.group(this.controls),
    });
  }

  private createSupplierForm() {
    this.controls = {};
    this.supplierList.forEach((sup) => {
      this.controls[sup.uuid] = new FormControl(false);
    });
    this.supplierForm = this.formBuilder.group({
      supplier: this.formBuilder.group(this.controls),
    });
  }

  private createLabelsForm() {
    this.controls = {};
    this.labelsData.forEach((label) => {
      if (label.selected) {
        this.controls[label.uuid] = true;
      } else {
        this.controls[label.uuid] = false;
      }
    });
    this.labelsForm = this.formBuilder.group({
      labels: this.formBuilder.group(this.controls),
    });
    this.showLabelsForm = true;
  }
}
