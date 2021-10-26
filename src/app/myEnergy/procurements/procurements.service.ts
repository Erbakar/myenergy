import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProcurementsService {
  constructor(private http: ApiRequestService) {}
  public getLabels(): Promise<any> {
    return this.http
      .callService(
        new Method(environment.myEnergyServices.getlabels(), '', 'get')
      )
      .toPromise();
  }
  public putLabels(data: any): Promise<any> {
    return this.http
      .callService(
        new Method(environment.myEnergyServices.putlabels(), data, 'put')
      )
      .toPromise();
  }
  public purchase(data: any, type: String): Promise<any> {
    return this.http
      .callService(
        new Method(environment.myEnergyServices.purchase(), data, type)
      )
      .toPromise();
  }
  public purchaseDetail(
    purchaseUuid: string,
    data: any,
    type: String
  ): Promise<any> {
    return this.http
      .callService(
        new Method(
          environment.myEnergyServices.purchaseDetail(purchaseUuid),
          data,
          type
        )
      )
      .toPromise();
  }
  public questionnaire(data: any, type: String): Promise<any> {
    return this.http
      .callService(
        new Method(environment.myEnergyServices.questionnaire(), data, type)
      )
      .toPromise();
  }
  public getCategory(): Promise<any> {
    return this.http
      .callService(
        new Method(environment.myEnergyServices.getCategory(), '', 'get')
      )
      .toPromise();
  }
  public getFamily(): Promise<any> {
    return this.http
      .callService(
        new Method(environment.myEnergyServices.getFamily(), '', 'get')
      )
      .toPromise();
  }
  public purchaseConfirm(purchaseUuid: string, data: any): Promise<any> {
    return this.http
      .callService(
        new Method(
          environment.myEnergyServices.purchaseConfirm(purchaseUuid),
          data,
          'put'
        )
      )
      .toPromise();
  }
  public subCategoryCriteria(subCategoryId: string): Promise<any> {
    return this.http
      .callService(
        new Method(
          environment.myEnergyServices.subCategoryCriteria(subCategoryId),
          '',
          'get'
        )
      )
      .toPromise();
  }

  public allCriteria(): Promise<any> {
    return this.http
      .callService(
        new Method(environment.myEnergyServices.allCriteria(), '', 'get')
      )
      .toPromise();
  }
  public getCriteriaLabels(criteriaId: any): Promise<any> {
    return this.http
      .callService(
        new Method(
          environment.myEnergyServices.getCriteriaLabels(criteriaId),
          '',
          'get'
        )
      )
      .toPromise();
  }
  public createRecommendation(data: any, type: string): Promise<any> {
    return this.http
      .callService(
        new Method(
          environment.myEnergyServices.createRecommendation(),
          data,
          type
        )
      )
      .toPromise();
  }

  public getRecommendation(recommendationId: any): Promise<any> {
    return this.http
      .callService(
        new Method(
          environment.myEnergyServices.getRecommendation(recommendationId),
          '',
          'get'
        )
      )
      .toPromise();
  }
  public getSuppliers(subCategoryId: any): Promise<any> {
    return this.http
      .callService(
        new Method(
          environment.myEnergyServices.getSuppliers(subCategoryId),
          '',
          'get'
        )
      )
      .toPromise();
  }

  public recommendationConfirm(
    recommendationId: string,
    data: any
  ): Promise<any> {
    return this.http
      .callService(
        new Method(
          environment.myEnergyServices.recommendationConfirm(recommendationId),
          data,
          'put'
        )
      )
      .toPromise();
  }
}
