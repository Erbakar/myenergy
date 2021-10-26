import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersComponent } from './users/users.component';
import { CompanyComponent } from './company/company.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'company',
      component: MainComponent,
      data: { title: extract('Company') },
    },
    {
      path: 'company/detail',
      component: CompanyComponent,
      data: { title: extract('Company') },
    },
    {
      path: 'company/users',
      component: UsersComponent,
      data: { title: extract('Company Users') },
    },
    {
      path: 'company/users/:email',
      component: UserDetailComponent,
      data: { title: extract('Update User') },
    },
    {
      path: 'company/add-user',
      component: AddUserComponent,
      data: { title: extract('Add User') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class CopmanyRoutingModule {}
