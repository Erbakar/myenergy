import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    data: { title: extract('CircularIQ - Login') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AdminRoutingModule {}
