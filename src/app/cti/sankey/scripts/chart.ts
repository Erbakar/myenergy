import * as d3 from 'd3';
import { Model } from './model';

export interface Line {
  width: number;
  line: number[][];
  id: number;
  name: string;
  subTitle: string;
  marker: boolean;
  color: string;
  nameColor: string;
  subTitleColor: string;
}

export class Chart {
  private lowerRectHeight: number;

  constructor(
    private model: Model,
    private width: number,
    private height: number
  ) {
    // tslint:disable-next-line:no-bitwise
    this.lowerRectHeight = ~~((this.height * 50) / 100);
  }
  public getRightPhrase = () => {
    return {
      text: this.model.getRightPhrase(),
      x: this.width + (this.width * 1) / 100,
      y: (this.height * 90) / 100,
    };
  };
  public getInnerRectTexts = (): any => {
    return this.model.getInnerRectTexts().map((t, i) => ({
      text: t,
      x: (this.width * (i * 15 + 30)) / 100,
      y: this.height + (this.height * 5) / 100,
    }));
  };
  public getInnerRectPoints = (): number[][] => {
    const innerRectWidth = (this.width * 40) / 100;
    // tslint:disable-next-line:no-bitwise
    const x1 = ~~((this.width - innerRectWidth) / 2);
    const x2 = Math.ceil((this.width - innerRectWidth) / 2 + innerRectWidth);
    const y1 = this.height - this.lowerRectHeight - 3;
    const y2 = this.height - 1;
    return [
      [x1, y1],
      [x1, y2],
      [x2, y2],
      [x2, y1],
    ];
  };

  public getMarkerWidth = () => {
    // tslint:disable-next-line:no-bitwise
    return ~~((this.width * 5) / 100);
  };
  public getInnerRectBigLineWidth = () => {
    // tslint:disable-next-line:no-bitwise
    return ~~((this.width * 10) / 100);
  };
  public getMiddleLineDiversion = () => {
    return (this.width * 15) / 100;
  };
  public getLeftInnerPoints = (): number[][] => {
    const x = this.getLeftInnerX();
    return this.getLeftInnerYs().map((y) => [x, y]);
  };
  public getLeftInnerPointsForLinks = (): number[][] => {
    const x =
      this.getLeftInnerX() +
      this.getInnerRectBigLineWidth() +
      this.getMarkerWidth() +
      1;
    return this.getLeftInnerYs().map((y) => [x, y]);
  };
  public getLeftOuterTopPoint = () => {
    const firstLeftLineWidth =
      (this.model.getLeftEntitiesPercents()[0] * this.lowerRectHeight) / 100;
    return [firstLeftLineWidth / 2, 0];
  };
  public getLeftOuterBottomPoint = () => {
    const percents = this.model.getLeftEntitiesPercents();
    const lastLeftLineWidth =
      (percents[percents.length - 1] * this.lowerRectHeight) / 100;
    return [0, this.height - lastLeftLineWidth / 2 - 1];
  };
  public getLeftOuterMiddlePoint = () => {
    const percents = this.model.getLeftEntitiesPercents();
    const lastLeftLineWidth = (percents[1] * this.lowerRectHeight) / 100;
    return [
      -this.getMiddleLineDiversion(),
      (this.height - lastLeftLineWidth) / 2,
    ];
  };
  public getRightInnerPoints = () => {
    const x = this.getRightInnerX();
    return this.getRightInnerYs().map((y) => [x, y]);
  };
  public getRightOuterTopPoint = () => {
    const firstRightLineWidth =
      (this.model.getRightEntitiesPercents()[0] * this.lowerRectHeight) / 100;
    return [this.width - firstRightLineWidth / 2, 0];
  };
  public getRightOuterBottomPoint = () => {
    const percents = this.model.getRightEntitiesPercents();
    const lastRightLineWidth =
      (percents[percents.length - 1] * this.lowerRectHeight) / 100;
    return [this.width, this.height - lastRightLineWidth / 2 - 1];
  };
  public getRightOuterMiddlePoint = () => {
    const percents = this.model.getRightEntitiesPercents();
    const lastRightLineWidth =
      (percents[percents.length - 1] * this.lowerRectHeight) / 100;
    const firstRightLineWidth = (percents[0] * this.lowerRectHeight) / 100;
    const middleRightLineWidth = (percents[1] * this.lowerRectHeight) / 100;
    return [
      this.width - this.getMiddleLineDiversion() / 3,
      this.height -
        middleRightLineWidth / 2 -
        lastRightLineWidth -
        3 -
        middleRightLineWidth / 6,
    ];
  };

