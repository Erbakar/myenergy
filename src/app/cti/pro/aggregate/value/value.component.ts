import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';
@Component({
  selector: 'app-aggregate-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss'],
})
export class AggregateValueComponent implements OnInit {
  @Input() public data: string;
  environment = environment;
  productivityAssessments = [];
  ctiRevenueAssessments = [];
  constructor() {}

  ngOnInit(): void {
    this.data['assessments'].forEach((element) => {
      const productivity = {
        indicatorSelected: element.productivity.indicatorSelected,
        value: element.productivity.productivity,
        unit: `${element.productivity.currency}`,
        name: element.name,
        businessLevelName: element.businessLevelName,
        businessLevel: element.businessLevel,
        type: 'productivity',
      };
      this.productivityAssessments.push(productivity);
      const ctiRevenue = {
        indicatorSelected: element.ctiRevenue.indicatorSelected,
        value: element.ctiRevenue.ctirevenue,
        unit: element.ctiRevenue.currency,
        name: element.name,
        businessLevelName: element.businessLevelName,
        businessLevel: element.businessLevel,
      };
      this.ctiRevenueAssessments.push(ctiRevenue);
    });
  }
}
