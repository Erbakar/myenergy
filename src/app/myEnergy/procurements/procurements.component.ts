import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-procurements',
  templateUrl: './procurements.component.html',
  styleUrls: ['./procurements.component.scss'],
})
export class ProcurementsComponent implements OnInit {
  activeTab = null;

  constructor(private router: Router) {
    if (this.router.url === '/myenergy/purchases/tender-procurement') {
      this.activeTab = 1;
    }
  }

  onLinkClick(item: any) {
    setTimeout(() => {
      if (item.index === 0) {
        this.router.navigate(['myenergy/purchases/direct-procurement']);
      } else {
        this.router.navigate(['myenergy/purchases/tender-procurement']);
      }
    }, 1200);
  }

  ngOnInit(): void {}
}
