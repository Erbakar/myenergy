import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-step-info',
  templateUrl: './step-info.component.html',
  styleUrls: ['./step-info.component.scss'],
})
export class StepInfoComponent implements OnInit {
  trustUrl = [];
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    slideBy: 1,
    center: true,
    margin: -100,
    startPosition: 3,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    rewind: false,
    navText: ['&lsaquo;', '&rsaquo;'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1.5,
      },
      768: {
        items: 2.5,
      },
    },
    nav: true,
  };
  constructor(private sanitizer: DomSanitizer) {
    const version = new Date().getTime();
    this.trustUrl = [
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://frontend-playground.s3.us-east-2.amazonaws.com/step1.html?${version}`
      ),
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://frontend-playground.s3.us-east-2.amazonaws.com/step2.html?${version}`
      ),
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://frontend-playground.s3.us-east-2.amazonaws.com/step3.html?${version}`
      ),
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://frontend-playground.s3.us-east-2.amazonaws.com/step4.html?${version}`
      ),
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://frontend-playground.s3.us-east-2.amazonaws.com/step5.html?${version}`
      ),
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://frontend-playground.s3.us-east-2.amazonaws.com/step6.html?${version}`
      ),
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://frontend-playground.s3.us-east-2.amazonaws.com/step7.html?${version}`
      ),
    ];
  }

  ngOnInit(): void {}
}
