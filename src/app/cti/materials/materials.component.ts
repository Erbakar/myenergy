import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { environment } from '@env/environment';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { CommonService } from '@app/core/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReportStatusDialog } from '@app/shared/dialog/report-status-dialog/report-status-dialog.component';
import { InviteColleagueDialog } from '../../shared/dialog/invite-colleague/invite-colleague.component';
import { DeleteConfirmDialog } from '@app/shared/dialog/delete-confirm-dialog/delete-confirm-dialog.component';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../assets/javascript/patica';
declare var $: any;
@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
})
export class MaterialsComponent implements OnInit, OnDestroy {
  @Output() public myOutput = new EventEmitter();
  criticalBoxShow = false;
  energyBoxShow = false;
  inflows;
  inflowResults;
  environment = environment;
  questions;
  showModal = false;
  showCriticalMaterial = false;
  showFileUpload = false;
  steps;
  showAddFlow;
  outflows;
  isInitPatica = false;
  outflowResults;
  invitedFlows;
  activePageDetail = false;
  unitId = '';
  selectedMaterial = {
    id: '0',
    tradeName: '',
    type: '',
    responsibleSupplierInitals: '',
    responsibleSupplierInitalsFull: '',
    responsibleSupplierInitalsEmail: '',
    displayName: '',
    tradeNumber: '',
    status: '',
    owner: '',
    transitionDate: '',
    weight: null,
    responsibleUsers: [
      {
        email: '',
        organisation: {
          licenseType: '',
          name: '',
          id: '',
        },
        fullName: '',
        id: '0',
      },
    ],
    draft: null,
    critical: null,
    priority: null,
    buyer: {
      licenseType: '',
      name: '',
      id: '0',
    },
    virginNonRenewablePercentage: null,
    actualRecovery: null,
    potentialRecovery: null,
    wip: null,
    flowId: null,
    responsibleOwnerInitalsFull: '',
    responsibleOwnerInitalsEmail: '',
    responsibleOwnerInitals: '',
  };
  isShowPatica = false;
  size = 10;
  materiaNavShow = false;
  isHidePatica = false;
  lastCreateMaterial = {};
  user;
  freeOrganisation;
  pondOptions;
  constructor(
    private http: ApiRequestService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public router: Router
  ) {
    hidePatica();
    this.user = JSON.parse(sessionStorage.getItem('credentials'));
    this.freeOrganisation = this.user.organisation.licenseType === 'Free';
    this.commonService.openPatica.subscribe((res) => {
      if (res) {
        $('.patica-sidebar').removeClass('material-page');
        openPatica();
      } else {
        hidePatica();
        this.isShowPatica = false;
        this.isHidePatica = true;
      }
    });
    this.commonService.openPaticaForQuestion.subscribe((res) => {
      this.openPaticaEvent(res);
    });
    setTimeout(() => {
      this.getUnitGuidance(localStorage.getItem('unitId'));
    }, 1000);
    this.criticalBoxShow = JSON.parse(sessionStorage.getItem('Inicators'))
      ? JSON.parse(sessionStorage.getItem('Inicators')).criticalInflow
      : false;
    this.energyBoxShow = JSON.parse(sessionStorage.getItem('Inicators'))
      ? JSON.parse(sessionStorage.getItem('Inicators')).renewableEnergy
      : false;
  }
  getUnitGuidance(id: string) {
    this.http
      .callService(
        new Method(environment.services.ctiUnitGuidance(id), '', 'get')
      )
      .subscribe((res) => {
        this.steps = res;
        this.commonService.stepsData.next(res);
      });
  }
  selectEvent(item: any) {
    this.showModal = true;
    openPatica();
    $('.patica-sidebar').addClass('material-modal-page');
    switch (item) {
      case 'INFLOW':
        this.showAddFlow = true;
        this.commonService.addmaterialType = 'INFLOW';
        break;
      case 'OUTFLOW':
        this.showAddFlow = true;
        this.commonService.addmaterialType = 'OUTFLOW';
        break;
      case 'critical':
        this.showCriticalMaterial = true;
        break;
      case 'fileUpload':
        this.showFileUpload = true;
        break;
      default:
        return;
        break;
    }
  }