  public getLines = (): Array<Line> => {
    const lines: Array<Line> = [];
    const leftInnerPoints = this.getLeftInnerPoints();
    lines.push(this.getLeftTopLine());
    lines.push(this.getLeftBottomLine());
    if (leftInnerPoints.length === 3) {
      lines.push(this.getLeftMiddleLine());
    }
    lines.push(this.getLeftTopLineInnerRect());
    lines.push(this.getLeftBottomLineInnerRect());
    if (leftInnerPoints.length === 3) {
      lines.push(this.getLeftMiddleLineInnerRect());
    }
    const rightInnerPoints = this.getRightInnerPoints();
    lines.push(this.getRightTopLine());
    lines.push(this.getRightBottomLine());
    if (rightInnerPoints.length === 3) {
      lines.push(this.getRightMiddleLine());
    }
    lines.push(this.getRightTopLineInnerRect());
    lines.push(this.getRightBottomLineInnerRect());
    if (rightInnerPoints.length === 3) {
      lines.push(this.getRightMiddleLineInnerRect());
    }
    return lines;
  };

  public getDiagonalData = (): Array<{
    source: { x: number; y: number };
    target: { x: number; y: number };
    percent: number;
    color: string;
    id: string;
  }> => {
    const init: Array<{
      source: { x: number; y: number };
      target: { x: number; y: number };
      percent: number;
      color: string;
      id: string;
    }> = [];
    const leftInnerPoints = this.getLeftInnerPoints();
    return leftInnerPoints.reduce(
      (acc, p1, j) =>
        acc.concat(
          this.getRightInnerPoints().map((p2, i) => {
            const rightWidth =
              (this.model.getRightEntitiesPercents()[i] *
                this.lowerRectHeight) /
              100;
            const markerDistance =
              (rightWidth / (leftInnerPoints.length + 1)) * (j + 1);
            const y2 = p2[1] - rightWidth / 2 + markerDistance;
            return {
              source: {
                x:
                  p1[0] +
                  this.getInnerRectBigLineWidth() +
                  this.getMarkerWidth() +
                  1,
                y: p1[1],
              },
              target: { x: p2[0] - this.getInnerRectBigLineWidth(), y: y2 },
              percent: this.model.getResultPercent(j, i),
              color: this.model.getLeftEntityDiagonalLinesColorColor(j),
              id: i + '_' + j,
            };
          })
        ),
      init
    );
  };

  private getInnerYs = (percents: number[]): number[] => {
    const innerYs: number[] = [];
    let acc = 1;
    percents.reverse().forEach((percent) => {
      const h = (percent / 100) * this.lowerRectHeight;
      innerYs.push(this.height - acc - h / 2);
      acc += h + 2;
    });
    return innerYs.reverse();
  };

  private getLeftInnerYs = (): number[] => {
    const percents: number[] = this.model.getLeftEntitiesPercents();
    return this.getInnerYs(percents);
  };
  private getLeftInnerX = () => {
    // tslint:disable-next-line:no-bitwise
    return ~~((this.width * 30) / 100);
  };

  private getRightInnerYs = (): number[] => {
    const percents: number[] = this.model.getRightEntitiesPercents();
    return this.getInnerYs(percents);
  };
  private getRightInnerX = () => {
    return Math.ceil((this.width * 70) / 100);
  };

