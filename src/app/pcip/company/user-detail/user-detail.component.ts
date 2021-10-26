import { Component, OnInit, Input, Output } from '@angular/core';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitter } from 'events';
import { CommonService } from '@app/core/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  @Input() activeUser: any;
  organisationId = JSON.parse(sessionStorage.getItem('credentials'))[
    'organisation'
  ]['id'];
  roles = {
    administrator: false,
    productManager: false,
    sustainabilityDataManager: false,
    authorizer: false,
  };
  selectedUser = {
    id: '',
    email: '',
  };
  public data;
  public userEmail;
  constructor(
    private http: ApiRequestService,
    public router: Router,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    public route: ActivatedRoute,
    public commonService: CommonService
  ) {}

  ngOnInit() {
    this.userEmail = this.activeUser.email;
    if (this.activeUser.email) {
      this.userOfCompany(this.userEmail, '', 'get');
    }
    this.commonService.selectedCircularUser.subscribe((res) => {
      if (res['id']) {
        this.userEmail = res['email'];
        this.userOfCompany(this.userEmail, '', 'get');
      }
    });
  }

  userOfCompany(email: any, data: any, request: string) {
    this.http
      .callService(
        new Method(environment.services.userDetail(email), data, request)
      )
      .subscribe((res) => {
        this.data = res;
        this.data['roles'].forEach((role) => {
          if (role.name === 'Company admin') {
            this.roles.administrator = true;
          }
          if (role.name === 'Product manager') {
            this.roles.productManager = true;
          }
          if (role.name === 'Data entry user') {
            this.roles.sustainabilityDataManager = true;
          }
          if (role.name === 'Authorizer') {
            this.roles.authorizer = true;
          }
          if (role.name !== 'Company admin') {
            this.roles.administrator = false;
          }
          if (role.name !== 'Product manager') {
            this.roles.productManager = false;
          }
          if (role.name !== 'Data entry user') {
            this.roles.sustainabilityDataManager = false;
          }
          if (role.name !== 'Authorizer') {
            this.roles.authorizer = false;
          }
        });
      });
  }
  closeUser() {
    this.selectedUser = {
      id: '',
      email: '',
    };
    this.commonService.selectedCircularUser.next(this.selectedUser);
  }
  saveChangeUser(roles: any) {
    const roleNames = [];
    if (roles['administrator']) {
      roleNames.push('Company admin');
    }
    if (roles['productManager']) {
      roleNames.push('Product manager');
    }
    if (roles['sustainabilityDataManager']) {
      roleNames.push('Data entry user');
    }
    if (roles['authorizer']) {
      roleNames.push('Authorizer');
    }
    const data = { roleNames: roleNames };
    this.http
      .callService(
        new Method(environment.services.userRole(this.userEmail), data, 'put')
      )
      .subscribe(async (res) => {
        if (res) {
          this.snackBar.open(
            await this.translateService
              .get('transactionSuccessful')
              .pipe(first())
              .toPromise(),
            '',
            {
              duration: 5000,
              panelClass: ['success-snackBar'],
            }
          );
        }
      });
  }
}
