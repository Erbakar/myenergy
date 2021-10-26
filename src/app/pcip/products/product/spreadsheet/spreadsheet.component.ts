import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import * as Handsontable from 'handsontable';
import { CommonService } from '@app/core/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../../assets/javascript/patica';
import 'rxjs/add/operator/switchMap';
import { forEach } from 'lodash';
import { SpreadsheetValidator } from './spreadsheet-validation.service';
import { SpreadsheetColoring } from './spreadsheet-coloring.service';
import { HotTableRegisterer } from '@handsontable/angular';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IsReadyConfirmDialog } from '@app/shared/dialog/isReady-confirm-dialog/isReady-confirm-dialog.component';
import { time } from 'console';
declare var $: any;

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: ['./spreadsheet.component.scss'],
})
export class SpreadsheetComponent implements OnInit, OnDestroy {
  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  isShow = false;
  productId;
  productMetaId;
  locker;
  chartData = [];
  tableShow = true;
  columsData;
  sourceDataArray = [];
  resfreshData;
  newRow;
  keyArrray = [];
  lenses;
  selectedLenses = [];
  activeLens;
  selectLens = '?lens=pcr';
  smartTarget = [];
  data;
  tableSettings = {
    rowHeaders: true,
    cellProperties: {},
    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: 'auto',
    fixedColumnsLeft: 1,
    // fixedRowsTop: 2,
    // minSpareRows: 1,
    // nestedRows: true,
    height: `calc(100vh - 220px)`,
    allowInsertColumn: true,
    allowInsertRow: true,
    autoRowSize: { syncLimit: 300 },
    allowRemoveColumn: true,
    allowRemoveRow: true,
    autoWrapRow: true,
    autoWrapCol: true,
    stretchH: 'all',
    width: '100%',
    manualRowResize: true,
    manualColumnResize: true,
    manualRowMove: false,
    manualColumnMove: false,
    contextMenu: true,
    filtersKeyValue: true,
    dropdownMenu: false,
    columns: [],
    afterGetColHeader: {},
    // tslint:disable-next-line:typedef
    afterValidate: function (isValid, value, row, prop) {
      if (prop === 'weight.value' && value > 10) {
        console.log('run');
      }
      // console.log(value, row, prop);
      if (value === false) {
        alert('Invalid');
        (value = isValid),
          (row = 'inserted invalid value'),
          (prop = 'row index changed');
      }
    },
    cell: [],
  };

  constructor(
    private commonService: CommonService,
    public router: Router,
    private route: ActivatedRoute,
    private http: ApiRequestService,
    private snackBar: MatSnackBar,
    private validator: SpreadsheetValidator,
    private coloring: SpreadsheetColoring,
    public dialog: MatDialog
  ) {
    this.commonService.openPatica.subscribe((res) => {
      if (res) {
        $('.patica-sidebar').css('right', 30);
        $('.patica-sidebar').css('top', 168);
        $('.patica-sidebar').css('height', 'calc(100vh - 210px)');
        $('.patica-sidebar').css('z-index', 9999999);
        goToModulePatica(9, '25aeff32335e740d9e86b3d072ccae03');
        openPatica();
      } else {
        hidePatica();
      }
    });

    this.route.params.subscribe((product) => {
      this.productId = product.id;
    });
    this.http
      .callService(new Method(environment.services.lenses(), '', 'get'))
      .subscribe((res) => {
        this.lenses = res;
        this.changeLens('pcr');
      });
  }
  historyBack() {
    this.route.params.subscribe((product) => {
      this.router.navigate([`/products/${product['productId']}`]);
    });
  }
  ngOnDestroy() {
    hidePatica();
  }

  changeLens(lens: string) {
    this.data = null;
    const index = this.selectedLenses.indexOf(lens);
    if (index === -1) {
      this.selectedLenses.push(lens);
    } else {
      this.selectedLenses.splice(index, 1);
    }
    let url = '';
    // tslint:disable-next-line: typedef
    this.selectedLenses.forEach(function (e) {
      url += e + '&lens=';
    });
    const pureUrl = url.slice(0, -6);
    this.activeLens = pureUrl;
    if (this.selectedLenses.length === 0) {
      setTimeout(() => {
        this.changeLens('pcr');
      }, 100);
    }
    if (this.selectedLenses.length > 0) {
      JSON.parse(sessionStorage.getItem('credentials')).roles.forEach(
        (role) => {
          if (role.name.toUpperCase() === 'ANALYST') {
            this.selectLens = '?lens=pcr&lens=pcip';
          }
        }
      );
      this.http
        // .callService(new Method(environment.services.columns(`?lens=${this.activeLens}`), '', 'get'))
        .callService(
          new Method(environment.services.columns(this.selectLens), '', 'get')
        )
        .subscribe((res) => {
          this.columsData = res;
          this.modifyColumData(res);
          if (this.productId !== '0') {
            this.isReadySpreadsheet();
          }
        });
    }
  }

