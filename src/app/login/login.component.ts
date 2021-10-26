import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Logger, I18nService } from '@app/core';
import { LoginService } from './login.service';
declare var $: any;
const log = new Logger('CircularIQ - Login');
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  version: string = environment.version;
  project: string = environment.project;
  error: string;
  remember = false;
  loginForm: FormGroup;
  isLoading = false;
  freeOrganisation = false;

  constructor(
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private loginService: LoginService
  ) {
    this.createForm();
    $('html').addClass(this.project);
  }

  login() {
    this.loginService.login(this.loginForm.value);
  }

  rememeberme(val: any) {}

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: false,
    });
  }
}
