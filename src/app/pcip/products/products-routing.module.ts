import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ProductsComponent } from './products.component';
import { AddComponent } from './product/add/add.component';
import { UpdateComponent } from './product/update/update.component';
import { BomComponent } from './product/bom/bom.component';
import { QuestionnaireComponent } from './product/questionnaire/questionnaire.component';
import { CertificationsComponent } from './product/certifications/certifications.component';
import { ResultsComponent } from './product/results/results.component';
import { ProductComponent } from './product/product.component';
import { SpreadsheetComponent } from './product/spreadsheet/spreadsheet.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'products',
      component: ProductsComponent,
      data: { title: extract('Products') },
    },
    {
      path: 'products/spreadsheet/:id',
      component: SpreadsheetComponent,
      data: { title: extract('Product Spreadsheet') },
    },
    {
      path: 'products/spreadsheet/:id/:productId',
      component: SpreadsheetComponent,
      data: { title: extract('Product Spreadsheet') },
    },
    {
      path: 'products/add',
      component: AddComponent,
      data: { title: extract('Product Add') },
    },
    {
      path: 'products/:id',
      component: ProductsComponent,
      data: { title: extract('Product') },
    },
    {
      path: 'products/:id/update',
      component: UpdateComponent,
      data: { title: extract('Product Update') },
    },
    {
      path: 'products/:id/bom',
      component: BomComponent,
      data: { title: extract('BOM') },
    },
    {
      path: 'products/:parrentId/bom/:id',
      component: UpdateComponent,
      data: { title: extract('BOM Product') },
    },
    {
      path: 'products/:id/questionnaire',
      component: QuestionnaireComponent,
      data: { title: extract('Product Questionnaire') },
    },
    {
      path: 'products/:id/certifications',
      component: CertificationsComponent,
      data: { title: extract('Product Certifications') },
    },
    {
      path: 'products/:id/results',
      component: ResultsComponent,
      data: { title: extract('Product Results') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ProductsRoutingModule {}
