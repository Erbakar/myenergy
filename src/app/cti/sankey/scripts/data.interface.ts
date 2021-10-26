export interface DataInterface {
  entities: {
    input: Array<{
      name: string;
      percent: number;
      subTitle: string;
      resultPercents: number[];
      color: string;
      nameColor: string;
      subTitleColor: string;
      diagonalLinesColor: string;
    }>;
    output: Array<{
      name: string;
      percent: number;
      subTitle: string;
      color: string;
      nameColor: string;
      subTitleColor: string;
    }>;
  };
  phrases: { [key: string]: string };
}
