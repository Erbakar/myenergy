import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './procurements/direct-procurement/overview/overview.component';
import { PurchasComponent } from './procurements/direct-procurement/purchase/purchase.component';
import { ProcurementsComponent } from './procurements/procurements.component';
import { ProductRecommendationComponent } from './product-recommendation/product-recommendation.component';
import { RequestComponent } from './product-recommendation/request/request.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'myenergy', redirectTo: 'myenergy/dashboard', pathMatch: 'full' },
    {
      path: 'myenergy/dashboard',
      component: DashboardComponent,
      data: { title: extract('MyEnergy Dashboard') },
    },
    {
      path: 'myenergy/purchases/direct-procurement',
      component: ProcurementsComponent,
      data: { title: extract('MyEnergy Direct Procurement') },
    },
    {
      path: 'myenergy/purchases/direct-procurement/overview/:purchaseId',
      component: OverviewComponent,
      data: { title: extract('MyEnergy Direct Procurement Overview') },
    },
    {
      path:
        'myenergy/purchases/direct-procurement/purchase/:purchaseId/:tab/:productId',
      component: PurchasComponent,
      data: { title: extract('MyEnergy Purchases') },
    },
    {
      path: 'myenergy/purchases/tender-procurement',
      component: ProcurementsComponent,
      data: { title: extract('MyEnergy Tender Procurement') },
    },
    {
      path: 'myenergy/product-recommendation',
      component: ProductRecommendationComponent,
      data: { title: extract('MyEnergy Product Recommendation') },
    },
    {
      path: 'myenergy/product-recommendation/:recommendationId/:activeTab',
      component: RequestComponent,
      data: { title: extract('MyEnergy Product Recommendation Request') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class MyEnergyRoutingModule {}
