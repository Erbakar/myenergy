import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { environment } from '@env/environment';
import { Sort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-compare-close',
  templateUrl: './close.component.html',
  styleUrls: ['./close.component.scss'],
})
export class CompareCloseComponent implements OnInit, AfterViewInit {
  @Input() public data: string;
  environment = environment;
  sortedData;
  seletedInflowFilter;
  seletedOutflowFilter;
  seletedEnergyFilter;
  seletedWaterFilter;
  INFLOW;
  OUTFLOW;
  ENERGY;
  WATER;
  res;
  constructor(private translateService: TranslateService) {
    this.sortedData = this.data;
    this.translate();
  }
  ngOnInit(): void {
    this.res = this.data;
  }
  async translate() {
    this.INFLOW = await this.translateService
      .get('INFLOW')
      .pipe(first())
      .toPromise();
    this.OUTFLOW = await this.translateService
      .get('OUTFLOW')
      .pipe(first())
      .toPromise();
    this.ENERGY = await this.translateService
      .get('ENERGY')
      .pipe(first())
      .toPromise();
    this.WATER = await this.translateService
      .get('WATER')
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
        case 'inflowCircularity':
          return this.compare(a.inflowCircularity, b.inflowCircularity, isAsc);
        case 'inflowLinearity':
          return this.compare(a.inflowLinearity, b.inflowLinearity, isAsc);
        case 'outflowCircularity':
          return this.compare(
            a.outflowCircularity,
            b.outflowCircularity,
            isAsc
          );
        case 'outflowLinearity':
          return this.compare(a.outflowLinearity, b.outflowLinearity, isAsc);
        case 'totalEnergy':
          return this.compare(a.totalEnergy, b.totalEnergy, isAsc);
        case 'renewableEnergy':
          return this.compare(a.renewableEnergy, b.renewableEnergy, isAsc);
        case 'nonRenewableEnergy':
          return this.compare(
            a.nonRenewableEnergy,
            b.nonRenewableEnergy,
            isAsc
          );
        case 'totalWater':
          return this.compare(a.totalWater, b.totalWater, isAsc);
        case 'waterCircularity':
          return this.compare(a.waterCircularity, b.waterCircularity, isAsc);
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
