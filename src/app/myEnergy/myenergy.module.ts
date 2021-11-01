import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyEnergyRoutingModule } from './myenergy-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxCurrencyModule } from 'ngx-currency';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilepondPluginImagePreview from 'filepond-plugin-image-preview';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AutosizeModule } from '@techiediaries/ngx-textarea-autosize';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DirectProcurementComponent } from './procurements/direct-procurement/direct-procurement.component';
import { TenderProcurementComponent } from './procurements/tender-procurement/tender-procurement.component';
import { ProcurementsComponent } from './procurements/procurements.component';
import { PurchasComponent } from './procurements/direct-procurement/purchase/purchase.component';
import { OverviewComponent } from './procurements/direct-procurement/overview/overview.component';
import { ProductRecommendationComponent } from './product-recommendation/product-recommendation.component';
import { RequestComponent } from './product-recommendation/request/request.component';
import { FamilyComponent } from './shared/family/family.component';
import { CriteriaComponent } from './shared/criteria/criteria.component';
import { LabelsComponent } from './shared/labels/labels.component';
import { SuppliersComponent } from './shared/suppliers/suppliers.component';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFilePoster,
  FilepondPluginImagePreview
);
@NgModule({
  imports: [
    CommonModule,
    MyEnergyRoutingModule,
    FilePondModule,
    TranslateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    NoopAnimationsModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatRadioModule,
    MatDialogModule,
    BrowserModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDatepickerModule,
    NgxDaterangepickerMd.forRoot(),
    ScrollingModule,
    CarouselModule,
    NgxCurrencyModule,
    AutosizeModule,
  ],
  declarations: [
    DashboardComponent,
    DirectProcurementComponent,
    TenderProcurementComponent,
    ProcurementsComponent,
    PurchasComponent,
    OverviewComponent,
    ProductRecommendationComponent,
    RequestComponent,
    FamilyComponent,
    CriteriaComponent,
    LabelsComponent,
    SuppliersComponent,
  ],
})
export class MyEnergyModule {}
