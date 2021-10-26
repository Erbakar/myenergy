import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CopmanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company/company.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CopmanyRoutingModule,
    MatTabsModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CompanyComponent,
    MainComponent,
    CertificatesComponent,
    UsersComponent,
    AddUserComponent,
    UserDetailComponent,
  ],
  providers: [],
})
export class CopmanyModule {}
