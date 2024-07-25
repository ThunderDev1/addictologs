export type Dose = {
  timestamp: number;
  amount: number;
};

export type Addiction = {
  id: string;
  name: string;
  displayPref: DisplayPref;
  doses: Dose[];
};

export enum DisplayPref {
  Hour,
  Day,
  Week,
  Month,
  Year,
}