  private getLeftTopLine = (): Line => {
    const leftInnerPoints = this.getLeftInnerPoints();
    return {
      line: [
        this.getLeftOuterTopPoint(),
        [this.getLeftOuterTopPoint()[0], leftInnerPoints[0][1]],
        leftInnerPoints[0],
      ],
      width:
        (this.model.getLeftEntitiesPercents()[0] * this.lowerRectHeight) / 100,
      id: 1,
      name: this.model.getLeftEntityName(0),
      subTitle: this.model.getLeftEntitySubTitle(0),
      marker: false,
      color: this.model.getLeftEntityColor(0),
      nameColor: this.model.getLeftEntityNameColor(0),
      subTitleColor: this.model.getLeftEntitySubTitleColor(0),
    };
  };
  private getLeftMiddleLine = (): Line => {
    const leftInnerPoints = this.getLeftInnerPoints();
    if (leftInnerPoints.length === 3) {
      const p = leftInnerPoints[1];
      return {
        line: [
          this.getLeftOuterMiddlePoint(),
          [
            this.getLeftOuterMiddlePoint()[0] + this.getMiddleLineDiversion(),
            p[1],
          ],
          p,
        ],
        width:
          (this.model.getLeftEntitiesPercents()[1] * this.lowerRectHeight) /
          100,
        id: 2,
        name: this.model.getLeftEntityName(1),
        subTitle: this.model.getLeftEntitySubTitle(1),
        marker: false,
        color: this.model.getLeftEntityColor(1),
        nameColor: this.model.getLeftEntityNameColor(1),
        subTitleColor: this.model.getLeftEntitySubTitleColor(1),
      };
    } else {
      return null;
    }
  };
  private getLeftBottomLine = (): Line => {
    const leftInnerPoints = this.getLeftInnerPoints();
    const key = leftInnerPoints.length - 1;
    return {
      line: [
        this.getLeftOuterBottomPoint(),
        this.getLeftOuterBottomPoint(),
        leftInnerPoints[leftInnerPoints.length - 1],
      ],
      width:
        (this.model.getLeftEntitiesPercents()[key] * this.lowerRectHeight) /
        100,
      id: 3,
      name: this.model.getLeftEntityName(key),
      subTitle: this.model.getLeftEntitySubTitle(key),
      marker: false,
      color: this.model.getLeftEntityColor(key),
      nameColor: this.model.getLeftEntityNameColor(key),
      subTitleColor: this.model.getLeftEntitySubTitleColor(key),
    };
  };
  private getLeftTopLineInnerRect = (): Line => {
    const leftInnerPoints = this.getLeftInnerPoints();
    const p = leftInnerPoints[0];
    return {
      line: [p, p, [p[0] + this.getInnerRectBigLineWidth(), p[1]]],
      width:
        (this.model.getLeftEntitiesPercents()[0] * this.lowerRectHeight) / 100,
      id: 4,
      name: '',
      subTitle: '',
      marker: true,
      color: this.model.getLeftEntityColor(0),
      nameColor: this.model.getLeftEntityNameColor(0),
      subTitleColor: this.model.getLeftEntitySubTitleColor(0),
    };
  };
  private getLeftMiddleLineInnerRect = (): Line => {
    const leftInnerPoints = this.getLeftInnerPoints();
    if (leftInnerPoints.length === 3) {
      const p = leftInnerPoints[1];
      return {
        line: [p, p, [p[0] + this.getInnerRectBigLineWidth(), p[1]]],
        width:
          (this.model.getLeftEntitiesPercents()[1] * this.lowerRectHeight) /
          100,
        id: 5,
        name: '',
        subTitle: '',
        marker: true,
        color: this.model.getLeftEntityColor(1),
        nameColor: this.model.getLeftEntityNameColor(1),
        subTitleColor: this.model.getLeftEntitySubTitleColor(1),
      };
    } else {
      return null;
    }
  };
  private getLeftBottomLineInnerRect = (): Line => {
    const leftInnerPoints = this.getLeftInnerPoints();
    const key = leftInnerPoints.length - 1;
    const p = leftInnerPoints[key];
    return {
      line: [p, p, [p[0] + this.getInnerRectBigLineWidth(), p[1]]],
      width:
        (this.model.getLeftEntitiesPercents()[key] * this.lowerRectHeight) /
        100,
      id: 6,
      name: '',
      subTitle: '',
      marker: true,
      color: this.model.getLeftEntityColor(key),
      nameColor: this.model.getLeftEntityNameColor(key),
      subTitleColor: this.model.getLeftEntitySubTitleColor(key),
    };
  };

