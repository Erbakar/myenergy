import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { CtiRegisterComponent } from './cti-register/cti-register.component';

const routes: Routes = [
  {
    path: 'register',
    component: CtiRegisterComponent,
    data: { title: extract('CircularIQ - Register CTI') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class RegisterRoutingModule {}
