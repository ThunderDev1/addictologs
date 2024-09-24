import dayjs from "dayjs";
import { Dose } from "./types/counter";

export const generateDoses = () => {
  const doses: Dose[] = [];

  for (let i = 1; i < 8000; i++) {
    const ts = dayjs().subtract(
      45 * i + Math.round(Math.random() * 30),
      "minute"
    );

    if (ts.hour() > 10 || ts.hour() < 4) {
      doses.push({
        amount: 1,
        timestamp: ts.valueOf(),
      });
    } else {
      doses.push({
        amount: 0,
        timestamp: ts.valueOf(),
      });
    }
  }
  return doses;
};
