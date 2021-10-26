import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ImportComponent } from './import.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'import',
      component: ImportComponent,
      data: { title: extract('Import') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ImportRoutingModule {}
