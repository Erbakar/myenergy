import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'myenergy-start.dialog',
  templateUrl: './myenergy-start.component.html',
  styleUrls: ['./myenergy-start.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class MyenergyStartDialog implements OnInit {
  constructor(public dialogRef: MatDialogRef<MyenergyStartDialog>) {
    $('.mat-dialog-container').css('background', '#253E4E');
  }
  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
