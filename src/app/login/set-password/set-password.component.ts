import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { SetPasswordService } from './set-password.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../login.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
})
export class SetPasswordComponent implements OnInit {
  signUpForm: FormGroup;
  language;
  email;
  errors = [];
  agree = false;
  tokenValue;
  pageShow = null;
  loginValue;
  password;
  submitted = false;
  type = 'password';
  isRegex = true;
  isConfirm = true;
  version: string = environment.version;
  error: string;
  remember = false;
  loginForm: FormGroup;
  isLoading = false;
  freeOrganisation = false;
  constructor(
    private route: ActivatedRoute,
    private setServise: SetPasswordService,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {
    this.tokenValue = this.route.snapshot.queryParams.token;
    this.language = localStorage.getItem('language');
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
        this.pageShow = false;
        this.snackBar.open(res, '', {
          duration: 5000,
          panelClass: ['error-snackBar'],
        });
      }
    });
  }

  onSubmit() {
    const data = { token: this.tokenValue, password: this.password };
    this.loginValue = {
      email: this.email,
      password: this.password,
      remember: false,
    };
    this.setServise.setPassword(data).subscribe((res) => {
      if (!res) {
        this.loginService.login(this.loginValue);
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
      if (this.language === 'Türkçe') {
        this.errors.push('Şifrenizin uzunluğu 8 ile 20 arasında olmalıdır');
      } else {
        this.errors.push('Your password  size must be between 8 and 20');
      }
    }
    if (password.search(/[a-z]/i) < 0) {
      if (this.language === 'Türkçe') {
        this.errors.push('Şifreniz en az bir harf içermelidir.');
      } else {
        this.errors.push('Your password must contain at least one letter.');
      }
    }
    if (password.search(/([A-Z]+)/g) < 0) {
      if (this.language === 'Türkçe') {
        this.errors.push('Şifreniz en az bir büyük harf içermelidir.');
      } else {
        this.errors.push('Your password must contain at least one uppercase.');
      }
    }
    if (password.search(/[0-9]/) < 0) {
      if (this.language === 'Türkçe') {
        this.errors.push('Şifreniz en az bir rakam içermelidir.');
      } else {
        this.errors.push('Your password must contain at least one digit.');
      }
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

  resend() {
    const data = { token: this.tokenValue };
    this.setServise.reSend(data).subscribe((res) => {
      if (res) {
        this.snackBar.open(res, '', {
          duration: 5000,
          panelClass: ['error-snackBar'],
        });
      }
    });
  }

  private createForm() {
    this.signUpForm = new FormGroup({
      accept: new FormControl(false),
      password: new FormControl(null, [Validators.required]),
      confirmedPassword: new FormControl(null, [Validators.required]),
    });
  }
}
