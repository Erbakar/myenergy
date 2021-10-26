import { Component } from '@angular/core';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../assets/javascript/patica';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.scss'],
})
export class BoxesComponent {
  Inicators;
  language;
  data;
  tooltipShow = false;
  selectedTooltip;
  showModal = false;
  showEnergy = false;
  showWater = false;
  environment = environment;
  showCirculation = false;
  showProductivity = false;
  showRevenue = false;
  dialogName;
  unit;
  selectedUnitId;
  constructor(
    private http: ApiRequestService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private router: Router
  ) {
    if (localStorage.getItem('selectedUnit')) {
      this.language = localStorage.getItem('language') || 'English';
      this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
      this.selectedUnitId = this.unit['id'];
      this.unitdetail();
    }
  }
  unitdetail() {
    this.http
      .callService(
        new Method(
          environment.services.unitDetailed(this.selectedUnitId),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.data = res;
        this.Inicators = this.data.indicators;
      });
  }
  selectEvent(item: string, i: number) {
    this.selectedTooltip = item;
    this.tooltipShow = true;
    const btnPosition = $('dl:eq( ' + i + ' )').offset().left;
    if (btnPosition > 350) {
      $('.tool-tip').css('left', btnPosition - 350 + 'px');
    } else {
      $('.tool-tip').css('left', 0);
    }
    setTimeout(() => {
      this.tooltipShow = false;
    }, 5000);
  }
  goToTheStep2() {
    this.router.navigateByUrl('/cti/guide/step2', {
      state: { selectedProduct: this.selectedTooltip },
    });
  }

  updateEvent(item: any) {
    this.showModal = true;
    openPatica();
    $('.patica-sidebar').addClass('modal-page');
    switch (item) {
      case 'energy':
        this.showEnergy = true;
        goToModulePatica(6, '29daaf921232055e2949db835c94d678');
        break;
      case 'water':
        this.showWater = true;
        break;
      case 'circulation':
        this.showCirculation = true;
        break;
      case 'productivity':
        this.showProductivity = true;
        goToModulePatica(6, '65683b137ba21dcd0213848ef01d5066');
        break;
      case 'revenue':
        this.showRevenue = true;
        break;
      default:
        return;
        break;
    }
  }

  public hideModal() {
    this.showEnergy = false;
    this.showWater = false;
    this.showCirculation = false;
    this.showProductivity = false;
    this.showRevenue = false;
    this.showModal = false;
    $('.patica-sidebar').removeClass('modal-page');
    hidePatica();
  }

  public async modalSave() {
    this.unitdetail();
    this.snackBar.open(
      await this.translateService
        .get('transactionSuccessful')
        .pipe(first())
        .toPromise(),
      '',
      {
        duration: 5000,
        panelClass: ['success-snackBar'],
      }
    );
    this.hideModal();
  }
}
