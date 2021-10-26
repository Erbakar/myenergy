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
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}
  logout() {
    this.authenticationService
      .logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }
}