  public hideModal() {
    this.showModal = false;
    this.showCriticalMaterial = false;
    this.showAddFlow = false;
    this.showFileUpload = false;
    $('.patica-sidebar').removeClass('material-modal-page');
    hidePatica();
    this.lastCreateMaterial = this.commonService.lastCreateMaterial;
    this.initData();
  }

  ngOnInit() {
    this.initData();
  }

  public initData() {
    this.unitId = localStorage.getItem('unitId');
    if (this.unitId) {
      this.getInflows(this.unitId, 'INFLOW', 1, this.size);
      this.getOutflows(this.unitId, 'OUTFLOW', 1, this.size);
      this.getInvitedFlows(1, this.size);
    } else {
      this.http
        .callService(new Method(environment.services.getUnit(), '', 'get'))
        .subscribe((res) => {
          this.unitId = res[0]['id'];
          this.getInflows(this.unitId, 'INFLOW', 1, this.size);
          this.getOutflows(this.unitId, 'OUTFLOW', 1, this.size);
          this.getInvitedFlows(1, this.size);
        });
    }
  }

  ngOnDestroy() {
    hidePatica();
    $('.patica-sidebar').removeClass('material-page');
  }
  pageEventInflow(pageInfo: any) {
    this.getInflows(
      this.unitId,
      'INFLOW',
      pageInfo.pageIndex + 1,
      pageInfo.pageSize
    );
  }
  getInflows(unitId: string, type: string, page: number, size: number) {
    this.http
      .callService(
        new Method(
          environment.services.inflowsandOutflofList(unitId, type, page, size),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.inflows = res;
        this.inflowResults = this.inflows.results;
        this.inflowResults.forEach((element) => {
          this.setResponsibleUsers(element);
          if (element.id === this.lastCreateMaterial['id']) {
            this.showDetail(element, 'INFLOW');
          }
        });
      });
  }
  pageEventOutflow(pageInfo: any) {
    this.getOutflows(
      this.unitId,
      'OUTFLOW',
      pageInfo.pageIndex + 1,
      pageInfo.pageSize
    );
  }
  getOutflows(unitId: string, type: string, page: number, size: number) {
    this.http
      .callService(
        new Method(
          environment.services.inflowsandOutflofList(unitId, type, page, size),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.outflows = res;
        this.outflowResults = this.outflows.results;
        this.outflowResults.forEach((element) => {
          this.setResponsibleUsers(element);
          if (element.id === this.lastCreateMaterial['id']) {
            this.showDetail(element, 'OUTFLOW');
          }
        });
      });
  }
  pageEventInvitedFlow(pageInfo: any) {
    this.getInvitedFlows(pageInfo.pageIndex + 1, pageInfo.pageSize);
  }
  getInvitedFlows(page: number, size: number) {
    this.http
      .callService(
        new Method(environment.services.invitedFlowList(page, size), '', 'get')
      )
      .subscribe((res) => {
        this.invitedFlows = res;
        this.invitedFlows['results'].forEach((element) => {
          this.setResponsibleUsers(element);
          if (element.id === this.lastCreateMaterial['id']) {
            this.showDetail(element, 'OUTFLOW');
          }
        });
      });
  }

  setResponsibleUsers(flowItem: object) {
    flowItem['responsibleUsers'].forEach((user) => {
      if (user.organisation.id === flowItem['buyer'].id) {
        flowItem['responsibleOwnerInitalsFull'] = user.fullName;
        flowItem['responsibleOwnerInitalsEmail'] = user.email;
        flowItem['responsibleOwnerInitals'] = user.fullName
          ? this.getNameInitials(user.fullName)
          : user.email.substring(0, 3);
      } else {
        flowItem['responsibleSupplierInitalsFull'] = user.fullName;
        flowItem['responsibleSupplierInitalsEmail'] = user.email;
        flowItem['responsibleSupplierInitals'] = user.fullName
          ? this.getNameInitials(user.fullName)
          : user.email.substring(0, 3);
      }
    });
  }

