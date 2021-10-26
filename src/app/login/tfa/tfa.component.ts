import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiRequestService, Method } from '../../core/http/api-request.service';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tfa',
  templateUrl: './tfa.component.html',
  styleUrls: ['./tfa.component.scss'],
})
export class TfaComponent implements OnInit {
  isLoading = false;
  quote: string;
  tfaForm: FormGroup;
  credentials;
  constructor(
    private formBuilder: FormBuilder,
    private http: ApiRequestService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  tfa() {
    const credentials = JSON.parse(sessionStorage.getItem('credentials'));
    const userId = credentials.userId;
    const data = { code: this.tfaForm.value.code, user_uuid: userId };
    this.http
      .callService(
        new Method(environment.services.authenticatetfa(), data, 'post')
      )
      .subscribe((response) => {
        this.credentials = JSON.stringify(response);
        sessionStorage.setItem('credentials', this.credentials);
        this.route.queryParams.subscribe((params) => {
          this.http
            .callService(
              new Method(environment.services.ctiGuidance(), '', 'get')
            )
            .subscribe((res) => {
              if (res['newUser']) {
                this.router.navigate(['/cti/guide/new-user'], {
                  replaceUrl: true,
                });
              } else if (res['newOrganisation']) {
                this.router.navigate(['/cti/guide/organisation'], {
                  replaceUrl: true,
                });
              } else {
                this.router.navigate(['/cti/guide/step1'], {
                  replaceUrl: true,
                });
              }
            });
        });
      });
  }

  ngOnInit() {}
  private createForm() {
    this.tfaForm = this.formBuilder.group({
      code: ['', Validators.required],
    });
  }
}
