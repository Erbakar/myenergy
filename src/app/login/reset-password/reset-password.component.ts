import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { ApiRequestService, Method } from '../../core/http/api-request.service';
import { ResetPasswordService } from './reset-password.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  signUpForm: FormGroup;
  email;
  errors = [];
  tokenValue;
  pageShow = false;
  password;
  submitted = false;
  type = 'password';
  isRegex = true;
  isConfirm = true;

  constructor(
    private http: ApiRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private setServise: ResetPasswordService,
    private snackBar: MatSnackBar
  ) {
    this.tokenValue = this.route.snapshot.queryParams.token;
    try {
      const decoded = jwt_decode(this.tokenValue);
      this.email = decoded['email'];
    } catch (err) {
      this.snackBar.open('token is not valid!', '', {
        duration: 5000,
        panelClass: ['error-snackBar'],
      });
    }

    this.setServise.checkToken(this.tokenValue).subscribe((res) => {
      if (!res) {
        this.pageShow = true;
      } else {
        this.snackBar.open(res, '', {
          duration: 5000,
          panelClass: ['error-snackBar'],
        });
      }
    });
  }

  onSubmit() {
    const data = { token: this.tokenValue, password: this.password };
    this.setServise.setPassword(data).subscribe((res) => {
      if (!res) {
        this.router.navigate(['/login']);
      } else {
        this.snackBar.open(res, '', {
          duration: 5000,
          panelClass: ['error-snackBar'],
        });
      }
    });
  }
  passwordRegex(password: string, confirmedPassword: string) {
    this.errors = [];
    if (password.length < 8 || password.length > 20) {
      this.errors.push('Your password  size must be between 8 and 20');
    }
    if (password.search(/[a-z]/i) < 0) {
      this.errors.push('Your password must contain at least one letter.');
    }
    if (password.search(/([A-Z]+)/g) < 0) {
      this.errors.push('Your password must contain at least one uppercase.');
    }
    if (password.search(/[0-9]/) < 0) {
      this.errors.push('Your password must contain at least one digit.');
    }

    this.isConfirmed(password, confirmedPassword);
  }
  isConfirmed(password: string, confirmedPassword: string) {
    if (password === confirmedPassword) {
      this.isConfirm = true;
    } else {
      this.isConfirm = false;
    }
  }

  ngOnInit() {
    this.createForm();
  }
  private createForm() {
    this.signUpForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      confirmedPassword: new FormControl(null, [Validators.required]),
    });
  }
}
