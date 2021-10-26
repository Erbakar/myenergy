import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiRequestService, Method } from '../../core/http/api-request.service';
import { ForgotService } from './forgot.service';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  isLoading = false;
  quote: string;
  forgotPasswordForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: ApiRequestService,
    private service: ForgotService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  forgotPassword() {
    fetch(
      environment.serverUrl + environment.myEnergyServices.forgottenPassword(),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(this.forgotPasswordForm.value),
      }
    ).then((res) => {
      if (res.ok) {
        this.snackBar.open('Check your email', '', {
          duration: 5000,
          panelClass: ['error-snackBar'],
        });
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }

  ngOnInit() {}
  private createForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }
}
