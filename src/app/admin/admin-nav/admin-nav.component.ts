import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss'],
})
export class AdminNavComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}
  logout() {
    this.authenticationService
      .logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }
}
