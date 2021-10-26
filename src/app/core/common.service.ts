import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public isLogin = new BehaviorSubject<any>('');
  // public productId;
  public breadcrumbOne = new BehaviorSubject<any>('');
  public breadcrumbTwo = new BehaviorSubject<any>('');
  public seletedChemical = new BehaviorSubject<any>('');
  public productId = new BehaviorSubject<any>('');
  public step5ActiveCase = new BehaviorSubject<any>('inflow-question');
  public step6ActiveCase = new BehaviorSubject<any>('inflow6');
  public step7ActiveCase = new BehaviorSubject<any>('smartTarget');
  public materialType;
  public stepsData = new Subject<any>();
  public businessLevelLength = new Subject<any>();
  public addmaterialType;
  public criticalPercentage;
  public selectedProduct;
  public lensData;
  public getbusinessLevelList = new Subject<any>();
  public selectedUnit = new Subject<any>();
  public refreshStep = new Subject<any>();
  public isShowstep5Intro = new Subject<any>();
  public isShowstep6Intro = new Subject<any>();
  public isShowstep7Intro = new Subject<any>();
  public openPatica = new Subject<any>();
  public openPaticaForQuestion = new Subject<any>();
  public selectedUnitID = '';
  public lastCreateMaterial = {};
  public selectedCircularUser = new Subject<any>();
  public selectedSupplier = new Subject<any>();
  public isGenerateQuestionnaireForm = new BehaviorSubject<any>(false);

  public familyData = null;

  constructor(private http: ApiRequestService) {}
  public refreshUnitGuindance(id: any) {
    this.http
      .callService(
        new Method(environment.services.ctiUnitGuidance(id), '', 'get')
      )
      .subscribe((res) => {
        sessionStorage.setItem('ctiUnitGuidance', JSON.stringify(res));
        this.refreshStep.next(res);
      });
  }
}
