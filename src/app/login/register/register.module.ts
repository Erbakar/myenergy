import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RegisterRoutingModule } from './register-routing.module';
import { CtiRegisterComponent } from './cti-register/cti-register.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    RegisterRoutingModule,
  ],
  declarations: [CtiRegisterComponent],
})
export class RegisterModule {}
