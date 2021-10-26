import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Sort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-compare-optimize',
  templateUrl: './optimize.component.html',
  styleUrls: ['./optimize.component.scss'],
})
export class CompareOptimizeComponent implements OnInit, AfterViewInit {
  @Input() public data: string;
  environment = environment;
  sortedData;
  seletedCirticalMaterialFilter;
  seletedRecoveryFilter;
  seletedOnsiteFilter;
  CRITICALMATERIALS;
  ONSITEWATERCIRCULATION;
  RECOVERYTYPES;
  res;
  constructor(private translateService: TranslateService) {
    this.translate();
  }

  ngOnInit(): void {
    this.res = this.data;
  }
  async translate() {
    this.CRITICALMATERIALS = await this.translateService
      .get('CRITICALMATERIALS')
      .pipe(first())
      .toPromise();
    this.ONSITEWATERCIRCULATION = await this.translateService
      .get('ONSITEWATERCIRCULATION')
      .pipe(first())
      .toPromise();
    this.RECOVERYTYPES = await this.translateService
      .get('RECOVERYTYPES')
      .pipe(first())
      .toPromise();
  }
  sortData(sort: Sort) {
    const data = this.res;
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'namesort':
          return this.compare(a.namesort, b.namesort, isAsc);
        case 'startDate':
          return this.compare(a.startDate, b.startDate, isAsc);
        case 'inflowMass':
          return this.compare(a.inflowMass, b.inflowMass, isAsc);
        case 'outflowMass':
          return this.compare(a.outflowMass, b.outflowMass, isAsc);
        case 'totalCriticalMass':
          return this.compare(a.totalCriticalMass, b.totalCriticalMass, isAsc);
        case 'criticalPercentage':
          return this.compare(
            a.criticalPercentage,
            b.criticalPercentage,
            isAsc
          );
        case 'totalOnsiteWater':
          return this.compare(a.totalOnsiteWater, b.totalOnsiteWater, isAsc);
        case 'onsiteWaterCircularity':
          return this.compare(
            a.onsiteWaterCircularity,
            b.onsiteWaterCircularity,
            isAsc
          );
        case 'technicalPercentage':
          return this.compare(
            a.technicalPercentage,
            b.technicalPercentage,
            isAsc
          );
        case 'nonFoodPercentage':
          return this.compare(a.nonFoodPercentage, b.nonFoodPercentage, isAsc);
        case 'foodPercentage':
          return this.compare(a.foodPercentage, b.foodPercentage, isAsc);
        case 'renewableEnergy':
          return this.compare(a.foodPercentage, b.foodPercentage, isAsc);
        case 'unknownPercentage':
          return this.compare(a.unknownPercentage, b.unknownPercentage, isAsc);
        default:
          return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  ngAfterViewInit() {
    this.sortData({ active: 'namesort', direction: 'asc' });
  }
}
