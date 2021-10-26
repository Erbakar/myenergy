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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuppliersComponent } from './suppliers.component';
import { SuppliersRoutingModule } from './suppliers-routing.module';
import { SupplierDetailComponent } from './supplier-detail/supplier-detail.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SuppliersRoutingModule,
    MatTabsModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    MatMenuModule,
    BrowserModule,
    FormsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SuppliersComponent,
    SupplierDetailComponent,
    UsersComponent,
    UserDetailComponent,
  ],

  providers: [],
})
export class SuppliersModule {}
