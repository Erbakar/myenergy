import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImportRoutingModule } from './import-routing.module';
import { ImportComponent } from './import.component';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilepondPluginImagePreview from 'filepond-plugin-image-preview';
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
    ImportRoutingModule,
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
    ReactiveFormsModule,
  ],
  entryComponents: [],
  declarations: [ImportComponent],

  providers: [],
})
export class ImportModule {}
