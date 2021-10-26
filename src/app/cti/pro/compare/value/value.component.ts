import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Sort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-compare-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss'],
})
export class CompareValueComponent implements OnInit, AfterViewInit {
  @Input() public data: string;
  environment = environment;
  seletedProductivityFilter;
  seletedRevenueFilter;
  sortedData;
  res;
  CIRCULARMATERIALPRODUCTIVITY;
  CTIREVENUE;

  constructor(private translateService: TranslateService) {
    this.translate();
  }
  async translate() {
    this.CIRCULARMATERIALPRODUCTIVITY = await this.translateService
      .get('CIRCULARMATERIALPRODUCTIVITY')
      .pipe(first())
      .toPromise();
    this.CTIREVENUE = await this.translateService
      .get('CTIREVENUE')
      .pipe(first())
      .toPromise();
  }

  ngOnInit(): void {
    this.res = this.data;
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
        case 'revenue':
          return this.compare(a.revenue, b.revenue, isAsc);
        case 'totalRecoveryMass':
          return this.compare(a.totalRecoveryMass, b.totalRecoveryMass, isAsc);
        case 'productivity':
          return this.compare(a.productivity, b.productivity, isAsc);
        case 'circularity':
          return this.compare(a.circularity, b.circularity, isAsc);
        case 'revenue':
          return this.compare(a.revenue, b.revenue, isAsc);
        case 'ctiRevenue':
          return this.compare(a.ctiRevenue, b.ctiRevenue, isAsc);
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
