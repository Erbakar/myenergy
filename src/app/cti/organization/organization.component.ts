import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  EmailValidator,
} from '@angular/forms';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../assets/javascript/patica';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { CommonService } from '@app/core/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NewUserDialogComponent } from '../../shared/dialog/new-user/new-user.component';
import { I18nService } from '../../core/i18n.service';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DeleteConfirmDialog } from '@app/shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
declare var $: any;

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
// tslint:disable-next-line: class-name
export class OrganizationComponent implements OnInit, OnDestroy {
  isLoading = false;
  langguage = environment.supportedLanguages;
  selectedLang;
  data;
  userData;
  isAdmin;
  isUserAdmin = false;
  userEmail;
  addColleagueMail;
  addColleagueId;
  feature;
  name;
  quote: string;
  registerForm: FormGroup;
  adminForm: FormGroup;
  organisation;
  selectUser = null;

  industries = [
    'Select industry',
    'Agriculture, forestry and fishing',
    'Mining and quarrying',
    'Manufacturing',
    'Electricity, gas, steam and air conditioning supply',
    'Water supply; sewerage, waste management and remediation activities',
    'Construction',
    'Wholesale and retail trade; repair of motor vehicles and motorcycles',
    'Transportation and storage',
    'Accommodation and food service activities',
    'Information and communication',
    'Financial and insurance activities',
    'Real estate activities',
    'Professional, scientific and technical activities',
    'Administrative and support service activities',
    'Public administration and defence; compulsory social security',
    'Education',
    'Human health and social work activities',
    'Arts, entertainment and recreation',
    'Other service activities',
    'Activities of households as employers; undifferentiated goods- and services-producing activities of households for own use',
    'Activities of extraterritorial organizations and bodies',
    'Other',
  ];

  positions = [
    'Materials extraction and agriculture',
    'Upstream materials producer (chemicals, mining, metal…)',
    'Manufacturer of consumable goods (food, medicine…)',
    'Manufacturer of consumer goods and infrastructure (clothes, electronics, buildings..)',
    'Waste and waste water treatment',
    'Reverse cycle for products (refurbish and tighter)',
    'Retail of consumer goods and infrastructure',
    'Services using products (e.g., transportation)',
    'Purely services (e.g., consulting)',
    'Other',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private http: ApiRequestService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private i18nService: I18nService
  ) {
    $('#main-content').addClass('darkBG');
    $('header').hide();
    $('#main-content').css('padding-top', '2rem');
    this.userEmail = localStorage.getItem('user-email');
    this.commonService.openPatica.subscribe((res) => {
      if (res) {
        $('.patica-sidebar').css('top', 70);
        goToModulePatica(0, 0);
        openPatica();
      } else {
        hidePatica();
      }
    });
    const credentials = JSON.parse(sessionStorage.getItem('credentials'));
    credentials['roles'].forEach((element) => {
      if (element.name === 'Company admin') {
        this.isAdmin = true;
      }
    });
    this.http
      .callService(new Method(environment.services.organisation(), '', 'get'))
      .subscribe((name) => {
        this.name = name;
        this.adminRequest();
        this.http
          .callService(
            new Method(environment.services.organisationDetails(), '', 'get')
          )
          .subscribe((res) => {
            this.data = res;
            this.createForm();
            this.getUser();
          });
      });
    this.selectedLang = localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'English';
  }
  getUser() {
    this.http
      .callService(
        new Method(environment.services.user() + '?size=999', '', 'get')
      )
      .subscribe((res) => {
        this.userData = res['results'];
        this.userData.forEach((element) => {
          if (element.firstname) {
            element.ff = element.firstname.slice(0, 1);
          }
          if (element.lastname) {
            element.lf = element.lastname.slice(0, 1);
          }
          if (this.userEmail === element.email) {
            element.roles.forEach((role) => {
              if (role.name === 'Company admin') {
                this.isUserAdmin = true;
              }
            });
          }
          element.roles.forEach((role) => {
            if (role.name === 'Company admin') {
              element.admin = true;
            }
          });
        });
      });
  }

  userRole(email: string, roles: any) {
    this.http
      .callService(
        new Method(
          environment.services.userRole(email),
          { roleNames: roles },
          'put'
        )
      )
      .subscribe(async (res) => {
        this.getUser();
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
      });
  }

  settings(i: any) {
    if (this.selectUser !== i) {
      this.selectUser = i;
    } else {
      this.selectUser = null;
    }
  }
  makeAdmin(item: any) {
    this.selectUser = null;
    const roles = [];
    item.roles.forEach((role) => {
      roles.push(role.name);
    });
    roles.push('Company admin');
    this.userRole(item.email, roles);
  }
  dropAdmin(item: any) {
    this.selectUser = null;
    const roles = [];
    item.roles.forEach((role) => {
      if (role.name !== 'Company admin') {
        roles.push(role.name);
      }
    });
    this.userRole(item.email, roles);
  }
  removeItem(item: any) {
    this.selectUser = null;
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '80%',
      maxWidth: '430px',
      data: {
        title: `${item['fullname'] ? item['fullname'] : item['email']}`,
        message: ' Are you sure you want to delete this? Please confirm.',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.http
          .callService(
            new Method(
              environment.services.emailCheck(item.email),
              '',
              'delete'
            )
          )
          .subscribe(async (res) => {
            this.getUser();
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
          });
      } catch (error) {}
    });
  }
  adminRequest() {
    this.http
      .callService(
        new Method(
          environment.services.featuresOrganisation(this.name.id),
          '',
          'get'
        )
      )
      .subscribe((feature) => {
        this.feature = feature;
        this.feature.forEach((element) => {
          element.status = element.status === 'ENABLED' ? true : false;
        });
      });
  }

  addUser(material: any): void {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      width: '80%',
      maxWidth: '600px',
      data: material,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.getUser();
        this.addColleagueMail = result['email'];
        this.addColleagueId = result['userId'];
        material['responsibleUserEmail'] = result['email'];
      } catch (error) {}
    });
  }
  setLanguage(language: string) {
    this.i18nService.language = language;
  }
  register() {
    this.data = this.registerForm.value;
    this.http
      .callService(
        new Method(environment.services.organisationDetails(), this.data, 'put')
      )
      .subscribe((res) => {
        this.snackBar.open(`Organization update successfully`, '', {
          duration: 5000,
          panelClass: ['success-snackBar'],
        });
      });
  }

  featureChage(item: any) {
    item.status = item.status === true ? 'ENABLED' : 'DISABLED';
    const data = {
      organisationUuid: this.name.id,
      feature: item.name,
      status: item.status,
    };
    this.http
      .callService(
        new Method(environment.services.adminOrganisation(), data, 'put')
      )
      .subscribe(async (res) => {
        if (!res) {
          this.adminRequest();
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

  ngOnInit() {}
  ngOnDestroy() {
    $('#main-content').removeClass('darkBG');
    $('header').show();
    $('#main-content').css('padding-top', '6rem');
    this.commonService.openPatica.next(false);
    hidePatica();
  }

  private createForm() {
    this.registerForm = this.formBuilder.group({
      organizationName: [this.name['name'], Validators.required],
      industry: [this.data['industry'], Validators.required],
      industryOther: [this.data['industryOther']],
      position: [this.data['position'], Validators.required],
      positionOther: [this.data['positionOther']],
      address: [this.data['address'], Validators.required],
      revenue: [this.data['revenue'], Validators.required],
      currenctType: [this.data['currenctType'], Validators.required],
    });
  }
}
