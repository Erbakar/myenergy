import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { MyenergyGoalsVideoDialog } from '@app/shared/dialog/myenergy-goals-video/myenergy-goals-video.component';
import { DeleteConfirmDialog } from '@app/shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import { ProcurementsService } from '../procurements.service';

@Component({
  selector: 'app-direct-procurement',
  templateUrl: './direct-procurement.component.html',
  styleUrls: ['./direct-procurement.component.scss'],
})
export class DirectProcurementComponent implements OnInit {
  directData;
  selectLabel = 'Show All';
  selectCategory = 'Choose a category';
  selectAmount = 'Choose amount';
  selectSort = 'Newest to oldest';
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private http: ApiRequestService,
    public procurementsService: ProcurementsService
  ) {}
  infoVideoModal(topic: any) {
    const dialogRef = this.dialog.open(MyenergyGoalsVideoDialog, {
      width: '80%',
      maxWidth: '680px',
      data: topic,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
      } catch (error) {}
    });
  }
  ngOnInit(): void {
    this.getPurchasList();
  }

  getPurchasList() {
    this.http
      .callService(
        new Method(
          environment.myEnergyServices.procurementPurchase(),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.directData = res;
      });
  }

  settings(item: any) {
    this.directData.forEach((element) => {
      if (item.uuid === element.uuid) {
        element.open === true ? (element.open = false) : (element.open = true);
      } else {
        element.open = false;
      }
    });
  }

  async removePurchas(purchase: object) {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '80%',
      maxWidth: '440px',
      data: {
        title: `${purchase['name']}`,
        message: 'Are you sure you want to delete purchase? Please confirm.',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.procurementsService.purchase('', 'delete');
        setTimeout(() => {
          this.getPurchasList();
        }, 500);
      } catch (error) {}
    });
  }
}
