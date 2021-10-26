import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtiRoutingModule } from './cti-routing.module';
import { CtiComponent } from './cti.component';
import { OrganizationComponent } from './organization/organization.component';
import { MaterialsComponent } from './materials/materials.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { TranslateModule } from '@ngx-translate/core';
import { EnergyComponent } from './materials/energy/energy.component';
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
import { InflowQuestionComponent } from './materials/question/inflow-question.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Step1Component } from './guides/step1/step1.component';
import { NewUserComponent } from './guides/new-user/new-user.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxCurrencyModule } from 'ngx-currency';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Step2Component } from './guides/step2/step2.component';
import { NewOrganisationComponent } from './guides/new-organisation/new-organisation.component';
import { AddMaterialComponent } from './add-material/add-material.component';
import { StepperComponent } from './shared-components/stepper/stepper.component';
import { Step3Component } from './guides/step3/step3.component';
import { SankeyComponent } from './sankey/sankey.component';
import { CriticalMaterialComponent } from './guides/critical-material/critical-material.component';
import { FileUploadComponent } from './shared-components/file-upload/file-upload.component';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilepondPluginImagePreview from 'filepond-plugin-image-preview';
import { Step4Component } from './guides/step4/step4.component';
import { UserComponent } from './user/user.component';
import { ProductivityComponent } from './shared-components/productivity/productivity.component';
import { Step5Component } from './guides/step5/step5.component';
import { HeadNavComponent } from './guides/step5/head-nav/head-nav.component';
import { InflowComponent } from './guides/step5/inflow/inflow.component';
import { OutflowComponent } from './guides/step5/outflow/outflow.component';
import { IntroComponent } from './guides/step5/intro/intro.component';
import { Step6Component } from './guides/step6/step6.component';
import { Intro6Component } from './guides/step6/intro6/intro6.component';
import { Inflow6Component } from './guides/step6/inflow6/inflow6.component';
import { Outflow6Component } from './guides/step6/outflow6/outflow6.component';
import { WaterComponent } from './guides/step6/water/water.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Step7Component } from './guides/step7/step7.component';
import { Intro7Component } from './guides/step7/intro7/intro7.component';
import { SmartTargetComponent } from './guides/step7/smart-target/smart-target.component';
import { ChecklistComponent } from './shared-components/checklist/checklist.component';
import { InflowQuestionsComponent } from './guides/step5/inflow-questions/inflow-questions.component';
import { OutflowQuestionsComponent } from './guides/step5/outflow-questions/outflow-questions.component';
import { AutosizeModule } from '@techiediaries/ngx-textarea-autosize';
import { ProofComponent } from './materials/question/proof/proof.component';
import { OutflowQuestionComponent } from './materials/question/outflow-question.component';
import { BoxesComponent } from './shared-components/boxes/boxes.component';
import { EnergyConfirm } from './shared-components/boxes/energy-confirm/energy-confirm.component';
import { WaterConfirm } from './shared-components/boxes/water-confirm/water-confirm.component';
import { OnSiteWaterConfirm } from './shared-components/boxes/onSiteWater-confirm/onSiteWater-confirm.component';
import { ProductivityConfirm } from './shared-components/boxes/productivity-confirm/productivity-confirm.component';
import { RevenueConfirm } from './shared-components/boxes/revenue-confirm/revenue-confirm.component';
import { SankeyInfoComponent } from './shared-components/sankey-info/sankey-info.component';
import { StepInfoComponent } from './shared-components/step-info/step-info.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { EnergyAnalysisComponent } from './guides/step5/energy-analysis/energy-analysis.component';
import { WaterAnalysisComponent } from './guides/step5/water-analysis/water-analysis.component';
import { DownloadComponent } from './guides/step5/download/download.component';
import { Step6CriticalMaterialComponent } from './guides/step6/critical-materials/critical-materials.component';
import { Step6EnergyComponent } from './guides/step6/energy/energy.component';
import { ProComponent } from './pro/pro.component';
import { CompareComponent } from './pro/compare/compare.component';
import { CompareCloseComponent } from './pro/compare/close/close.component';
import { CompareValueComponent } from './pro/compare/value/value.component';
import { CompareOptimizeComponent } from './pro/compare/optimize/optimize.component';
import { AggregateComponent } from './pro/aggregate/aggregate.component';
import { AggregateCloseComponent } from './pro/aggregate/close/close.component';
import { AggregateValueComponent } from './pro/aggregate/value/value.component';
import { AggregateOptimizeComponent } from './pro/aggregate/optimize/optimize.component';
import { MissingDataComponent } from './pro/aggregate/missing-data/missing-data.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFilePoster,
  FilepondPluginImagePreview
);
@NgModule({
  imports: [
    CommonModule,
    CtiRoutingModule,
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
    CtiComponent,
    OrganizationComponent,
    MaterialsComponent,
    SuppliersComponent,
    EnergyComponent,
    InflowQuestionComponent,
    OutflowQuestionComponent,
    DashboardComponent,
    Step1Component,
    NewUserComponent,
    Step2Component,
    NewOrganisationComponent,
    AddMaterialComponent,
    SankeyComponent,
    CriticalMaterialComponent,
    StepperComponent,
    Step3Component,
    SankeyComponent,
    FileUploadComponent,
    Step4Component,
    UserComponent,
    ProductivityComponent,
    Step5Component,
    HeadNavComponent,
    InflowComponent,
    OutflowComponent,
    IntroComponent,
    Step6Component,
    Intro6Component,
    Inflow6Component,
    Outflow6Component,
    Step6EnergyComponent,
    WaterComponent,
    Step6CriticalMaterialComponent,
    Step7Component,
    Intro7Component,
    SmartTargetComponent,
    ChecklistComponent,
    InflowQuestionsComponent,
    OutflowQuestionsComponent,
    ProofComponent,
    BoxesComponent,
    EnergyConfirm,
    WaterConfirm,
    OnSiteWaterConfirm,
    ProductivityConfirm,
    RevenueConfirm,
    SankeyInfoComponent,
    StepInfoComponent,
    EnergyAnalysisComponent,
    WaterAnalysisComponent,
    DownloadComponent,
    ProComponent,
    CompareComponent,
    CompareCloseComponent,
    CompareValueComponent,
    CompareOptimizeComponent,
    AggregateComponent,
    AggregateCloseComponent,
    AggregateOptimizeComponent,
    AggregateValueComponent,
    MissingDataComponent,
  ],
})
export class CtiModule {}
