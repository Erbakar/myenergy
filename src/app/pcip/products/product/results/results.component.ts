import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  constructor(public commonService: CommonService, public router: Router) {}

  ngOnInit() {}
}
