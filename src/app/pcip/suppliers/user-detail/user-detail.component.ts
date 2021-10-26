import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  public data;
  public userEmail;
  constructor(
    private http: ApiRequestService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userEmail = params.get('email');
      this.userOfSupplier(this.userEmail, '', 'get');
    });
  }
  userOfSupplier(id: any, data: any, request: string) {
    this.http
      .callService(
        new Method(environment.services.userDetail(id), data, request)
      )
      .subscribe((res) => {
        this.data = res;
      });
  }
  saveChangeUser(data: any) {
    this.userOfSupplier(this.userEmail, data, 'put');
  }
}
