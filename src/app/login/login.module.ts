import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotService } from './forgot-password/forgot.service';
import { SetPasswordComponent } from './set-password/set-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SetPasswordService } from './set-password/set-password.service';
import { ResetPasswordService } from './reset-password/reset-password.service';
import { TfaComponent } from './tfa/tfa.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    LoginRoutingModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
    ResetPasswordComponent,
    TfaComponent,
  ],
  providers: [ForgotService, SetPasswordService, ResetPasswordService],
})
export class LoginModule {}
