import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { AddAssessmentDialog } from '@app/shared/dialog/add-assessment/add-assessment.component';
import { AddBusinessLevelDialog } from '@app/shared/dialog/add-business-level/add-business-level.component';
import { DeleteConfirmDialog } from '@app/shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import { ManageMemebersDialog } from '@app/shared/dialog/manage-members-dialog/manage-members-dialog.component';
import { environment } from '@env/environment';
import { EditBusinessLevelDialog } from '@app/shared/dialog/edit-business-level/edit-business-level.component';
declare var $: any;

@Component({
  selector: 'app-pro',
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.scss'],
})
export class ProComponent implements OnInit, OnDestroy {
  selectUser = null;
  test = false;
  data;
  compare;
  selectAssetList = [];
  checkDisabled = false;
  maxSelectedSize = 12;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private http: ApiRequestService,
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    $('#main-content').addClass('darkBG');
    $('#header').hide();
  }
  settings(ass: any) {
    this.data.forEach((level) => {
      level.assessments.forEach((item) => {
        if (item.unitId === ass.unitId) {
          item.open === true ? (item.open = false) : (item.open = true);
        } else {
          item.open = false;
        }
      });
    });
  }

  async addAssests(event: any, ass: any) {
    const index = this.selectAssetList.indexOf(ass.unitId);
    if (index === -1) {
      this.selectAssetList.push(ass.unitId);
      ass.added = true;
    } else {
      this.selectAssetList.splice(index, 1);
      ass.added = false;
    }
    if (this.selectAssetList.length >= this.maxSelectedSize) {
      if (event.checked) {
        this.checkDisabled = true;
        this.snackBar.open(
          await this.translateService
            .get('maxSelectedSizeAlert', {
              maxSelectedSize: this.maxSelectedSize,
            })
            .pipe(first())
            .toPromise(),
          '',
          {
            duration: 5000,
            panelClass: ['success-snackBar'],
          }
        );
      }
    } else {
      this.checkDisabled = false;
    }
  }

  close() {
    this.selectAssetList = [];
    this.data.forEach((level) => {
      level.assessments.forEach((ass) => {
        ass.added = false;
      });
    });
  }

  goToCompare() {
    const setData = {
      memberList: this.selectAssetList,
    };
    if (this.selectAssetList.length > 1) {
      this.http
        .callService(
          new Method(environment.services.compareBusiness(), setData, 'put')
        )
        .subscribe((res) => {
          this.compare = res;
          this.compare.forEach((item) => {
            item.namesort = `${item.businessLevelName.toUpperCase()}-${item.assessmentName.toUpperCase()}`;
          });
          localStorage.setItem('compareData', JSON.stringify(res));
          this.router.navigate(['cti/pro/compare']);
        });
    }
  }
  goToAggregate() {
    const setData = {
      memberList: this.selectAssetList,
    };
    if (this.selectAssetList.length > 1) {
      this.http
        .callService(
          new Method(environment.services.aggregateBusiness(), setData, 'put')
        )
        .subscribe((res) => {
          localStorage.setItem('aggregateData', JSON.stringify(res));
          this.router.navigate(['cti/pro/aggregate']);
        });
    }
  }
  gotoAssessment(ass: any, level: any) {
    this.http
      .callService(
        new Method(environment.services.unitWithUnitId(ass.unitId), '', 'get')
      )
      .subscribe((res) => {
        this.commonService.getbusinessLevelList.next({
          businessLevel: level,
          assessmentUnitId: ass['unitId'],
          goToStep1: true,
        });
      });
  }

  async deleteLevel(level: any) {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '80%',
      maxWidth: '550px',
      data: {
        title: `${level['name']}`,
        message: await this.translateService
          .get('deleteMessageBusiness')
          .pipe(first())
          .toPromise(),
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
              environment.services.deleteBusinessLevel(level['id']),
              '',
              'delete'
            )
          )
          .subscribe(async (res) => {
            this.getBusinessLevel();
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

  async removeAssessment(ass: object) {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '80%',
      maxWidth: '440px',
      data: {
        title: `${ass['name']}`,
        message: await this.translateService
          .get('deleteMessageAssessment')
          .pipe(first())
          .toPromise(),
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
              environment.services.getAssessment(ass['id']),
              '',
              'delete'
            )
          )
          .subscribe(async (res) => {
            this.getBusinessLevel();
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

  getBusinessLevel() {
    this.http
      .callService(
        new Method(environment.services.getCTIProDashboard(), '', 'get')
      )
      .subscribe((res) => {
        this.data = res;
      });
  }
  manageMemeber(level: any) {
    console.log(level);
    const dialogRef = this.dialog.open(ManageMemebersDialog, {
      width: '80%',
      maxWidth: '1300px',
      data: level,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.getBusinessLevel();
        return;
      }
      try {
        this.getBusinessLevel();
      } catch (error) {}
    });
  }
  addAssessment(level: any) {
    const dialogRef = this.dialog.open(AddAssessmentDialog, {
      width: '80%',
      maxWidth: '600px',
      data: level,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      try {
        this.http
          .callService(
            new Method(
              environment.services.addAssessment(level.id),
              { name: result },
              'post'
            )
          )
          .subscribe((res) => {
            this.getBusinessLevel();
          });
      } catch (error) {}
    });
  }

  addBusinessLevel(item: string) {
    const dialogRef = this.dialog.open(AddBusinessLevelDialog, {
      width: '80%',
      maxWidth: '600px',
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      try {
        this.http
          .callService(
            new Method(
              environment.services.listBusinessLevels(),
              result,
              'post'
            )
          )
          .subscribe((res) => {
            if (res) {
              this.snackBar.open('Business level add was successful!', '', {
                duration: 5000,
                panelClass: ['success-snackBar'],
              });
              this.getBusinessLevel();
            }
          });
      } catch (error) {}
    });
  }
  editBusinessLevel(item: string) {
    const dialogRef = this.dialog.open(EditBusinessLevelDialog, {
      width: '80%',
      maxWidth: '600px',
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      try {
        this.http
          .callService(
            new Method(
              environment.services.editBusinessLevel(item['id']),
              result,
              'put'
            )
          )
          .subscribe((res) => {
            if (res) {
              this.snackBar.open('Business level edit was successful!', '', {
                duration: 5000,
                panelClass: ['success-snackBar'],
              });
              this.getBusinessLevel();
            }
          });
      } catch (error) {}
    });
  }
  ngOnDestroy() {
    $('#main-content').removeClass('darkBG');
    $('#header').show();
  }

  ngOnInit(): void {
    this.getBusinessLevel();
  }
}