  getNameInitials(fullName: string) {
    const a = fullName
      .split(' ')
      .slice(0, -1)
      .join(' ')
      .charAt(0)
      .toUpperCase();
    const b = fullName.split(' ').slice(-1).join(' ').charAt(0).toUpperCase();
    return a + b;
  }

  showDetail(material: any, type: string) {
    this.materiaNavShow = false;
    this.selectedMaterial = material;
    this.selectedMaterial['type'] = type;
    this.commonService.materialType = type;
    this.myOutput.emit(material.id);
    this.activePageDetail = true;
    hidePatica();
  }
  closeDetail() {
    this.activePageDetail = false;
    this.isShowPatica = false;
    this.isHidePatica = false;
    hidePatica();
  }
  openPaticaEvent(data: any) {
    this.isShowPatica = true;
    this.isHidePatica = false;
    this.isInitPatica = true;
    $('.patica-sidebar').addClass('material-page');
    $('.patica-sidebar').css('width', '30%');
    $('.patica-sidebar').css('right', 0);
    $('.patica-sidebar').css('z-index', 1);
    if (data) {
      // tslint:disable-next-line:radix
      goToModulePatica(parseInt(data.path), data.module);
    }
    openPatica();
  }
  closePatica() {
    hidePatica();
    this.isShowPatica = false;
    this.isHidePatica = true;
  }
  styleEvent() {
    this.openPaticaEvent(false);
  }
  flowComplate(value: boolean, flow: string) {
    const data = [{ question: flow, value: value, entityId: this.unitId }];
    if (this.criticalBoxShow && flow === 'CTI_INFLOW_DONE' && value) {
      const dialogRef = this.dialog.open(ReportStatusDialog, {
        width: '80%',
        maxWidth: '430px',
        data: {
          title: `Critical Materials`,
          message:
            'You have selected Optimize the loop in Step 2. Did you add critical materials to your inflow?',
        },
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (!result) {
          this.selectEvent('critical');
          this.getInflows(this.unitId, 'INFLOW', 1, this.size);
        }
        try {
          this.http
            .callService(
              new Method(environment.services.guidance(), data, 'put')
            )
            .subscribe((res) => {
              this.getUnitGuidance(localStorage.getItem('unitId'));
            });
        } catch (error) {}
      });
    } else {
      this.http
        .callService(new Method(environment.services.guidance(), data, 'put'))
        .subscribe((res) => {
          this.getUnitGuidance(localStorage.getItem('unitId'));
        });
    }
  }

  removeMaterial(selectedMaterial: any) {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '80%',
      maxWidth: '430px',
      data: {
        title: `${this.selectedMaterial['tradeName']}`,
        message: ' Are you sure you want to delete this? Please confirm.',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.http
          .callService(
            new Method(
              environment.services.removeMaterial(
                this.unitId,
                this.selectedMaterial['type'],
                this.selectedMaterial['id']
              ),
              '',
              'delete'
            )
          )
          .subscribe((res) => {
            if (this.selectedMaterial['type'] === 'INFLOW') {
              this.getInflows(this.unitId, 'INFLOW', 1, this.size);
            } else {
              this.getOutflows(this.unitId, 'OUTFLOW', 1, this.size);
            }
          });
      } catch (error) {}
    });
  }

  inviteColleague() {
    const dialogRef = this.dialog.open(InviteColleagueDialog, {
      width: '80%',
      maxWidth: '600px',
      data: this.selectedMaterial,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        if (this.selectedMaterial['type'] === 'INFLOW') {
          this.getInflows(this.unitId, 'INFLOW', 1, this.size);
        } else {
          this.getOutflows(this.unitId, 'OUTFLOW', 1, this.size);
        }
      } catch (error) {}
    });
  }

  goToCriticalMaterials() {
    this.router.navigate(['/cti/guide/critical-material']);
  }
}
