import { Component } from '@angular/core';
import { environment } from '@env/environment';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { qs } from './scripts/utils';
import { data } from './scripts/data';
import { Model } from './scripts/model';
import { draw } from './scripts/draw';
import { Chart } from './scripts/chart';

declare var require: any;
@Component({
  selector: 'app-sankey',
  templateUrl: './sankey.component.html',
  styleUrls: ['./sankey.component.scss'],
})
export class SankeyComponent {
  elementResizeEvent = require('element-resize-event');
  showD3 = false;
  language;
  serviceData;
  constructor(private http: ApiRequestService) {
    this.language = localStorage.getItem('language');
    this.getGraph();
  }

  getGraph() {
    this.http
      .callService(
        new Method(
          environment.services.graph(localStorage.getItem('unitId')),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.serviceData = res;
        if (this.language === 'Türkçe') {
          data.entities.input[0].name =
            'Circular Girdi : ' + res['inflowCircularPercentage'] + '%';
          data.entities.output[0].name =
            'Circular Çıktı : ' + res['outflowCircularPercentage'] + '%';
          data.entities.input[1].name =
            'Doğrusal Girdi : ' + res['inflowLinearPercentage'] + '%';
          data.entities.output[1].name =
            'Doğrusal Çıktı : ' + res['outflowLinearPercentage'] + '%';
        } else {
          data.entities.input[0].name =
            'Circular Inflow : ' + res['inflowCircularPercentage'] + '%';
          data.entities.output[0].name =
            'Circular Outflow : ' + res['outflowCircularPercentage'] + '%';
          data.entities.input[1].name =
            'Linear Inflow : ' + res['inflowLinearPercentage'] + '%';
          data.entities.output[1].name =
            'Linear Outflow : ' + res['outflowLinearPercentage'] + '%';
        }
        // tslint:disable-next-line:radix
        data.entities.input[0].percent = parseInt(
          res['inflowCircularPercentage']
        );
        // tslint:disable-next-line:radix
        data.entities.input[1].percent = parseInt(
          res['inflowLinearPercentage']
        );
        // tslint:disable-next-line:radix
        data.entities.output[0].percent = parseInt(
          res['outflowCircularPercentage']
        );
        // tslint:disable-next-line:radix
        data.entities.output[1].percent = parseInt(
          res['outflowLinearPercentage']
        );
        draw(document.getElementById('chart'));

        this.elementResizeEvent(document.getElementById('chart'), function () {
          if (this.element) {
            this.element.removeChild(qs('svg'));
            draw(document.getElementById('chart'));
            this.showD3 = true;
          }
        });
      });
  }
}
