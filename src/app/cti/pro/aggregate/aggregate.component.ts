import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '@app/core/common.service';
declare var $: any;
@Component({
  selector: 'app-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: ['./aggregate.component.scss'],
})
export class AggregateComponent implements OnInit, OnDestroy {
  seletedMajorPart = 'close';
  data;
  constructor(private commonService: CommonService, private router: Router) {
    $('#main-content').addClass('darkBG');
    $('#header').hide();
  }

  ngOnInit(): void {
    if (localStorage.getItem('aggregateData')) {
      this.data = JSON.parse(localStorage.getItem('aggregateData'));
    } else {
      this.router.navigate(['cti/pro']);
    }
  }
  ngOnDestroy() {
    $('#main-content').removeClass('darkBG');
    $('#header').show();
  }
}
