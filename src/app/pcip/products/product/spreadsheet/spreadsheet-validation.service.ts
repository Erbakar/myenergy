import { Injectable } from '@angular/core';

@Injectable()
export class SpreadsheetValidator {
  private tierCodes = ['T1', 'T2', 'T3', 'T4'];

  validateSingleTier(row) {
    const valueGetter = this.getValueFromRow(row);
    return (
      ['T1', 'T2', 'T3', 'T4'].map(valueGetter).filter((v) => {
        return v === 'true' || v === true;
      }).length < 2
    );
  }

  correctTierData(changeData) {
    if (this.isTierData(changeData[1])) {
      if (this.isTrue(changeData[3])) {
        changeData[3] = true;
      } else {
        changeData[3] = null;
      }
    }
    return changeData;
  }

  private isTierData(prop) {
    return this.tierCodes.map((v) => v + '.value').indexOf(prop) > -1;
  }

  private isTrue(value) {
    return (
      ['True', 'TRUE', 'true', 'yes', 'YES', 'Yes', true].filter(
        (v) => v === value
      ).length == 1
    );
  }

  private true1(value): number {
    if (value) {
      return 1;
    }
    return 0;
  }

  private getValueFromRow(row) {
    const _row = row;
    return function (code) {
      if (_row[code]) {
        return _row[code].value;
      }
    };
  }

  filledRowCount(hot) {
    var totalRows = hot.countRows();
    var validRow = 0;
    for (var row_i = 0; row_i < totalRows; row_i++) {
      if (!this.isRowEmpty(hot, row_i)) {
        validRow = row_i;
      }
    }
    return validRow;
  }

  isRowEmpty(hot, row) {
    var columns = hot.countCols();
    for (var i = 0; i < columns; i++) {
      let val = hot.getDataAtCell(row, i);
      if (this.hasData(val)) {
        return false;
      }
    }
    return true;
  }

  private hasData(cellValue) {
    if (cellValue == null) {
      return false;
    }
    if (/^ *$/.test(cellValue)) {
      //string contains 0+ spaces only
      return false;
    }
    return true;
  }

  validateTable(hot) {
    let topTier = this.getTierValue(hot, 0);
    if (topTier != 0) {
      throw 'Row 0: Top product should be tier 0.';
    }
    let totalRow = this.filledRowCount(hot);
    for (var rowIndex = 1; rowIndex < totalRow + 1; rowIndex++) {
      let prevTier = this.getTierValue(hot, rowIndex - 1);
      let currTier = this.getTierValue(hot, rowIndex);
      if (currTier == 0) {
        throw 'Row ' + (rowIndex + 1) + ': Only top product can be tier 0.';
      }
      if (currTier == -1) {
        throw 'Row ' + (rowIndex + 1) + ': Invalid tier selection.';
      }
      if (currTier - prevTier > 1) {
        throw 'Row ' + (rowIndex + 1) + ': Missing tier on row.';
      }
      if (!this.hasData(this.getCellValue(hot, rowIndex)('M18'))) {
        throw (
          'Row ' + (rowIndex + 1) + ': Product name answer can not be empty.'
        );
      }
      if (!this.hasData(this.getCellValue(hot, rowIndex)('M17B'))) {
        throw (
          'Row ' + (rowIndex + 1) + ': Product weight answer can not be empty.'
        );
      }
      if (!this.hasData(this.getCellValue(hot, rowIndex)('M8'))) {
        throw (
          'Row ' +
          (rowIndex + 1) +
          ': Generic material answer can not be empty.'
        );
      }
      let prevMaterial = this.getCellValue(hot, rowIndex - 1)('M8');
      if (currTier > prevTier && prevMaterial == 'Yes') {
        throw 'Row ' + (rowIndex + 1) + ': Materials can not have sub items.';
      }
    }
  }

  private getCellValue(hot, row) {
    return (code) => {
      return hot.getDataAtCell(row, hot.propToCol(code + '.value'));
    };
  }

  //-1 if not valid
  private getTierValue(hot, row) {
    let binaryTiers = this.tierCodes
      .map(this.getCellValue(hot, row))
      .map(this.isTrue)
      .map(this.true1);
    let count = binaryTiers.reduce((a, b) => a + b);
    if (count > 1) {
      return -1;
    }
    return binaryTiers.reduce((a, b, c) => a + b * (c + 1));
  }
}
