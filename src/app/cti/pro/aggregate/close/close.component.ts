import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-aggregate-close',
  templateUrl: './close.component.html',
  styleUrls: ['./close.component.scss'],
})
export class AggregateCloseComponent implements OnInit {
  @Input() public data: string;
  energyAssessments = [];
  waterAssessments = [];
  environment = environment;
  constructor() {}
  ngOnInit() {
    this.data['assessments'].forEach((element) => {
      const energy = {
        indicatorSelected: element.energy.indicatorSelected,
        value: element.energy.renewablePercentage,
        unit: '%',
        name: element.name,
        businessLevel: element.businessLevel,
        businessLevelName: element.businessLevelName,
        top: true,
      };
      this.energyAssessments.push(energy);
      const water = {
        indicatorSelected: element.water.indicatorSelected,
        value: element.water.waterCircularity,
        unit: '%',
        name: element.name,
        businessLevel: element.businessLevel,
        businessLevelName: element.businessLevelName,
        top: true,
      };
      this.waterAssessments.push(water);
    });
  }
}
