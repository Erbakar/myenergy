import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialog } from '@app/shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { CommonService } from '@app/core/common.service';
import { Router } from '@angular/router';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../../assets/javascript/patica';
declare var $: any;

@Component({
  selector: 'app-outflow',
  templateUrl: './outflow.component.html',
  styleUrls: ['./outflow.component.scss'],
})
export class OutflowComponent implements OnDestroy {
  selectedUnitId;
  fileUrl;
  unitId;
  environment = environment;
  reportData;
  outflowCircularPercentage;
  selectedArray = [];
  selectedOperation;
  diffrent = null;
  isPatica = false;
  itemList;
  unit;
  active;
  rightItems;
  sortNameDirection = null;
  sortWeightDirection = null;
  sortPotentialDirection = null;
  sortActualDirection = null;
  sortOutflowDirection = null;
  weightChangeValue;
  actualRecoveryChangeValue;
  potentialRecoveryChangeValue;

  constructor(
    private dialog: MatDialog,
    public router: Router,
    private http: ApiRequestService,
    private commonService: CommonService
  ) {
    this.commonService.openPatica.next(false);
    hidePatica();
    this.unitId = localStorage.getItem('unitId');
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.onReady();

    this.commonService.selectedUnit.subscribe((unit) => {
      this.unit = unit;
      this.selectedUnitId = unit['id'];
    });
    this.commonService.openPatica.subscribe((res) => {
      this.openPatica(res);
    });
  }
  openPatica(res: boolean) {
    if (res) {
      this.isPatica = true;

      goToModulePatica(8, '2938190fa6aef02ce2f07a90a8a41d73');
      openPatica();
    } else {
      this.isPatica = false;
      hidePatica();
    }
  }
  selectedArrayCount(value: number) {
    if (value > 0) {
      this.openPatica(false);
    } else {
      this.openPatica(true);
      this.isPatica = false;
    }
  }
  onReady() {
    this.http
      .callService(
        new Method(
          environment.services.improvementList(this.unit['id'], 'OUTFLOW'),
          '',
          'get'
        )
      )
      .subscribe((res2) => {
        this.itemList = res2;
        this.http
          .callService(
            new Method(
              environment.services.improvement(this.unit['id'], 'OUTFLOW'),
              '',
              'get'
            )
          )
          .subscribe((res) => {
            this.rightItems = res;
            res['materials'].forEach((element) => {
              element.selected = true;
              this.itemList.forEach((left) => {
                if (left.flowId === element.id) {
                  left.selected = true;
                }
              });
            });
            this.selectedArray = res['materials'];
            this.selectedArrayCount(this.selectedArray.length);
            this.http
              .callService(
                new Method(
                  environment.services.graph(this.unit['id']),
                  '',
                  'get'
                )
              )
              .subscribe((res3) => {
                this.outflowCircularPercentage =
                  res3['outflowCircularPercentage'];
              });
          });
      });
  }
  addItem(item: any) {
    const index = this.selectedArray.findIndex((x) => x.id === item.flowId);
    if (index === -1) {
      item.id = item.flowId;
      this.selectedArray.push(item);
      this.selectedArray.sort((a, b) => {
        return b.weight - a.weight;
      });
      this.itemList.forEach((element) => {
        if (element.flowId === item.flowId) {
          element.selected = true;
        }
      });
      this.selectedArrayCount(this.selectedArray.length);
      this.submit(false);
    }
  }
  removeItem(item: any) {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '80%',
      maxWidth: '600px',
      data: {
        title: `${item['name']}`,
        message: ' Are you sure you want to delete this? Please confirm.',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        const index = this.selectedArray.findIndex((x) => x.id === item.id);
        this.selectedArray.splice(index, 1);
        this.selectedArray.sort((a, b) => {
          return b.weight - a.weight;
        });
        this.itemList.forEach((element) => {
          if (element.flowId === item.id) {
            element.selected = false;
          }
          if (element.id === item.id) {
            element.selected = false;
          }
        });
        this.submit(false);
        this.selectedArrayCount(this.selectedArray.length);
      } catch (error) {}
    });
  }
  openCalculete(item: any, type: string) {
    this.selectedOperation = false;
    this.diffrent = null;
    this.selectedArray.forEach((element) => {
      if (element.id === item.id) {
        if (type === 'weight') {
          element.weightChange = !element.weightChange;
          element.potentialRecoveryChange = false;
          element.actualRecoveryChange = false;
        } else if (type === 'potentialRecovery') {
          element.potentialRecoveryChange = !element.potentialRecoveryChange;
          element.weightChange = false;
          element.actualRecoveryChange = false;
        } else if (type === 'actualRecovery') {
          element.actualRecoveryChange = !element.actualRecoveryChange;
          element.weightChange = false;
          element.potentialRecoveryChange = false;
        }
      } else {
        element.weightChange = false;
        element.potentialRecoveryChange = false;
        element.actualRecoveryChange = false;
      }
    });
  }
  calculateDone(item: number) {
    const materials = [];
    this.selectedArray.forEach((element) => {
      const piese = {
        id: element.id,
        targetWeight: element.weightChangeValue
          ? element.weightChangeValue
          : element.targetWeight,
        targetPotentialRecovery: element.potentialRecoveryChangeValue
          ? element.potentialRecoveryChangeValue
          : element.targetPotentialRecovery,
        targetActualRecovery: element.actualRecoveryChangeValue
          ? element.actualRecoveryChangeValue
          : element.targetActualRecovery,
      };
      materials.push(piese);
    });
    this.http
      .callService(
        new Method(
          environment.services.calculateImprovement(this.unit['id'], 'OUTFLOW'),
          { materials },
          'put'
        )
      )
      .subscribe((res) => {
        this.rightItems = res;
        this.selectedArray = this.rightItems['materials'];
      });
  }
  flowComplate(flow: string) {
    const data = [{ question: flow, value: true, entityId: this.unitId }];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        this.commonService.refreshUnitGuindance(this.unitId);
      });
  }
  submit(nextpage: boolean) {
    const materials = [];
    this.selectedArray.forEach((element) => {
      const piese = {
        id: element.id,
        targetWeight: element.weightChangeValue
          ? element.weightChangeValue
          : element.targetWeight,
        targetPotentialRecovery: element.potentialRecoveryChangeValue
          ? element.potentialRecoveryChangeValue
          : element.targetPotentialRecovery,
        targetActualRecovery: element.actualRecoveryChangeValue
          ? element.actualRecoveryChangeValue
          : element.targetActualRecovery,
      };
      materials.push(piese);
    });
    const data = {
      materials,
      totalChange: 0,
    };
    this.http
      .callService(
        new Method(
          environment.services.improvement(this.unit['id'], 'OUTFLOW'),
          data,
          'put'
        )
      )
      .subscribe((res) => {
        if (nextpage) {
          this.flowComplate('CTI_STEP5_OUTFLOW');
          this.commonService.step5ActiveCase.next('energyAnalaysis');
        } else {
          this.onReady();
        }
      });
  }

  setValue(value: number, dif: number, target: string) {
    this.calculate(value, dif, target);
  }
  setOperation(set: string, value: number, dif: number, target: string) {
    this.selectedOperation = set;
    this.calculate(value, dif, target);
  }

  calculate(item: number, dif: number, target: string) {
    if (target === 'weight') {
      if (this.selectedOperation === '-') {
        item['weightChangeValue'] = item['targetWeight'] - dif;
      } else if (this.selectedOperation === '+') {
        item['weightChangeValue'] = item['targetWeight'] + dif;
      } else if (this.selectedOperation === '-%') {
        item['weightChangeValue'] =
          item['targetWeight'] - item['targetWeight'] * (dif / 100);
      } else if (this.selectedOperation === '+%') {
        item['weightChangeValue'] =
          item['targetWeight'] + item['targetWeight'] * (dif / 100);
      }
    }
    if (target === 'potentialRecovery') {
      if (this.selectedOperation === '-') {
        item['potentialRecoveryChangeValue'] =
          item['targetPotentialRecovery'] - dif;
      } else if (this.selectedOperation === '+') {
        item['potentialRecoveryChangeValue'] =
          item['targetPotentialRecovery'] + dif;
      } else if (this.selectedOperation === '-%') {
        item['potentialRecoveryChangeValue'] =
          item['targetPotentialRecovery'] -
          item['targetPotentialRecovery'] * (dif / 100);
      } else if (this.selectedOperation === '+%') {
        item['potentialRecoveryChangeValue'] =
          item['targetPotentialRecovery'] +
          item['targetPotentialRecovery'] * (dif / 100);
      }
    }
    if (target === 'actualRecovery') {
      if (this.selectedOperation === '-') {
        item['actualRecoveryChangeValue'] = item['targetActualRecovery'] - dif;
      } else if (this.selectedOperation === '+') {
        item['actualRecoveryChangeValue'] = item['targetActualRecovery'] + dif;
      } else if (this.selectedOperation === '-%') {
        item['actualRecoveryChangeValue'] =
          item['targetActualRecovery'] -
          item['targetActualRecovery'] * (dif / 100);
      } else if (this.selectedOperation === '+%') {
        item['actualRecoveryChangeValue'] =
          item['targetActualRecovery'] +
          item['targetActualRecovery'] * (dif / 100);
      }
    }
  }
  sortName() {
    if (this.sortNameDirection) {
      this.sortNameDirection = false;
      // tslint:disable-next-line:typedef
      this.itemList.sort(function (b, a) {
        if (a.tradeName < b.tradeName) {
          return -1;
        }
        if (a.tradeName > b.tradeName) {
          return 1;
        }
        return 0;
      });
    } else {
      this.sortNameDirection = true;
      // tslint:disable-next-line:typedef
      this.itemList.sort(function (a, b) {
        if (a.tradeName < b.tradeName) {
          return -1;
        }
        if (a.tradeName > b.tradeName) {
          return 1;
        }
        return 0;
      });
    }
    this.sortWeightDirection = null;
    this.sortPotentialDirection = null;
    this.sortActualDirection = null;
    this.sortOutflowDirection = null;
  }

  sortMass() {
    if (this.sortWeightDirection) {
      this.sortWeightDirection = false;
      this.itemList.sort((a, b) => {
        return a.weight - b.weight;
      });
    } else {
      this.sortWeightDirection = true;
      this.itemList.sort((a, b) => {
        return b.weight - a.weight;
      });
    }
    this.sortNameDirection = null;
    this.sortPotentialDirection = null;
    this.sortActualDirection = null;
    this.sortOutflowDirection = null;
  }

  sortPotential() {
    if (this.sortPotentialDirection) {
      this.sortPotentialDirection = false;
      this.itemList.sort((a, b) => {
        return a.potentialRecovery - b.potentialRecovery;
      });
    } else {
      this.sortPotentialDirection = true;
      this.itemList.sort((a, b) => {
        return b.potentialRecovery - a.potentialRecovery;
      });
    }
    this.sortNameDirection = null;
    this.sortWeightDirection = null;
    this.sortActualDirection = null;
    this.sortOutflowDirection = null;
  }
  sortActual() {
    if (this.sortActualDirection) {
      this.sortActualDirection = false;
      this.itemList.sort((a, b) => {
        return a.actualRecovery - b.actualRecovery;
      });
    } else {
      this.sortActualDirection = true;
      this.itemList.sort((a, b) => {
        return b.actualRecovery - a.actualRecovery;
      });
    }
    this.sortNameDirection = null;
    this.sortWeightDirection = null;
    this.sortPotentialDirection = null;
    this.sortOutflowDirection = null;
  }
  sortOutflow() {
    if (this.sortOutflowDirection) {
      this.sortOutflowDirection = false;
      this.itemList.sort((a, b) => {
        return a.wip - b.wip;
      });
    } else {
      this.sortOutflowDirection = true;
      this.itemList.sort((a, b) => {
        return b.wip - a.wip;
      });
    }
    this.sortNameDirection = null;
    this.sortWeightDirection = null;
    this.sortPotentialDirection = null;
    this.sortActualDirection = null;
  }
  ngOnDestroy() {
    this.commonService.openPatica.next(false);
    hidePatica();
  }
}
