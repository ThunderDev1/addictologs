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
  Day = 0,
  Week = 1,
  Month = 2,
  Year = 3,
}

export const periodDaysMap = {
  [DisplayPref.Day]: 1,
  [DisplayPref.Week]: 7,
  [DisplayPref.Month]: 30,
  [DisplayPref.Year]: 365,
};
