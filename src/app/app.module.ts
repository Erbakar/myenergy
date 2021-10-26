import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { ShellModule } from './shell/shell.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { HotTableModule } from '@handsontable/angular';
import { RegisterModule } from './login/register/register.module';
import { InviteColleagueDialog } from './shared/dialog/invite-colleague/invite-colleague.component';
import { DeleteConfirmDialog } from './shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import { ConfirmDialog } from './shared/dialog/confirm-dialog/confirm-dialog.component';
import { PublishConfirmDialog } from './shared/dialog/publish-confirm-dialog/publish-confirm-dialog.component';
import { NewUserDialogComponent } from './shared/dialog/new-user/new-user.component';
import { NewSupplierDialogComponent } from './shared/dialog/new-supplier/new-supplier.component';
import { Step2DownloadReportDialog } from './shared/dialog/step2-download-report-dialog/step2-download-report-dialog.component';
import { Step5DownloadReportDialog } from './shared/dialog/step5-download-report-dialog/step5-download-report-dialog.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddAssessmentDialog } from './shared/dialog/add-assessment/add-assessment.component';
import { Step6DownloadReportDialog } from './shared/dialog/step6-download-report-dialog/step6-download-report-dialog.component';
import { Step7DownloadReportDialog } from './shared/dialog/step7-download-report-dialog/step7-download-report-dialog.component';
import { ActualRecoveryRatetDialog } from './shared/dialog/actual-recovery-rate-dialog/actual-recovery-rate-dialog.component';
import { ReportStatusDialog } from './shared/dialog/report-status-dialog/report-status-dialog.component';
import * as Sentry from '@sentry/browser';
import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { IframeReportDialog } from './shared/dialog/iframe-report-dialog/iframe-report-dialog.component';
import { PcipReportDialog } from './shared/dialog/pcip-report-dialog/pcip-report-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { IsReadyConfirmDialog } from './shared/dialog/isReady-confirm-dialog/isReady-confirm-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { AngularResizedEventModule } from 'angular-resize-event';
import { AddBusinessLevelDialog } from './shared/dialog/add-business-level/add-business-level.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ManageMemebersDialog } from './shared/dialog/manage-members-dialog/manage-members-dialog.component';
import { InviteNewMemberDialog } from './shared/dialog/invite-new-member/invite-new-member.component';
import { AdminModule } from './admin/admin.module';
import { AddPaticaItemDialog } from './shared/dialog/add-patica-item/add-patica-item.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InputTrimModule } from 'ng2-trim-directive';
import { EditBusinessLevelDialog } from './shared/dialog/edit-business-level/edit-business-level.component';
import { MyEnergyModule } from './myEnergy/myenergy.module';
import { MyenergyStartDialog } from './shared/dialog/myenergy-start/myenergy-start.component';
import { MyenergyGoalsVideoDialog } from './shared/dialog/myenergy-goals-video/myenergy-goals-video.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MyenergyInvaiteSupplier } from './shared/dialog/myenergy-invaite-supplier/myenergy-invaite-supplier.component';

if (environment.production) {
  Sentry.init({
    dsn:
      'https://33dd795a42984214bc6867cb874270db@o403400.ingest.sentry.io/5265974',
    integrations: [
      new Sentry.Integrations.TryCatch({
        XMLHttpRequest: false,
      }),
    ],
  });
}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}

  extractError(error: any) {
    if (error && error.ngOriginalError) {
      error = error.ngOriginalError;
    }
    if (typeof error === 'string' || error instanceof Error) {
      return error;
    }
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof Error) {
        return error.error;
      }
      if (error.error instanceof ErrorEvent) {
        return error.error.message;
      }
      if (typeof error.error === 'string') {
        return `Server returned code ${error.status} with body "${error.error}"`;
      }
      return error.message;
    }
    return null;
  }

  handleError(error: any) {
    const extractedError = this.extractError(error) || 'Handled unknown error';
    const eventId = Sentry.captureException(extractedError);
    if (!environment.production) {
      console.error(extractedError);
    }
    Sentry.showReportDialog({ eventId });
  }
}
@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', {
      enabled: environment.production,
    }),
    FormsModule,
    HttpClientModule,
    HotTableModule.forRoot(),
    TranslateModule.forRoot(),
    NgbModule,
    CurrencyMaskModule,
    CoreModule,
    SharedModule,
    ShellModule,
    MatSortModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    LoginModule,
    RegisterModule,
    MatButtonModule,
    MyEnergyModule,
    AdminModule,
    AngularResizedEventModule,
    HttpModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatStepperModule,
    InputTrimModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    CarouselModule,
    ReactiveFormsModule,
    MatTableModule,
    AngularEditorModule,
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
  ],
  entryComponents: [
    InviteColleagueDialog,
    DeleteConfirmDialog,
    PublishConfirmDialog,
    ConfirmDialog,
    IsReadyConfirmDialog,
    ReportStatusDialog,
    NewUserDialogComponent,
    NewSupplierDialogComponent,
    Step2DownloadReportDialog,
    Step5DownloadReportDialog,
    Step6DownloadReportDialog,
    Step7DownloadReportDialog,
    IframeReportDialog,
    PcipReportDialog,
    ActualRecoveryRatetDialog,
    AddAssessmentDialog,
    AddPaticaItemDialog,
    AddBusinessLevelDialog,
    EditBusinessLevelDialog,
    InviteNewMemberDialog,
    MyenergyStartDialog,
    MyenergyGoalsVideoDialog,
    MyenergyInvaiteSupplier,
  ],
  declarations: [
    AppComponent,
    InviteColleagueDialog,
    DeleteConfirmDialog,
    ConfirmDialog,
    PublishConfirmDialog,
    IsReadyConfirmDialog,
    ReportStatusDialog,
    NewUserDialogComponent,
    NewSupplierDialogComponent,
    Step2DownloadReportDialog,
    Step5DownloadReportDialog,
    Step6DownloadReportDialog,
    Step7DownloadReportDialog,
    IframeReportDialog,
    PcipReportDialog,
    ActualRecoveryRatetDialog,
    AddAssessmentDialog,
    AddPaticaItemDialog,
    ManageMemebersDialog,
    AddBusinessLevelDialog,
    EditBusinessLevelDialog,
    InviteNewMemberDialog,
    MyenergyStartDialog,
    MyenergyGoalsVideoDialog,
    MyenergyInvaiteSupplier,
  ],
  providers: [{ provide: ErrorHandler, useClass: SentryErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
