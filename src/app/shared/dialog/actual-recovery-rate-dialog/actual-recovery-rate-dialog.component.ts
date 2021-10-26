import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'actual-recovery-rate-dialog.component',
  templateUrl: './actual-recovery-rate-dialog.component.html',
  styleUrls: ['./actual-recovery-rate-dialog.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class ActualRecoveryRatetDialog {
  public data = [
    'Metals - Steel',
    'Metals - Aluminium',
    'Metals - Copper',
    'Metals - Lead',
    'Paper',
    'Plastics - PET',
    'Plastics - PE',
    'Plastics - PP',
    'Plastics - PS',
    'Plastics - EPS',
    'Plastics - PVC',
    'Plastics - Polycarbonate PC',
    'Plastics - Generic plastics',
    'Glass',
    'Wood',
    'Textiles',
  ];
  public subdata = [
    {
      material: 'Metals - Steel',
      application: 'MATERIAL',
      value: 'Metals - Steel - MATERIAL',
      percentage: '85',
    },
    {
      material: 'Metals - Steel',
      application: 'building - sheet',
      value: 'Metals - Steel - building - sheet',
      percentage: '95',
    },
    {
      material: 'Metals - Steel',
      application: 'packaging',
      value: 'Metals - Steel - packaging',
      percentage: '74',
    },
    {
      material: 'Metals - Steel',
      application: 'steel hangers and screws',
      value: 'Metals - Steel - steel hangers and screws',
      percentage: '95',
    },
    {
      material: 'Metals - Aluminium',
      application: 'MATERIAL (unspcified)',
      value: 'Metals - Aluminium - MATERIAL (unspcified)',
      percentage: '85',
    },
    {
      material: 'Metals - Aluminium',
      application: 'automotive',
      value: 'Metals - Aluminium - automotive',
      percentage: '90',
    },
    {
      material: 'Metals - Aluminium',
      application: 'building - sheet',
      value: 'Metals - Aluminium - building - sheet',
      percentage: '95',
    },
    {
      material: 'Metals - Aluminium',
      application: 'building - e.g. doors, windows',
      value: 'Metals - Aluminium - building - e.g. doors, windows',
      percentage: '90',
    },
    {
      material: 'Metals - Aluminium',
      application: 'appliances - sheet',
      value: 'Metals - Aluminium - appliances - sheet',
      percentage: '90',
    },
    {
      material: 'Metals - Aluminium',
      application: 'packaging - cans, closures, trays',
      value: 'Metals - Aluminium - packaging - cans, closures, trays',
      percentage: '69',
    },
    {
      material: 'Metals - Copper',
      application: 'building - sheet',
      value: 'Metals - Copper - building - sheet',
      percentage: '95',
    },
    {
      material: 'Metals - Copper',
      application: 'building - pipes',
      value: 'Metals - Copper - building - pipes',
      percentage: '95',
    },
    {
      material: 'Metals - Copper',
      application: 'electronic applications',
      value: 'Metals - Copper - electronic applications',
      percentage: '80',
    },
    {
      material: 'Metals - Copper',
      application: 'electrical applications (cables)',
      value: 'Metals - Copper - electrical applications (cables)',
      percentage: '95',
    },
    {
      material: 'Metals - Copper',
      application: 'mechanical applications',
      value: 'Metals - Copper - mechanical applications',
      percentage: '80',
    },
    {
      material: 'Metals - Copper',
      application: 'building - water supply pipes',
      value: 'Metals - Copper - building - water supply pipes',
      percentage: '95',
    },
    {
      material: 'Metals - Copper alloys',
      application: 'building - water supply pipes',
      value: 'Metals - Copper alloys - building - water supply pipes',
      percentage: '95',
    },
    {
      material: 'Metals - Lead',
      application: 'building - sheet',
      value: 'Metals - Lead - building - sheet',
      percentage: '95',
    },
    {
      material: 'Paper',
      application: 'MATERIAL',
      value: 'Paper - MATERIAL',
      percentage: '62',
    },
    {
      material: 'Plastics - PET',
      application: 'packaging - bottle',
      value: 'Plastics - PET - packaging - bottle',
      percentage: '42',
    },
    {
      material: 'Plastics - PE',
      application: 'PE-LD building and construction',
      value: 'Plastics - PE - PE-LD building and construction',
      percentage: '27.5',
    },
    {
      material: 'Plastics - PE',
      application: 'PE-HD building and construction',
      value: 'Plastics - PE - PE-HD building and construction',
      percentage: '27.5',
    },
    {
      material: 'Plastics - PP',
      application: 'building and construction',
      value: 'Plastics - PP - building and construction',
      percentage: '18.3',
    },
    {
      material: 'Plastics - PS',
      application: 'building and construction',
      value: 'Plastics - PS - building and construction',
      percentage: '6.7',
    },
    {
      material: 'Plastics - EPS',
      application: 'building and construction',
      value: 'Plastics - EPS - building and construction',
      percentage: '6.7',
    },
    {
      material: 'Plastics - PVC',
      application: 'building and construction',
      value: 'Plastics - PVC - building and construction',
      percentage: '32.1',
    },
    {
      material: 'Plastics - Polycarbonate PC',
      application: 'packaging - water',
      value: 'Plastics - Polycarbonate PC - packaging - water',
      percentage: '29.',
    },
    {
      material: 'Plastics - Generic plastics',
      application: 'packaging - generic',
      value: 'Plastics - Generic plastics - packaging - generic',
      percentage: '29.',
    },
    {
      material: 'Glass',
      application: 'MATERIAL',
      value: 'Glass - MATERIAL',
      percentage: '66',
    },
    {
      material: 'Wood',
      application: 'packaging - pallet',
      value: 'Wood - packaging - pallet',
      percentage: '30',
    },
    {
      material: 'Textiles',
      application: 't-shirts',
      value: 'Textiles - t-shirts',
      percentage: '11',
    },
  ];
  public selelctedParrent = 'Metals - Steel';
  constructor(
    public dialogRef: MatDialogRef<ActualRecoveryRatetDialog>,
    public router: Router,
    private http: ApiRequestService
  ) {}

  setParrentData(item: string) {
    this.selelctedParrent = item;
  }

  onYesClick(item: string): void {
    this.dialogRef.close(item);
  }
}
