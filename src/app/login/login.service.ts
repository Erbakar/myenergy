import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { awaitExpression } from 'babel-types';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  version: string = environment.version;
  project: string = environment.project;
  error: string;
  remember = false;
  isPro = false;
  isAdmin = false;
  loginForm: FormGroup;
  isLoading = false;
  freeOrganisation = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private http: ApiRequestService
  ) {}

  login(data: any) {
    this.isLoading = true;
    this.authenticationService
      .login(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (credentials) => {
          this.router.navigate(['/myenergy/dashboard']);
        },
        (error) => {
          this.snackBar.open(error.error.message, '', {
            duration: 5000,
            panelClass: ['error-snackBar'],
          });
          this.router.navigate(['/login']);
          this.isLoading = false;
          this.error = error;
        }
      );
  }
}
