import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { TfaComponent } from './tfa/tfa.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: extract('CircularIQ - Login') },
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: extract('CircularIQ - Forgot Password') },
  },
  {
    path: 'signup',
    component: SetPasswordComponent,
    data: { title: extract('CircularIQ - Signup') },
  },
  {
    path: 'reset',
    component: ResetPasswordComponent,
    data: { title: extract('CircularIQ - Reset Password') },
  },
  {
    path: 'tfa',
    component: TfaComponent,
    data: { title: extract('CircularIQ - TFA') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class LoginRoutingModule {}
