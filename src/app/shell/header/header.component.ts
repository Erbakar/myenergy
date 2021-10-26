import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { AuthenticationService, I18nService } from '@app/core';
import { CommonService } from '@app/core/common.service';
import { environment } from '@env/environment';
import { VERSION } from '@env/version';
import { AddAssessmentDialog } from '@app/shared/dialog/add-assessment/add-assessment.component';
import { initPatica } from '../../../assets/javascript/patica';
import { DeleteConfirmDialog } from '@app/shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  version = VERSION;
  menuHidden = true;
  show = false;
  project;
  isAdmin;
  isPro = false;
  mainValue = '';
  subValue = '';
  selectedBusiness;
  showMainSelectOptions = false;
  showMidSelectOptions = false;
  showSubSelectOptions = false;
  tempAssessment;
  businessLevelList;
  credentials;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private i18nService: I18nService,
    private http: ApiRequestService,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.project = environment.project;
    this.credentials = JSON.parse(sessionStorage.getItem('credentials'));
    this.mainValue = this.credentials['organisation']['name'];
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.project === 'cti') {
          this.getUnit(this.commonService.selectedUnitID, false);
        }
      }
    });
    this.credentials['roles'].forEach((element) => {
      if (element.name === 'Company admin') {
        this.isAdmin = true;
      }
    });
    this.credentials['organisation'].features.forEach((element) => {
      if (element === 'unlimited_unit') {
        this.isPro = true;
      }
    });
    this.commonService.openPatica.subscribe((res) => {
      this.show = res;
    });

    this.commonService.getbusinessLevelList.subscribe((res) => {
      console.log(res);
      this.getbusinessLevelList(
        res.businessLevel,
        res.assessmentUnitId,
        res.goToStep1
      );
    });

    if (!sessionStorage.getItem('programs_loaded')) {
      if (this.project !== 'myenergy') {
        this.http
          .callService(
            new Method(environment.services.paticaToken(), '', 'get')
          )
          .subscribe((auth) => {
            initPatica(auth['authToken']).then(function () {
              setTimeout(() => {
                $('.patica-sidebar').css('background-color', '#e8e8ef');
              }, 1500);
            });
          });
      }
    }
  }

  selectBusiness(level: any) {
    if (level.assessments.length > 0) {
      this.setUnitFunc(level.assessments[0]);
      localStorage.setItem('selectedBusiness', JSON.stringify(level));
      this.selectedBusiness = level;
      this.subValue = level.assessments[0]['name'];
    } else {
      const dialogRef = this.dialog.open(DeleteConfirmDialog, {
        width: '80%',
        maxWidth: '430px',
        data: {
          title: `${level['name']}`,
          message: ' This business level has no assessments.',
          yesButtonText: 'Go to CTI Pro dashboard',
        },
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (!result) {
          return;
        }
        try {
          this.router.navigate(['/cti/pro']);
        } catch (error) {}
      });
    }
  }

  getbusinessLevelList(
    businessLevel?: any,
    assessmentUnitId?: any,
    goToStep1?: boolean
  ) {
    this.http
      .callService(
        new Method(environment.services.listBusinessLevels(), '', 'get')
      )
      .subscribe((res) => {
        this.commonService.businessLevelLength.next(res['length']);
        if (res['length'] > 0) {
          if (businessLevel) {
            localStorage.setItem(
              'selectedBusiness',
              JSON.stringify(businessLevel)
            );
          } else {
            localStorage.setItem('selectedBusiness', JSON.stringify(res[0]));
          }
          this.businessLevelList = res;
          if (businessLevel) {
            this.businessLevelList.forEach(async (level) => {
              if (level.id === businessLevel.id) {
                this.selectedBusiness = level;
                await this.selectedBusiness.assessments.forEach(async (ass) => {
                  if (ass.unitId === assessmentUnitId) {
                    this.subValue = ass.name;
                    await this.getInicators(ass.unitId);
                    await this.getUnit(ass.unitId, goToStep1 ? true : false);
                    this.commonService.refreshUnitGuindance(ass.unitId);
                  }
                });
              }
            });
          } else {
            this.selectedBusiness = this.businessLevelList[0];
            this.subValue = this.businessLevelList[0].assessments[0]['name'];
            this.getInicators(this.businessLevelList[0].assessments[0].unitId);
            this.getUnit(
              this.businessLevelList[0].assessments[0].unitId,
              false
            );
            this.commonService.refreshUnitGuindance(
              this.businessLevelList[0].assessments[0].unitId
            );
          }
        }
      });
  }

  getInicators(unitId: string) {
    this.http
      .callService(
        new Method(environment.services.ctiStep2Inicators(unitId), '', 'get')
      )
      .subscribe((res) => {
        sessionStorage.setItem('Inicators', JSON.stringify(res));
      });
  }
  mainCatagory(main: string) {
    if (main !== 'alert') {
      this.mainValue = main;
    } else {
      alert('Add an Organization event will running!');
    }
    this.showMainSelectOptions = false;
  }

  subCatagory(item: string) {
    $('html, body').animate({ scrollTop: '0px' }, 0);
    if (item !== 'new') {
      this.setUnitFunc(item);
    } else {
      const dialogRef = this.dialog.open(AddAssessmentDialog, {
        width: '80%',
        maxWidth: '600px',
        data: this.selectedBusiness,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (!result) {
          return;
        }
        try {
          this.http
            .callService(
              new Method(
                environment.services.addAssessment(this.selectedBusiness.id),
                { name: result },
                'post'
              )
            )
            .subscribe(async (res) => {
              await this.getbusinessLevelList(
                res,
                res['assessments'][res['assessments'].length - 1]['unitId']
              );
              this.getUnit(
                res['assessments'][res['assessments'].length - 1]['unitId'],
                true
              );
            });
        } catch (error) {}
      });
    }
    this.showSubSelectOptions = false;
  }

  setUnitFunc(unit: any) {
    this.getUnit(unit.unitId, true);
  }

  getUnit(id: string, gotoStep1?: boolean) {
    this.http
      .callService(
        new Method(environment.services.unitWithUnitId(id), '', 'get')
      )
      .subscribe((res) => {
        this.subValue = res['name'];
        this.commonService.selectedUnit.next(res);
        this.commonService.selectedUnitID = res['id'];
        localStorage.setItem('unitId', res['id']);
        localStorage.setItem('selectedUnit', JSON.stringify(res));
        if (gotoStep1) {
          this.router.navigate(['/cti/guide/step1']);
        }
        if (this.router.url === '/cti/guide/step1') {
          this.commonService.refreshUnitGuindance(id);
        }
      });
  }

  removeUnit(assessment: any) {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '80%',
      maxWidth: '440px',
      data: {
        title: `${assessment['name']}`,
        message: ' Are you sure you want to delete unit? Please confirm.',
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
              environment.services.getAssessment(assessment.id),
              '',
              'delete'
            )
          )
          .subscribe(async (res) => {
            const index = this.businessLevelList.indexOf(
              this.selectedBusiness.id
            );
            this.businessLevelList.splice(index, 1);
            if (assessment.id === localStorage.getItem('unitId')) {
              this.getbusinessLevelList(this.businessLevelList);
              this.setUnitFunc(this.businessLevelList[0]);
            }
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

  ngOnInit() {
    if (this.project === 'cti') {
      this.selectedBusiness = JSON.parse(
        localStorage.getItem('selectedBusiness')
      );
      const unitId = localStorage.getItem('unitId');
      if (this.selectedBusiness && unitId) {
        this.getbusinessLevelList(this.selectedBusiness, unitId);
      } else {
        this.getbusinessLevelList();
      }
    }
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService
      .logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  openPatica() {
    this.show = !this.show;
    this.commonService.openPatica.next(this.show);
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get username(): string | null {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.name : null;
  }
}
