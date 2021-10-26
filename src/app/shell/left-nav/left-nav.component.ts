import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { CommonService } from '@app/core/common.service';

@Component({
  selector: 'app-myenergy-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss'],
})
export class LeftNavComponent implements OnInit {
  user;
  freeOrganisation;
  isPro = false;
  businessLevelLength;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
  ) {
    this.user = JSON.parse(sessionStorage.getItem('credentials'));
    this.freeOrganisation = this.user.organisation.licenseType === 'Free';
    const credentials = JSON.parse(sessionStorage.getItem('credentials'));
    credentials['organisation'].features.forEach((element) => {
      if (element === 'unlimited_unit') {
        this.isPro = true;
      }
    });
    this.commonService.businessLevelLength.subscribe((res) => {
      this.businessLevelLength = res;
    });
  }

  ngOnInit() {}
  logout() {
    this.authenticationService
      .logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }
}
