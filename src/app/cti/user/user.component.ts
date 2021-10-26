import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  EmailValidator,
  FormControl,
} from '@angular/forms';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  isLoading = false;
  language;
  user;
  quote: string;
  registerForm: FormGroup;
  isConfirm = true;
  type = 'password';
  currenttype = 'password';
  isRegex = true;
  errors = [];
  password;
  changePasswordForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: ApiRequestService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.language = localStorage.getItem('language');
    $('#header-box').hide();
  }

  register() {
    const data = this.registerForm.value;
    this.http
      .callService(new Method(environment.services.currentUser(), data, 'put'))
      .subscribe((res) => {
        this.getUser();
        this.snackBar.open('User update successful!', '', {
          duration: 5000,
          panelClass: ['success-snackBar'],
        });
      });
  }

  chanepassword() {
    const data = {
      oldPassword: this.changePasswordForm.controls.oldPassword.value,
      newPassword: this.changePasswordForm.controls.password.value,
    };
    this.http
      .callService(new Method(environment.services.password(), data, 'put'))
      .subscribe((res) => {
        if (res) {
          this.snackBar.open('Your password change successful', '', {
            duration: 5000,
            panelClass: ['success-snackBar'],
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
    this.getUser();
  }
  ngOnDestroy() {
    $('#header-box').show();
  }
  getUser() {
    this.http
      .callService(new Method(environment.services.currentUser(), '', 'get'))
      .subscribe((res) => {
        this.user = res;
        this.createForm();
        this.createChangePasswordForm();
      });
  }

  private createForm() {
    this.registerForm = this.formBuilder.group({
      firstName: [this.user['firstname'], Validators.required],
      middleName: [this.user['middlename']],
      lastName: [this.user['lastname'], Validators.required],
      email: [this.user['email'], [Validators.required, Validators.email]],
    });
  }

  private createChangePasswordForm() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmedPassword: new FormControl(null, [Validators.required]),
    });
  }
}
