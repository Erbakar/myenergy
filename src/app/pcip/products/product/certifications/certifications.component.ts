import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss'],
})
export class CertificationsComponent implements OnInit {
  requirements = 'yes';
  material = 'yes';
  constructor(public commonService: CommonService, public router: Router) {}

  ngOnInit() {}
}