  private getRightTopLine = (): Line => {
    const rightInnerPoints = this.getRightInnerPoints();
    return {
      line: [
        rightInnerPoints[0],
        [this.getRightOuterTopPoint()[0], rightInnerPoints[0][1]],
        [
          this.getRightOuterTopPoint()[0],
          this.getRightOuterTopPoint()[1] + this.getMarkerWidth(),
        ],
      ],
      width:
        (this.model.getRightEntitiesPercents()[0] * this.lowerRectHeight) / 100,
      id: 7,
      name: this.model.getRightEntityName(0),
      subTitle: this.model.getRightEntitySubTitle(0),
      marker: true,
      color: this.model.getRightEntityColor(0),
      nameColor: this.model.getRightEntityNameColor(0),
      subTitleColor: this.model.getRightEntitySubTitleColor(0),
    };
  };
  private getRightMiddleLine = (): Line => {
    if (this.getRightInnerPoints().length === 3) {
      const p = this.getRightInnerPoints()[1];
      const p2 = this.getRightOuterMiddlePoint();
      return {
        line: [p, [this.width - this.getMiddleLineDiversion(), p[1]], p2],
        width:
          (this.model.getRightEntitiesPercents()[1] * this.lowerRectHeight) /
          100,
        name: this.model.getRightEntityName(1),
        subTitle: this.model.getRightEntitySubTitle(1),
        id: 8,
        marker: true,
        color: this.model.getRightEntityColor(1),
        nameColor: this.model.getRightEntityNameColor(1),
        subTitleColor: this.model.getRightEntitySubTitleColor(1),
      };
    } else {
      return null;
    }
  };
  private getRightBottomLine = (): Line => {
    const rightInnerPoints = this.getRightInnerPoints();
    const key = rightInnerPoints.length - 1;
    return {
      line: [
        rightInnerPoints[key],
        [
          this.getRightOuterBottomPoint()[0] - this.getMarkerWidth(),
          this.getRightOuterBottomPoint()[1],
        ],
        [
          this.getRightOuterBottomPoint()[0] - this.getMarkerWidth(),
          this.getRightOuterBottomPoint()[1],
        ],
      ],
      width:
        (this.model.getRightEntitiesPercents()[key] * this.lowerRectHeight) /
        100,
      id: 9,
      name: this.model.getRightEntityName(key),
      subTitle: this.model.getRightEntitySubTitle(key),
      marker: true,
      color: this.model.getRightEntityColor(key),
      nameColor: this.model.getRightEntityNameColor(key),
      subTitleColor: this.model.getRightEntitySubTitleColor(key),
    };
  };
  private getRightTopLineInnerRect = (): Line => {
    const rightInnerPoints = this.getRightInnerPoints();
    const p = rightInnerPoints[0];
    return {
      line: [[p[0] - this.getInnerRectBigLineWidth(), p[1]], p, p],
      width:
        (this.model.getRightEntitiesPercents()[0] * this.lowerRectHeight) / 100,
      id: 10,
      name: '',
      subTitle: '',
      marker: false,
      color: this.model.getRightEntityColor(0),
      nameColor: this.model.getRightEntityNameColor(0),
      subTitleColor: this.model.getRightEntitySubTitleColor(0),
    };
  };
  private getRightMiddleLineInnerRect = (): Line => {
    const rightInnerPoints = this.getRightInnerPoints();
    const p = rightInnerPoints[1];
    if (rightInnerPoints.length === 3) {
      return {
        line: [[p[0] - this.getInnerRectBigLineWidth(), p[1]], p, p],
        width:
          (this.model.getRightEntitiesPercents()[1] * this.lowerRectHeight) /
          100,
        id: 11,
        name: '',
        subTitle: '',
        marker: false,
        color: this.model.getRightEntityColor(1),
        nameColor: this.model.getRightEntityNameColor(1),
        subTitleColor: this.model.getRightEntitySubTitleColor(1),
      };
    } else {
      return null;
    }
  };
  private getRightBottomLineInnerRect = (): Line => {
    const rightInnerPoints = this.getRightInnerPoints();
    const key = rightInnerPoints.length - 1;
    const p = rightInnerPoints[key];
    return {
      line: [[p[0] - this.getInnerRectBigLineWidth(), p[1]], p, p],
      width:
        (this.model.getRightEntitiesPercents()[key] * this.lowerRectHeight) /
        100,
      id: 12,
      name: '',
      subTitle: '',
      marker: false,
      color: this.model.getRightEntityColor(key),
      nameColor: this.model.getRightEntityNameColor(key),
      subTitleColor: this.model.getRightEntitySubTitleColor(key),
    };
  };
}
