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
          // this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (credentials) => {
          if (this.project === 'cti') {
            this.getQuestionList();
          }
          this.freeOrganisation =
            credentials['organisation']['licenseType'] === 'Free';
          if (credentials['tfaRequired']) {
            this.router.navigate(['/tfa'], { replaceUrl: true });
          } else {
            credentials['roles'].forEach((element) => {
              if (element.name === 'Super admin') {
                this.router.navigate(['/admin'], { replaceUrl: true });
              } else {
                this.route.queryParams.subscribe((params) => {
                  this.http
                    .callService(
                      new Method(environment.services.ctiGuidance(), '', 'get')
                    )
                    .subscribe((res) => {
                      if (environment.project === 'cti') {
                        if (res['newUser']) {
                          this.router.navigate(['/cti/guide/new-user'], {
                            replaceUrl: true,
                          });
                        } else {
                          if (this.freeOrganisation) {
                            this.router.navigate(['/cti/materials'], {
                              replaceUrl: true,
                            });
                          } else {
                            if (res['newOrganisation']) {
                              this.router.navigate(
                                ['/cti/guide/organisation'],
                                { replaceUrl: true }
                              );
                            } else {
                              this.isPro = false;
                              credentials['organisation'].features.forEach(
                                (element) => {
                                  if (element === 'unlimited_unit') {
                                    this.isPro = true;
                                  }
                                }
                              );
                              this.http
                                .callService(
                                  new Method(
                                    environment.services.listBusinessLevels(),
                                    '',
                                    'get'
                                  )
                                )
                                .subscribe((level) => {
                                  if (this.isPro) {
                                    this.router.navigate(['/cti/pro'], {
                                      replaceUrl: true,
                                    });
                                  } else {
                                    this.http
                                      .callService(
                                        new Method(
                                          environment.services.ctiUnitGuidance(
                                            level[0].assessments[0].unitId
                                          ),
                                          '',
                                          'get'
                                        )
                                      )
                                      .subscribe((step) => {
                                        sessionStorage.setItem(
                                          'ctiUnitGuidance',
                                          JSON.stringify(step)
                                        );
                                        this.router.navigate(
                                          ['/cti/guide/step1'],
                                          { replaceUrl: true }
                                        );
                                      });
                                  }
                                });
                            }
                          }
                        }
                      } else if (this.project === 'myenergy') {
                        this.router.navigate(['/myenergy']);
                      } else {
                        this.router.navigate(['/products']);
                      }
                    });
                });
              }
            });
          }
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

  getQuestionList() {
    this.http
      .callService(new Method(environment.services.questionList(), '', 'get'))
      .subscribe((res) => {
        sessionStorage.setItem('questionList', JSON.stringify(res));
      });
  }
}
