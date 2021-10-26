import { Component, OnDestroy } from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../assets/javascript/patica';
import { HeaderComponent } from '@app/shell/header/header.component'; // tslint:disable-next-line:class-name
export class materialItem {
  name: string;
}

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnDestroy {
  businessLevels = [
    'Select business level',
    'Company level',
    'Business unit',
    'Product line',
    'Site location',
    'Other',
  ];
  countries = [
    'Afghanistan',
    'Åland Islands',
    'Albania',
    'Algeria',
    'American Samoa',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antarctica',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Bouvet Island',
    'Brazil',
    'British Indian Ocean Territory',
    'British Virgin Islands',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Cayman Islands',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Christmas Island',
    'Cocos (Keeling) Islands',
    'Colombia',
    'Comoros',
    'Cook Islands',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Curaçao',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'DR Congo',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Falkland Islands',
    'Faroe Islands',
    'Fiji',
    'Finland',
    'France',
    'French Guiana',
    'French Polynesia',
    'French Southern and Antarctic Lands',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guadeloupe',
    'Guam',
    'Guatemala',
    'Guernsey',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Heard Island and McDonald Islands',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Isle of Man',
    'Israel',
    'Italy',
    'Ivory Coast',
    'Jamaica',
    'Japan',
    'Jersey',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macau',
    'Macedonia',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Martinique',
    'Mauritania',
    'Mauritius',
    'Mayotte',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue',
    'Norfolk Island',
    'North Korea',
    'Northern Mariana Islands',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Pitcairn Islands',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Republic of the Congo',
    'Reunion',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Barthélemy',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Martin',
    'Saint Pierre and Miquelon',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Sint Maarten',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Georgia',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Svalbard and Jan Mayen',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tokelau',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks and Caicos Islands',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'United States Minor Outlying Islands',
    'United States Virgin Islands',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Wallis and Futuna',
    'Western Sahara',
    'Yemen',
    'Zambia',
    'Zimbabwe',
  ];
  businessLevelData;
  data;
  isPro = false;
  selectedUnit;
  selectedUnitId;
  inflowFocusList: materialItem[];
  outflowFocusList: materialItem[];

  constructor(
    private commonService: CommonService,
    private http: ApiRequestService,
    private snackBar: MatSnackBar,
    public router: Router
  ) {
    openPatica();
    goToModulePatica(4, '8026c102d998956257c2d4ac7cce1c59');
    this.commonService.selectedUnit.subscribe((unit) => {
      this.data = unit;
      this.selectedUnit = unit['details'];
      this.selectedUnitId = unit['id'];
      if (this.data['businessLevel']) {
        const index = this.businessLevels.indexOf(this.data['businessLevel']);
        if (index === -1) {
          this.businessLevels.push(this.data['businessLevel']);
        }
        this.selectedUnit.businessLevel = this.data['businessLevel'];
      } else {
        this.selectedUnit.businessLevel = 'Select business level';
      }
      this.selectedUnit['currencyType'] = this.selectedUnit['currencyType']
        ? this.selectedUnit['currencyType']
        : '€';
      if (this.selectedUnit.period) {
        this.selectedUnit.period.start = new Date(
          this.selectedUnit.period.start
        );
        this.selectedUnit.period.end = new Date(this.selectedUnit.period.end);
      }
      if (
        this.selectedUnit.inflowFocusList &&
        this.selectedUnit.inflowFocusList.length > 0
      ) {
        this.inflowFocusList = this.selectedUnit.inflowFocusList;
      } else {
        this.inflowFocusList = [{ name: '' }];
      }
      if (
        this.selectedUnit.outflowFocusList &&
        this.selectedUnit.outflowFocusList.length > 0
      ) {
        this.outflowFocusList = this.selectedUnit.outflowFocusList;
      } else {
        this.outflowFocusList = [{ name: '' }];
      }
      const credentials = JSON.parse(sessionStorage.getItem('credentials'));
      credentials['organisation'].features.forEach((element) => {
        if (element === 'unlimited_unit') {
          this.isPro = true;
        }
      });
      this.getUnitBusinessLevel();
    });
  }
  ngOnDestroy() {
    hidePatica();
  }

  getUnitBusinessLevel() {
    this.http
      .callService(
        new Method(
          environment.services.getUnitBusinessLevel(this.selectedUnitId),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.businessLevelData = res;
      });
  }

  currencyTypeChange(type: any) {
    this.selectedUnit.currencyType = type;
  }
  saveStep1(item: any, businessData: any) {
    if (!this.isPro) {
      const data = {
        type: businessData.type,
        name: businessData.name,
        otherType: businessData.otherType,
      };
      this.http.callService(
        new Method(
          environment.services.editBusinessLevel(businessData['id']),
          data,
          'put'
        )
      );
    }
    item['supplyLevel'] = businessData.type;
    this.http
      .callService(
        new Method(
          environment.services.unitEdit(this.selectedUnitId),
          {
            businessLevel:
              this.selectedUnit.businessLevel === 'Other'
                ? this.selectedUnit.businessLevelOther
                : this.selectedUnit.businessLevel,
            name: this.data.name,
          },
          'put'
        )
      )
      .subscribe((res) => {
        this.http
          .callService(
            new Method(
              environment.services.unitDetail(this.selectedUnitId),
              item,
              'put'
            )
          )
          .subscribe((res2) => {
            this.commonService.refreshUnitGuindance(this.selectedUnitId);
            if (!this.isPro) {
              location.href = '/cti/guide/step2';
            } else {
              this.commonService.getbusinessLevelList.next({
                businessLevel: JSON.parse(
                  localStorage.getItem('selectedBusiness')
                ),
                assessmentUnitId: this.data['id'],
                goToStep1: false,
              });
              this.router.navigate(['/cti/guide/step2']);
            }
            this.snackBar.open(' update successful', '', {
              duration: 5000,
              panelClass: ['success-snackBar'],
            });
          });
      });
  }
}
