import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { CommonService } from '@app/core/common.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  data;
  filter;
  constructor(
    public http: ApiRequestService,
    public commonService: CommonService
  ) {}
  getOrganisation() {
    this.http
      .callService(new Method(environment.services.organisation(), '', 'get'))
      .subscribe((res) => {
        this.data = res;
      });
  }
  getFilter() {
    this.http
      .callService(new Method(environment.services.filter(), '', 'get'))
      .subscribe((res) => {
        this.filter = res;
      });
  }

  ngOnInit() {
    this.getOrganisation();
    this.getFilter();
  }
}
