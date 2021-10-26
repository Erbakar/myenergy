import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  EmailValidator,
} from '@angular/forms';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Response } from 'selenium-webdriver/http';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
// tslint:disable-next-line: class-name
export class NewUserComponent implements OnInit {
  isLoading = false;
  user;
  freeOrganisation;
  name;
  lastame;
  quote: string;
  registerForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: ApiRequestService,
    public router: Router
  ) {
    this.user = JSON.parse(sessionStorage.getItem('credentials'));
    this.freeOrganisation = this.user.organisation.licenseType === 'Free';
    if (this.user.name) {
      let fullname = this.user.name;
      fullname = fullname.split(' ');
      const stringArray = new Array();
      for (let i = 0; i < fullname.length; i++) {
        stringArray.push(fullname[i]);
        if (i !== fullname.length - 1) {
          stringArray.push(' ');
        }
      }
      this.name = stringArray[0];
      this.lastame = stringArray[2];
    }
    this.createForm();
  }

  register() {
    const data = [
      {
        question: 'CTI_KNOWLEDGE',
        value: this.registerForm.value.CTI_KNOWLEDGE,
      },
    ];
    this.http
      .callService(new Method(environment.services.guidance(), data, 'put'))
      .subscribe((res) => {
        if (this.freeOrganisation) {
          this.router.navigate(['/cti/materials'], { replaceUrl: true });
        } else {
          this.http
            .callService(
              new Method(environment.services.ctiGuidance(), '', 'get')
            )
            .subscribe((response) => {
              if (response['newOrganisation']) {
                this.router.navigate(['/cti/guide/new-organisation'], {
                  replaceUrl: true,
                });
              } else {
                this.router.navigate(['/cti/guide/step1'], {
                  replaceUrl: true,
                });
              }
            });
        }
      });
  }

  ngOnInit() {}
  private createForm() {
    this.registerForm = this.formBuilder.group({
      firstname: [this.name ? this.name : '', Validators.required],
      lastname: [this.lastame ? this.lastame : '', Validators.required],
      CTI_KNOWLEDGE: ['', Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
    });
  }
}
