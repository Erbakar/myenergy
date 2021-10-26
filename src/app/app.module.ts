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
import { DeleteConfirmDialog } from './shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import { ConfirmDialog } from './shared/dialog/confirm-dialog/confirm-dialog.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import * as Sentry from '@sentry/browser';
import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AngularResizedEventModule } from 'angular-resize-event';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InputTrimModule } from 'ng2-trim-directive';
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
    DeleteConfirmDialog,
    ConfirmDialog,
    MyenergyStartDialog,
    MyenergyGoalsVideoDialog,
    MyenergyInvaiteSupplier,
  ],
  declarations: [
    AppComponent,
    DeleteConfirmDialog,
    ConfirmDialog,
    MyenergyStartDialog,
    MyenergyGoalsVideoDialog,
    MyenergyInvaiteSupplier,
  ],
  providers: [{ provide: ErrorHandler, useClass: SentryErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
