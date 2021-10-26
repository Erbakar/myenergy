import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-aggregate-optimize',
  templateUrl: './optimize.component.html',
  styleUrls: ['./optimize.component.scss'],
})
export class AggregateOptimizeComponent implements OnInit {
  @Input() public data: string;
  environment = environment;
  onSiteWaterAssessments = [];
  criticalDataAssessments = [];
  constructor() {}

  ngOnInit(): void {
    this.data['assessments'].forEach((element) => {
      const onSiteWater = {
        indicatorSelected: element.onSiteWater.indicatorSelected,
        value: element.onSiteWater.onSiteWaterCircularity,
        unit: 'x',
        name: element.name,
        businessLevelName: element.businessLevelName,
        businessLevel: element.businessLevel,
      };
      this.onSiteWaterAssessments.push(onSiteWater);
      const criticalData = {
        indicatorSelected: element.criticalData.indicatorSelected,
        value: element.criticalData.criticalPercentage,
        unit: '%',
        name: element.name,
        businessLevelName: element.businessLevelName,
        businessLevel: element.businessLevel,
      };
      this.criticalDataAssessments.push(criticalData);
    });
  }
}
