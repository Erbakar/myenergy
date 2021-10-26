import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialog } from '@app/shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../../assets/javascript/patica';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { CommonService } from '@app/core/common.service';
declare var $: any;

@Component({
  selector: 'app-inflow',
  templateUrl: './inflow.component.html',
  styleUrls: ['./inflow.component.scss'],
})
export class InflowComponent implements OnDestroy {
  selectedArray = [];
  inflowCircularPercentage;
  environment = environment;
  selectedOperation;
  diffrent = null;
  itemList;
  unit;
  active;
  unitId;
  rightItems;
  isPatica = false;
  sortNameDirection = null;
  sortWeightDirection = null;
  sortLinearDirection = null;
  sortMassLinearDirection = null;
  weightChangeValue;
  circularityChangeValue;

  constructor(
    private dialog: MatDialog,
    private http: ApiRequestService,
    private commonService: CommonService
  ) {
    hidePatica();
    this.unitId = localStorage.getItem('unitId');
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.onReady();
    this.unitId = localStorage.getItem('unitId');
    this.commonService.openPatica.subscribe((res) => {
      this.openPatica(res);
    });
  }

  openPatica(res: boolean) {
    if (res) {
      this.isPatica = true;
      $('.patica-sidebar').addClass('sub-page');
      goToModulePatica(8, '6b7adef87e144dea43b209c3ca86f34c');
      openPatica();
    } else {
      this.isPatica = false;
      hidePatica();
    }
  }

  onReady() {
    this.http
      .callService(
        new Method(
          environment.services.improvementList(this.unit['id'], 'INFLOW'),
          '',
          'get'
        )
      )
      .subscribe((res2) => {
        this.itemList = res2;
        this.http
          .callService(
            new Method(
              environment.services.improvement(this.unit['id'], 'INFLOW'),
              '',
              'get'
            )
          )
          .subscribe((res) => {
            this.rightItems = res;
            this.selectedArray = this.rightItems['materials'];
            this.selectedArrayCount(this.selectedArray.length);
            this.selectedArray.forEach((element) => {
              element.selected = true;
              this.itemList.forEach((left) => {
                if (left.flowId === element.id) {
                  left.selected = true;
                }
              });
            });
            this.http
              .callService(
                new Method(
                  environment.services.graph(this.unit['id']),
                  '',
                  'get'
                )
              )
              .subscribe((res3) => {
                this.inflowCircularPercentage =
                  res3['inflowCircularPercentage'];
              });
          });
      });
  }
  selectedArrayCount(value: number) {
    if (value > 0) {
      this.openPatica(false);
    } else {
      this.openPatica(true);
      this.isPatica = false;
    }
  }

  addItem(item: any) {
    const index = this.selectedArray.findIndex((x) => x.id === item.flowId);
    if (index === -1) {
      item.id = item.flowId;
      this.selectedArray.push(item);
      this.itemList.forEach((element) => {
        if (element.flowId === item.flowId) {
          element.selected = true;
        }
      });
    }
    this.selectedArrayCount(this.selectedArray.length);
    this.submit(false);
  }
  removeItem(item: any) {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '80%',
      maxWidth: '430px',
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
          element.circularityChange = false;
        } else if (type === 'circularity') {
          element.circularityChange = !element.circularityChange;
          element.weightChange = false;
        }
      } else {
        element.weightChange = false;
        element.circularityChange = false;
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
        targetInflowCircularity: element.circularityChangeValue
          ? element.circularityChangeValue
          : element.targetInflowCircularity,
      };
      materials.push(piese);
    });
    this.http
      .callService(
        new Method(
          environment.services.calculateImprovement(this.unit['id'], 'INFLOW'),
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
        targetInflowCircularity: element.circularityChangeValue
          ? element.circularityChangeValue
          : element.targetInflowCircularity,
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
          environment.services.improvement(this.unit['id'], 'INFLOW'),
          data,
          'put'
        )
      )
      .subscribe((res) => {
        if (nextpage) {
          this.flowComplate('CTI_STEP5_INFLOW');
          this.commonService.step5ActiveCase.next('outflow-question');
        } else {
          this.onReady();
        }
      });
  }

  setWeight(value: number, dif: number, target: string) {
    this.calculate(value, dif, target);
  }
  setPotential(value: number, dif: number, target: string) {
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
    if (target === 'circularity') {
      if (this.selectedOperation === '-') {
        item['circularityChangeValue'] = item['targetInflowCircularity'] - dif;
      } else if (this.selectedOperation === '+') {
        item['circularityChangeValue'] = item['targetInflowCircularity'] + dif;
      } else if (this.selectedOperation === '-%') {
        item['circularityChangeValue'] =
          item['targetInflowCircularity'] -
          item['targetInflowCircularity'] * (dif / 100);
      } else if (this.selectedOperation === '+%') {
        item['circularityChangeValue'] =
          item['targetInflowCircularity'] +
          item['targetInflowCircularity'] * (dif / 100);
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
    this.sortLinearDirection = null;
    this.sortMassLinearDirection = null;
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
    this.sortLinearDirection = null;
    this.sortMassLinearDirection = null;
  }

  sortLinearInflow() {
    if (this.sortLinearDirection) {
      this.sortLinearDirection = false;
      this.itemList.sort((a, b) => {
        return a.circularPercentage - b.circularPercentage;
      });
    } else {
      this.sortLinearDirection = true;
      this.itemList.sort((a, b) => {
        return b.circularPercentage - a.circularPercentage;
      });
    }
    this.sortNameDirection = null;
    this.sortWeightDirection = null;
    this.sortMassLinearDirection = null;
  }

  sortMassLinear() {
    if (this.sortMassLinearDirection) {
      this.sortMassLinearDirection = false;
      this.itemList.sort((a, b) => {
        return a.wip - b.wip;
      });
    } else {
      this.sortMassLinearDirection = true;
      this.itemList.sort((a, b) => {
        return b.wip - a.wip;
      });
    }
    this.sortNameDirection = null;
    this.sortWeightDirection = null;
    this.sortLinearDirection = null;
  }
  ngOnDestroy() {
    this.commonService.openPatica.next(false);
    hidePatica();
  }
}
