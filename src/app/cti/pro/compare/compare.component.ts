import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '@app/core/common.service';
declare var $: any;
@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit, OnDestroy {
  seletedMajorPart = 'close';
  data;
  constructor(private commonService: CommonService, private router: Router) {
    $('#main-content').addClass('darkBG');
    $('#header').hide();
  }

  ngOnInit(): void {
    if (localStorage.getItem('compareData')) {
      this.data = JSON.parse(localStorage.getItem('compareData'));
    } else {
      this.router.navigate(['cti/pro']);
    }
  }
  ngOnDestroy() {
    $('#main-content').removeClass('darkBG');
    $('#header').show();
  }
}
