import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductComponent } from './product/product.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { UpdateComponent } from './product/update/update.component';
import { BomComponent } from './product/bom/bom.component';
import { QuestionnaireComponent } from './product/questionnaire/questionnaire.component';
import { CertificationsComponent } from './product/certifications/certifications.component';
import { ResultsComponent } from './product/results/results.component';
import { AddComponent } from './product/add/add.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateBomDialog } from '@app/shared/dialog/create-bom/create-bom.component';
import { AddExistingComponentDialog } from '../../shared/dialog/add-existing-component/add-existing.component';
import { MatMenuModule } from '@angular/material/menu';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilepondPluginImagePreview from 'filepond-plugin-image-preview';
import { InviteExistingSupplierDialog } from '@app/shared/dialog/invite-existing-supplier/invite-existing-supplier.component';
import { HotTableModule } from '@handsontable/angular';
import { SpreadsheetComponent } from './product/spreadsheet/spreadsheet.component';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFilePoster,
  FilepondPluginImagePreview
);

@NgModule({
  imports: [
    CommonModule,
    FilePondModule,
    TranslateModule,
    ProductsRoutingModule,
    MatTabsModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatRadioModule,
    MatDialogModule,
    BrowserModule,
    FormsModule,
    HotTableModule,
    ReactiveFormsModule,
    MatMenuModule,
  ],
  entryComponents: [
    CreateBomDialog,
    AddExistingComponentDialog,
    InviteExistingSupplierDialog,
  ],
  declarations: [
    ProductsComponent,
    SpreadsheetComponent,
    ProductComponent,
    UpdateComponent,
    BomComponent,
    QuestionnaireComponent,
    CertificationsComponent,
    CreateBomDialog,
    AddExistingComponentDialog,
    InviteExistingSupplierDialog,
    ResultsComponent,
    AddComponent,
  ],

  providers: [],
})
export class ProductsModule {}
