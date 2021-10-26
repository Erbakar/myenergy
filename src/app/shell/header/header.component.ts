import { Component } from '@angular/core';
import { VERSION } from '@env/version';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  version = VERSION;
  constructor() {}
}
