import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyenergyGoalsVideoDialog } from '@app/shared/dialog/myenergy-goals-video/myenergy-goals-video.component';

@Component({
  selector: 'app-tender-procurement',
  templateUrl: './tender-procurement.component.html',
  styleUrls: ['./tender-procurement.component.scss'],
})
export class TenderProcurementComponent implements OnInit {
  constructor(private dialog: MatDialog) {}
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

  ngOnInit(): void {}
}
