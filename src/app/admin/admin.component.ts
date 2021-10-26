import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { AddBusinessLevelDialog } from '@app/shared/dialog/add-business-level/add-business-level.component';
import { AddPaticaItemDialog } from '@app/shared/dialog/add-patica-item/add-patica-item.component';
import { DeleteConfirmDialog } from '@app/shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import { environment } from '@env/environment';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  selectUser = null;
  test = false;
  data = ['', ''];
  selectAssetList = [];
  checkDisabled = false;
  maxSelectedSize = 12;
  maxSelectedSizeAlert =
    localStorage.getItem('language') === 'Türkçe'
      ? `En fazla ${this.maxSelectedSize} Değerlendirme seçebilirsiniz!`
      : `You can select maximum ${this.maxSelectedSize} assessments!`;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private http: ApiRequestService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar
  ) {}

  addAssests(event: any, ass: any) {
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
        this.snackBar.open(this.maxSelectedSizeAlert, '', {
          duration: 5000,
          panelClass: ['success-snackBar'],
        });
      }
    } else {
      this.checkDisabled = false;
    }
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
            // this.getBusinessLevel();
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
            // this.getBusinessLevel();
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

  addAssessment(level: any) {
    const dialogRef = this.dialog.open(AddPaticaItemDialog, {
      width: '80%',
      maxWidth: '1000px',
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
            // this.getBusinessLevel();
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
        // this.getBusinessLevel();
      } catch (error) {}
    });
  }

  ngOnInit(): void {
    // this.getBusinessLevel();
  }
}
