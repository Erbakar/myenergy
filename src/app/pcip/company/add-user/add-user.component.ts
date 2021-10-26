import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  data = {
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    roles: { roleNames: [] },
  };
  roles = {
    administrator: '',
    productManager: '',
    sustainabilityDataManager: '',
    authorizer: '',
  };
  organisationId = JSON.parse(sessionStorage.getItem('credentials'))[
    'organisation'
  ]['id'];
  constructor(public http: ApiRequestService, private router: Router) {}
  ngOnInit() {}

  inviteUser(data: any, roles: any) {
    data.organisationId = this.organisationId;
    data['roles']['roleNames'] = [];
    if (roles['administrator']) {
      data.roles.roleNames.push('Company admin');
    }
    if (roles['productManager']) {
      data.roles.roleNames.push('Product manager');
    }
    if (roles['sustainabilityDataManager']) {
      data.roles.roleNames.push('Data entry user');
    }
    if (roles['authorizer']) {
      data.roles.roleNames.push('Authorizer');
    }
    this.http
      .callService(new Method(environment.services.user(), data, 'post'))
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/company']);
        }
      });
  }
}
