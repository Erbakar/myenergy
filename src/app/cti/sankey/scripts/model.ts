import { DataInterface } from './data.interface';

export class Model {
  constructor(public data: DataInterface) {}
  public getLeftEntitiesPercents = () => {
    const percents: number[] = [];
    this.data.entities.input.forEach((input) => percents.push(input.percent));
    return percents;
  };
  public getRightEntitiesPercents = () => {
    const percents: number[] = [];
    this.data.entities.output.forEach((output) =>
      percents.push(output.percent)
    );
    return percents;
  };
  public getResultPercent = (from: number, to: number): number => {
    return this.data.entities.input[from].resultPercents[to];
  };
  public getLeftEntityName = (key: number): string => {
    return this.data.entities.input[key].name;
  };
  public getLeftEntitySubTitle = (key: number): string => {
    return this.data.entities.input[key].subTitle;
  };
  public getRightEntityName = (key: number): string => {
    return this.data.entities.output[key].name;
  };
  public getRightEntitySubTitle = (key: number): string => {
    return this.data.entities.output[key].subTitle;
  };
  public getInnerRectTexts = (): string[] => {
    return [
      this.data.phrases.lowerRectBottom1,
      this.data.phrases.lowerRectBottom2,
      this.data.phrases.lowerRectBottom3,
    ];
  };
  public getRightPhrase = (): string => {
    return this.data.phrases.lowerLineRight;
  };
  public getLeftEntityColor = (key: number): string => {
    return this.data.entities.input[key].color;
  };
  public getLeftEntityNameColor = (key: number): string => {
    return this.data.entities.input[key].nameColor;
  };
  public getLeftEntitySubTitleColor = (key: number): string => {
    return this.data.entities.input[key].subTitleColor;
  };
  public getLeftEntityDiagonalLinesColorColor = (key: number): string => {
    return this.data.entities.input[key].diagonalLinesColor;
  };
  public getRightEntityColor = (key: number): string => {
    return this.data.entities.output[key].color;
  };
  public getRightEntityNameColor = (key: number): string => {
    return this.data.entities.output[key].nameColor;
  };
  public getRightEntitySubTitleColor = (key: number): string => {
    return this.data.entities.output[key].subTitleColor;
  };
}
