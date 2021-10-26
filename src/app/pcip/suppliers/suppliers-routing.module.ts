import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { SuppliersComponent } from './suppliers.component';
import { SupplierDetailComponent } from './supplier-detail/supplier-detail.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'suppliers',
      component: SuppliersComponent,
      data: { title: extract('Suppliers') },
    },
    {
      path: 'suppliers/:id',
      component: SupplierDetailComponent,
      data: { title: extract('Supplier Detail') },
    },
    {
      path: 'suppliers/:id/users',
      component: UsersComponent,
      data: { title: extract('Supplier Users') },
    },
    {
      path: 'suppliers/user-detail/:email',
      component: UserDetailComponent,
      data: { title: extract('Supplier User Detail') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SuppliersRoutingModule {}