  isReadySpreadsheet() {
    this.http
      .callService(
        new Method(
          environment.services.isReadySpreadsheet(this.productId),
          {},
          'get'
        )
      )
      .subscribe((res) => {
        if (res['ready']) {
          this.snackBar.open('This is the current product', '', {
            duration: 5000,
            panelClass: ['success-snackBar'],
          });
        } else {
          var productTitle = '';
          if (sessionStorage.getItem('selectedProduct')) {
            productTitle = JSON.parse(sessionStorage.getItem('selectedProduct'))
              .displayName;
          }
          const dialogRef = this.dialog.open(IsReadyConfirmDialog, {
            width: '80%',
            maxWidth: '430px',
            data: {
              title: productTitle,
              message: `Product creation in progress…`,
            },
          });
        }
      });
  }

  ngOnInit() {
    if ($('.lock-box').height() < 666) {
      $('.lock-box').css('right', '50px');
    }
  }

  lockEvent(lock: boolean) {
    this.locker = lock;
  }

  modifyColumData(columsData: any) {
    this.tableSettings.columns = [];
    columsData.forEach((colum) => {
      if (colum['source']) {
        const sourceData = colum['source'];
        this.sourceDataArray.push({
          key: colum.data,
          code: colum.code,
          source: sourceData,
          type: colum.type,
        });
        colum['source'] = [];
        sourceData.forEach((source) => {
          colum['source'].push(source.name);
        });
      }
      this.tableSettings.columns.push(colum);
      if (colum.validatePattern) {
        // tslint:disable-next-line:typedef
        colum.validator = function (value, callback) {
          if (value == null || new RegExp(colum.validatePattern).test(value)) {
            callback(true);
          } else {
            callback(false);
          }
        };
      }
      // tslint:disable-next-line:typedef
      this.tableSettings.afterGetColHeader = function (i, TH) {
        if (columsData[i] && columsData[i].helpText) {
          TH.innerHTML = `${columsData[i].title}<div class="column-tooltip"><em class="material-icons">info</em><span>${columsData[i].helpText}</span></div>`;
        }
      };
    });

    if (columsData && this.productId !== '0') {
      this.locker = true;
      this.getData();
    } else {
      this.locker = false;
      this.data = [];
      this.addSpaceRow();
    }
    if (this.isShow === true) {
      this.locker = false;
    }
  }

  colorTable() {
    setTimeout(() => {
      const hot = this.hotRegisterer.getInstance(this.id);
      this.coloring.colorTable(
        this.validator.filledRowCount(hot) + 1,
        hot,
        this.tableSettings.columns
      );
      hot.render();
    }, 10);
  }

  addSpaceRow() {
    setTimeout(() => {
      const hot = this.hotRegisterer.getInstance(this.id);
      const existingRows = this.data.length;
      hot.alter('insert_row', existingRows, 16 - existingRows);
      this.colorTable();
    }, 10);
  }

  getData() {
    this.http
      .callService(
        new Method(
          environment.services.getSpreadsheet(this.productId),
          '',
          'get'
        )
      )
      .subscribe((resData) => {
        this.productMetaId = resData['product_meta_uuid'];
        if (resData['rows']) {
          this.addPropertyForRow(
            resData['rows'].sort((n1, n2) => n1.row_number - n2.row_number)
          );
        }
      });
  }

  addPropertyForRow(rows: any) {
    this.data = [];
    let rowCount = 0;
    let rowIndex = 0;

    //if (rows[0]['row_entity_uuid']) {
    //  this.ecoCost(rows[0]['row_entity_uuid']);
    //}
    rowCount = rows.length;
    rows.forEach((element) => {
      for (const [key, value] of Object.entries(element.columns)) {
        const targetColum = this.sourceDataArray.filter(
          (colum) => colum.code === key
        );
        if (targetColum.length > 0) {
          const nameValue = targetColum[0]['source'].filter(
            (soruce) => soruce.value === value['value']
          );
          if (nameValue[0]) {
            element.columns[key] = { value: nameValue[0]['name'] };
          }
        }
      }
      const item = element.columns;
      item['entity_uuid'] = element['entity_uuid'];
      this.data.push(item);
      rowIndex++;
    });
    this.addSpaceRow();
  }

  ecoCost(id: string) {
    this.chartData = [];
    this.http
      .callService(new Method(environment.services.ecocost(id), '', 'get'))
      .subscribe((res) => {
        for (const [key, value] of Object.entries(res)) {
          this.chartData.push({ name: key, value: value });
        }
      });
  }

  beforeChanges = (changes) => {
    if (changes) {
      const hot = this.hotRegisterer.getInstance(this.id);
      for (let i = 0; i < changes.length; i++) {
        changes[i] = this.validator.correctTierData(changes[i]);
      }
    }
  };

  detectChanges = (changes) => {
    if (changes) {
      const hot = this.hotRegisterer.getInstance(this.id);
      changes.forEach(([index, prop, oldValue, newValue]) => {
        if (!this.validator.validateSingleTier(this.data[index])) {
          this.snackBar.open('select only one tier', '', {
            duration: 5000,
            panelClass: ['error-snackBar'],
          });
        }
      });
      this.colorTable();
    }
  };

