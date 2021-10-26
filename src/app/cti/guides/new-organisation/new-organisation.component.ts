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

@Component({
  selector: 'app-new-organisation',
  templateUrl: './new-organisation.component.html',
  styleUrls: ['./new-organisation.component.scss'],
})
// tslint:disable-next-line: class-name
export class NewOrganisationComponent implements OnInit {
  isLoading = false;
  quote: string;
  campany;
  registerForm: FormGroup;

  industries = [
    'Agriculture, forestry and fishing',
    'Mining and quarrying',
    'Manufacturing',
    'Electricity, gas, steam and air conditioning supply',
    'Water supply; sewerage, waste management and remediation activities',
    'Construction',
    'Wholesale and retail trade; repair of motor vehicles and motorcycles',
    'Transportation and storage',
    'Accommodation and food service activities',
    'Information and communication',
    'Financial and insurance activities',
    'Real estate activities',
    'Professional, scientific and technical activities',
    'Administrative and support service activities',
    'Public administration and defence; compulsory social security',
    'Education',
    'Human health and social work activities',
    'Arts, entertainment and recreation',
    'Other service activities',
    'Activities of households as employers; undifferentiated goods- and services-producing activities of households for own use',
    'Activities of extraterritorial organizations and bodies',
    'Other',
  ];

  positions = [
    'Materials extraction and agriculture',
    'Upstream materials producer (chemicals, mining, metal…)',
    'Manufacturer of consumable goods (food, medicine…)',
    'Manufacturer of consumer goods and infrastructure (clothes, electronics, buildings..)',
    'Waste and waste water treatment',
    'Reverse cycle for products (refurbish and tighter)',
    'Retail of consumer goods and infrastructure',
    'Services using products (e.g., transportation)',
    'Purely services (e.g., consulting)',
    'Other',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private http: ApiRequestService,
    public router: Router
  ) {
    this.campany = JSON.parse(sessionStorage.getItem('credentials'));
    this.createForm();
  }

  register() {
    this.http
      .callService(
        new Method(
          environment.services.organisationDetails(),
          this.registerForm.value,
          'put'
        )
      )
      .subscribe((res) => {
        this.router.navigate(['/cti/guide/step1']);
      });
  }

  ngOnInit() {}
  private createForm() {
    this.registerForm = this.formBuilder.group({
      companyName: [this.campany['organisation']['name'], Validators.required],
      industry: ['Agriculture, forestry and fishing', Validators.required],
      industryOther: [''],
      position: ['Materials extraction and agriculture', Validators.required],
      positionOther: [''],
      address: ['', Validators.required],
      revenue: [''],
      currenctType: ['€'],
    });
  }
}
