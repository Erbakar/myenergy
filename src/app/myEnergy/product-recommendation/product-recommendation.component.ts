import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-recommendation',
  templateUrl: './product-recommendation.component.html',
  styleUrls: ['./product-recommendation.component.scss'],
})
export class ProductRecommendationComponent {
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
}