  saveSpredSheet() {
    const hot = this.hotRegisterer.getInstance(this.id);
    try {
      this.validator.validateTable(hot);
    } catch (e) {
      this.snackBar.open(e, '', {
        duration: 5000,
        panelClass: ['error-snackBar'],
      });
      return;
    }
    const reqData = {
      spreadsheet_uuid: this.productId,
      product_meta_uuid: this.productMetaId,
      type: 'PRODUCT',
      rows: [],
    };

    const allowed = this.columsData.map((colum) => colum.code);
    allowed.push('M19');
    allowed.push('entity_uuid');
    allowed.push('row_uuid');
    const totalRow = this.validator.filledRowCount(hot);
    this.data.forEach((element, index) => {
      if (index <= totalRow) {
        const filtered = Object.keys(element)
          .filter((key) => allowed.includes(key))
          .reduce((obj, key) => {
            obj[key] = element[key];
            return obj;
          }, {});
        const item = {
          row_number: index + 1,
          columns: filtered,
        };
        reqData.rows.push(item);
      }
      reqData.rows.forEach((row, i) => {
        for (const [key, value] of Object.entries(row.columns)) {
          const targetColum = this.sourceDataArray.filter(
            (colum) => colum.code === key
          );
          if (targetColum.length > 0) {
            const newValue = targetColum[0]['source'].filter(
              (soruce) => soruce['name'] === value['value']
            );
            if (newValue[0]) {
              row.columns[key] = { value: newValue[0]['value'] };
            }
          }
        }
      });
    });
    if (this.productId === '0') {
      delete reqData.spreadsheet_uuid;
      this.http
        .callService(
          new Method(environment.services.spreadsheetCreate(), reqData, 'post')
        )
        .subscribe((res) => {
          if (res) {
            this.locker = true;
            this.productId = res;
            this.router.navigate([`/products/spreadsheet/${res}`]);
          }
        });
    } else {
      delete reqData.type;
      this.http
        .callService(
          new Method(environment.services.spreadsheetCreate(), reqData, 'put')
        )
        .subscribe((res) => {
          this.locker = true;
        });
    }
    this.isShow = true;
    this.changeLens(this.activeLens);
  }

  publishSpredSheet() {
    this.locker = true;
    this.http
      .callService(
        new Method(
          environment.services.publishSpreasheet(this.productId),
          {},
          'put'
        )
      )
      .subscribe((res) => {
        this.snackBar.open('Product published successfully', '', {
          duration: 5000,
          panelClass: ['success-snackBar'],
        });
      });
  }

  newSpredSheet(row: any, index: number) {
    const reqData = {
      type: 'PRODUCT',
      rows: [
        {
          row_number: index,
          columns: row,
        },
      ],
    };
    this.http
      .callService(
        new Method(environment.services.spreadsheetCreate(), reqData, 'post')
      )
      .subscribe((res) => {
        if (res) {
          this.productId = res;
          this.router.navigate([`/products/spreadsheet/${res}`]);
          this.ngOnInit();
        }
      });
  }

  editRow(row: any, index: number) {
    const id = row['row_uuid'].value;
    const entity_uuid = row['entity_uuid'];
    delete row['row_uuid'];
    delete row['entity_uuid'];
    const reqData = {
      columns: row,
      row_uuid: id,
      entity_uuid,
    };
    this.http
      .callService(
        new Method(environment.services.spreadsheetRowEdit(), reqData, 'put')
      )
      .subscribe((res) => {
        row['row_uuid'] = { value: id };
        row['entity_uuid'] = entity_uuid;
        if (this.resfreshData) {
          this.newRow = false;
          this.ngOnInit();
          this.columsData.forEach((colum, i) => {
            if (
              colum['code'] === 'T1' ||
              colum['code'] === 'T2' ||
              colum['code'] === 'T3' ||
              colum['code'] === 'T4'
            ) {
              this.tableSettings.cell.push({
                row: index,
                col: i,
                readOnly: true,
                className: 'readonly',
              });
            }
          });
        }
      });
  }
  insertingNewRow(row: any, index: number) {
    const reqData = {
      columns: row,
      row_number: index,
    };
    this.http
      .callService(
        new Method(
          environment.services.spreadsheetInsertingNewRow(this.productId),
          reqData,
          'post'
        )
      )
      .subscribe((res) => {
        this.newRow = true;
        this.ngOnInit();
        this.columsData.forEach((colum, i) => {
          if (
            colum['code'] === 'T1' ||
            colum['code'] === 'T2' ||
            colum['code'] === 'T3' ||
            colum['code'] === 'T4'
          ) {
            this.tableSettings.cell.push({
              row: index,
              col: i,
              readOnly: false,
              className: 'readonly-delete',
            });
          }
        });
      });
  }
}
