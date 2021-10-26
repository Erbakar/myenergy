import { Injectable } from '@angular/core';

export class Rule {
  sourceCode: String;
  sourceValue: String;
  targetCodes: Array<String>;
  targetStyle: String;
  constructor(
    _sourceCode: string,
    _sourceValue: String,
    _targetCodes: Array<String>,
    _targetStyle: String
  ) {
    this.sourceCode = _sourceCode;
    this.sourceValue = _sourceValue;
    this.targetCodes = _targetCodes;
    this.targetStyle = _targetStyle;
  }
}
@Injectable()
export class SpreadsheetColoring {
  private rules: Array<Rule> = [
    new Rule(null, null, [], ''),
    new Rule('M8', 'Yes', [], 'Yes'),
    new Rule('M8', 'No', [], 'No'),
    new Rule(
      'M8',
      'Yes',
      ['M12C', 'M29', 'M33', 'M32', 'IDE2', 'IDE2A', 'IDE3', 'IDE3A'],
      'inactive'
    ),
    new Rule(
      'M8',
      'No',
      [
        'M26A',
        'M26',
        'M25',
        'M25B',
        'M28',
        'M24',
        'IDE1',
        'IDE2',
        'IDE2A',
        'IDE3',
        'IDE3A',
        'IDE4',
        'IDE5',
      ],
      'inactive'
    ),
    new Rule('M8', null, ['M8'], 'mandatory'),
    new Rule('M18', null, ['M18'], 'mandatory'),
    new Rule('M17B', null, ['M17B'], 'mandatory'),
  ];

  private topRules: Array<Rule> = [
    new Rule(null, null, [], 'firstrow'),
    new Rule(
      null,
      null,
      [
        'T1',
        'T2',
        'T3',
        'T4',
        'M8',
        'M12C',
        'M26A',
        'M26',
        'M25',
        'M25B',
        'M28',
        'M24',
        'IDE1',
        'IDE4',
        'IDE5',
      ],
      'inactive'
    ),
    new Rule('M18', null, ['M18'], 'mandatory'),
    new Rule('M17B', null, ['M17B'], 'mandatory'),
  ];

  private applyRule(rule, headers, row, hot) {
    if (rule.targetCodes.length == 0) {
      //apply to all rows
      for (var index = 0; index < headers.length; index++) {
        hot.setCellMeta(row, index, 'className', rule.targetStyle);
      }
    } else {
      rule.targetCodes.forEach((code) => {
        let columnIndex = headers.findIndex((x) => x.code === code);
        if (columnIndex > -1) {
          hot.setCellMeta(row, columnIndex, 'className', rule.targetStyle);
        }
      });
    }
  }

  colorRow(row, hot, headers, targetValue, prop) {
    var _rules = this.rules;
    if (row == 0) {
      _rules = this.topRules;
    }
    //apply rules to the row one by one
    _rules.forEach((rule) => {
      if (rule.sourceCode == null) {
        this.applyRule(rule, headers, row, hot);
      } else {
        if (rule.sourceCode + '.value' == prop) {
          //Updated column has a rule. Apply that
          if (rule.sourceValue == targetValue) {
            this.applyRule(rule, headers, row, hot);
          }
        } else {
          //Updated column doesn't hit the rule. Check others
          let cellData = hot.getDataAtCell(
            row,
            hot.propToCol(rule.sourceCode + '.value')
          );
          if (cellData == rule.sourceValue) {
            //existing cell hits rule
            this.applyRule(rule, headers, row, hot);
          }
        }
      }
    });
  }

  colorTable(rowCount, hot, headers) {
    for (var i = 0; i < rowCount; i++) {
      this.colorRow(i, hot, headers, null, null);
    }
    var totalRows = hot.countRows();
    var totalColumns = hot.countCols();
    for (var row_i = rowCount; row_i < totalRows; row_i++) {
      for (var col_i = 0; col_i < totalColumns; col_i++) {
        hot.setCellMeta(row_i, col_i, 'className', null);
      }
    }
  }
}
