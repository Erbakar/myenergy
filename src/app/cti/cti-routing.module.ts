import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { CtiComponent } from './cti.component';
import { Shell } from '@app/shell/shell.service';
import { OrganizationComponent } from './organization/organization.component';
import { MaterialsComponent } from './materials/materials.component';
import { SuppliersComponent } from '@app/pcip/suppliers/suppliers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewUserComponent } from './guides/new-user/new-user.component';
import { Step1Component } from './guides/step1/step1.component';
import { Step2Component } from './guides/step2/step2.component';
import { NewOrganisationComponent } from './guides/new-organisation/new-organisation.component';
import { AddMaterialComponent } from './add-material/add-material.component';
import { CriticalMaterialComponent } from './guides/critical-material/critical-material.component';
import { Step3Component } from './guides/step3/step3.component';
import { UserComponent } from './user/user.component';
import { Step5Component } from './guides/step5/step5.component';
import { Step6Component } from './guides/step6/step6.component';
import { Step7Component } from './guides/step7/step7.component';
import { ProComponent } from './pro/pro.component';
import { CompareComponent } from './pro/compare/compare.component';
import { AggregateComponent } from './pro/aggregate/aggregate.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'cti', redirectTo: 'cti/dashboard', pathMatch: 'full' },
    {
      path: 'cti/organisation',
      component: OrganizationComponent,
      data: { title: extract('CircularIQ - CTI Organisation') },
    },
    {
      path: 'cti/pro',
      component: ProComponent,
      data: { title: extract('CircularIQ - CTI PRO') },
    },
    {
      path: 'cti/pro/compare',
      component: CompareComponent,
      data: { title: extract('CircularIQ - CTI PRO COMPARE') },
    },
    {
      path: 'cti/pro/aggregate',
      component: AggregateComponent,
      data: { title: extract('CircularIQ - CTI PRO AGGREGATE') },
    },
    {
      path: 'cti/user',
      component: UserComponent,
      data: { title: extract('CircularIQ - CTI User Profile') },
    },
    {
      path: 'cti/materials',
      component: MaterialsComponent,
      data: { title: extract('CircularIQ - CTI Materials') },
    },
    {
      path: 'cti/suppliers',
      component: SuppliersComponent,
      data: { title: extract('CircularIQ - CTI Suppliers') },
    },
    {
      path: 'cti/dashboard',
      component: DashboardComponent,
      data: { title: extract('CircularIQ - CTI Dashboard') },
    },
    {
      path: 'cti/guide/step1',
      component: Step1Component,
      data: { title: extract('CircularIQ - CTI Guide') },
    },
    {
      path: 'cti/guide/step2',
      component: Step2Component,
      data: { title: extract('CircularIQ - CTI Guide'), selectedProduct: '' },
    },
    {
      path: 'cti/guide/step3',
      component: Step3Component,
      data: { title: extract('CircularIQ - CTI Guide') },
    },
    {
      path: 'cti/guide/materials/step3',
      component: MaterialsComponent,
      data: { title: extract('CircularIQ - CTI Guide') },
    },
    {
      path: 'cti/guide/step4',
      component: DashboardComponent,
      data: { title: extract('CircularIQ - CTI Guide') },
    },
    {
      path: 'cti/guide/step5',
      component: Step5Component,
      data: { title: extract('CircularIQ - CTI Guide') },
    },
    {
      path: 'cti/guide/step6',
      component: Step6Component,
      data: { title: extract('CircularIQ - CTI Guide') },
    },
    {
      path: 'cti/guide/step7',
      component: Step7Component,
      data: { title: extract('CircularIQ - CTI Guide') },
    },

    {
      path: 'cti/guide/critical-material',
      component: CriticalMaterialComponent,
      data: { title: extract('CircularIQ - Critical Material') },
    },
    {
      path: 'cti/add-material',
      component: AddMaterialComponent,
      data: { title: extract('CircularIQ - CTI Add Material') },
    },
    {
      path: 'cti/add-material/:flow',
      component: AddMaterialComponent,
      data: { title: extract('CircularIQ - CTI Add Material') },
    },
  ]),
  {
    path: 'cti/guide/new-user',
    component: NewUserComponent,
    data: { title: extract('CircularIQ - CTI Guide') },
  },
  {
    path: 'cti/guide/new-organisation',
    component: NewOrganisationComponent,
    data: { title: extract('CircularIQ - CTI Guide') },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class CtiRoutingModule {}
