import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { CtiLeftNavComponent } from './cti-left-nav/left-nav.component';
import { MyenergyLeftNavComponent } from './myenergy-left-nav/left-nav.component';

@NgModule({
  imports: [CommonModule, TranslateModule, NgbModule, RouterModule],
  declarations: [
    HeaderComponent,
    ShellComponent,
    LeftNavComponent,
    CtiLeftNavComponent,
    MyenergyLeftNavComponent,
  ],
})
export class ShellModule {}
