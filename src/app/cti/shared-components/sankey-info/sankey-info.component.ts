import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-sankey-info',
  templateUrl: './sankey-info.component.html',
  styleUrls: ['./sankey-info.component.scss'],
})
export class SankeyInfoComponent implements OnInit {
  @Input() public importData: string;
  data;
  environment = environment;
  unitId = localStorage.getItem('unitId');
  constructor(
    private http: ApiRequestService,
    private commonService: CommonService
  ) {}
  getGraph(id: string) {
    this.http
      .callService(new Method(environment.services.unitGraph(id), '', 'get'))
      .subscribe((res) => {
        this.data = res;
        this.commonService.criticalPercentage = this.data.criticalPercentage;
      });
  }
  ngOnInit(): void {
    if (this.importData) {
      this.data = this.importData['sankey'];
    } else {
      if (this.unitId) {
        this.getGraph(this.unitId);
      }
    }
  }
}
