import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProcurementsService } from '@app/myEnergy/procurements/procurements.service';
import { MyenergyGoalsVideoDialog } from '@app/shared/dialog/myenergy-goals-video/myenergy-goals-video.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent {
  familyData;
  activePurchasTab = 0;
  allprocurementData;
  labelUuids;
  criteriaArray = [];
  supplierList;
  selectedSuppliers = [];
  recommendationId;
  constructor(
    private router: Router,
    public procurementsService: ProcurementsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    // this.infoVideoModal('recommendation');
    this.router.navigate([`/myenergy/product-recommendation/new/detail`]);

    this.router.events.subscribe(async (val) => {
      if (val instanceof NavigationEnd) {
        const routeParams = this.activatedRoute.snapshot.paramMap;
        if (routeParams.get('activeTab') === 'confirm') {
          this.getRecommendation(routeParams.get('recommendationId'));
        }
      }
    });
  }

  close() {
    alert('what will happen when this button is click?');
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

  selectedBrick(familyData: any) {
    this.familyData = familyData;
  }

  setCriterias(selectedCriterias: any) {
    this.criteriaArray = selectedCriterias;
  }

  setLabels(labels: any) {
    this.labelUuids = labels;
    if (this.familyData.description) {
      this.createRecomandation();
    } else {
      this.snackBar.open('Product description cannot be left blank!', '', {
        duration: 5000,
        panelClass: ['error-snackBar'],
      });
    }
  }

  setSupplieries(suppliers: any) {
    this.selectedSuppliers = suppliers;

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

  createRecomandation() {
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
            const path = `/myenergy/product-recommendation/${this.recommendationId}/supplier`;
            setTimeout(() => {
              this.router.navigate([path]);
            }, 500);
          });
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
}
