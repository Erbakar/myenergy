import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'myenergy-challenges.dialog',
  templateUrl: './myenergy-challenges.component.html',
  styleUrls: ['./myenergy-challenges.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class MyenergyChallengesDialog implements OnInit {
  constructor(public dialogRef: MatDialogRef<MyenergyChallengesDialog>) {
    $('.mat-dialog-container').css('background', '#D6F3E0');
  }
  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
