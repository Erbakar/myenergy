import { Component, OnInit, Input } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-missing-data',
  templateUrl: './missing-data.component.html',
  styleUrls: ['./missing-data.component.scss'],
})
export class MissingDataComponent implements OnInit {
  @Input() public data: string;
  environment = environment;
  constructor() {}

  ngOnInit(): void {
    console.log(this.data);
  }
}
