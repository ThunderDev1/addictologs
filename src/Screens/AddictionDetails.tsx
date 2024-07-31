import { useFocusEffect } from "@react-navigation/native";
import { Button, ButtonGroup, Divider, Input, Text } from "@rneui/base";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useMMKVArray } from "../hooks/useMMKVArray";
import { storage } from "../mmkv";
import { Addiction, DisplayPref, Dose } from "../types/counter";

const getDoses = () => {
  const doses: Dose[] = [];

  for (let i = 1; i < 8000; i++) {
    const ts = dayjs().subtract(
      45 * i + Math.round(Math.random() * 30),
      "minute"
    );

    // doses.push({
    //   amount: 0,
    //   timestamp: ts.valueOf(),
    // });

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

const windowWidth = Dimensions.get("window").width;

type DataItem = {
  value: number;
  label: string;
};

const AddictionDetails = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [addiction, setAddiction] = useState<Addiction>();
  const [doses, setDoses] = useState<Dose[]>();

  const [data, setData] = useState<DataItem[]>();

  const deleteAddiction = (id: string) => {
    const addictionsString = storage.getString("addictions");
    if (addictionsString) {
      const storedAddictions = JSON.parse(addictionsString) as Addiction[];
      const addictionIndex = storedAddictions.findIndex((a) => a.id == id);
      storedAddictions.splice(addictionIndex, 1);
      storage.set("addictions", JSON.stringify(storedAddictions));
    }
  };

  useFocusEffect(
    useCallback(() => {
      setDoses(getDoses().reverse());

      const addictionsString = storage.getString("addictions");
      if (addictionsString) {
        const storedAddictions = JSON.parse(addictionsString) as Addiction[];
        const addictionIndex = storedAddictions.findIndex(
          (a) => a.id == itemId
        );
        setAddiction(storedAddictions[addictionIndex]);
      }
    }, [itemId])
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [periodDays, setPeriodDays] = useState(7);
  const [dateFrom, setDateFrom] = useState(
    dayjs().subtract(periodDays, "day").startOf("day")
  );
  const [dateTo, setDateTo] = useState(dayjs().endOf("day"));

  useEffect(() => {
    const dosesInPeriod = doses?.filter((dose) =>
      dayjs(dose.timestamp).isBetween(dateFrom, dateTo, null, "[]")
    );

    if (dosesInPeriod) {
      // setData(
      //   dosesInPeriod.map((d) => {
      //     return {
      //       value: d.amount,
      //     };
      //   })
      // );

      switch (selectedIndex) {
        case 0: {
          // day view, calc total per hour

          // const res = dosesInPeriod.reduce(
          //   (acc: Array<{ value: number; label: string }>, item: Dose) => {
          //     const hour = dayjs(item.timestamp).hour();
          //     console.log(hour);
          //     let idx = acc.findIndex((d) => d.label == hour.toString());
          //     if (idx > -1) {
          //       console.log("idx " + idx);
          //       acc[idx] = {
          //         value: acc[idx].value + 1,
          //         label: hour.toString(),
          //       };
          //     } else
          //       acc.push({
          //         value: 1,
          //         label: hour.toString(),
          //       });

          //     return acc;
          //   },
          //   []
          // );

          // setData(res);

          const res: DataItem[] = [];

          for (let i = 0; i < 24; i++) {
            const dosesThisHour = dosesInPeriod.filter(
              (dose) => dayjs(dose.timestamp).hour() == i
            );
            res.push({
              value: dosesThisHour.reduce((acc: number, dose: Dose) => {
                acc = acc + dose.amount;
                return acc;
              }, 0),
              label: i.toString(),
            });
          }

          setData(res);
          console.log(res);

          break;
        }
        case 1: {
          const weeklyDoses: DataItem[] = [];
          for (let i = 0; i < 7; i++) {
            const dosesThisDay = dosesInPeriod.filter(
              (dose) => dayjs(dose.timestamp).day() == i
            );
            weeklyDoses.push({
              value: dosesThisDay.reduce((acc: number, dose: Dose) => {
                acc = acc + dose.amount;
                return acc;
              }, 0),
              label: (i + 1).toString(),
            });
          }

          setData(weeklyDoses);
          console.log(weeklyDoses);
          break;
        }
        case 2: {
          const monthlyDoses: DataItem[] = [];
          for (let i = 0; i < 31; i++) {
            const dosesThisDay = dosesInPeriod.filter(
              (dose) => dayjs(dose.timestamp).date() == i
            );
            monthlyDoses.push({
              value: dosesThisDay.reduce((acc: number, dose: Dose) => {
                acc = acc + dose.amount;
                return acc;
              }, 0),
              label: (i + 1).toString(),
            });
          }

          setData(monthlyDoses);
          console.log(monthlyDoses);
          break;
        }
        case 3: {
          const yearlyDoses: DataItem[] = [];
          for (let i = 0; i < 12; i++) {
            const dosesThisYear = dosesInPeriod.filter(
              (dose) => dayjs(dose.timestamp).month() == i
            );
            yearlyDoses.push({
              value: dosesThisYear.reduce((acc: number, dose: Dose) => {
                acc = acc + dose.amount;
                return acc;
              }, 0),
              label: (i + 1).toString(),
            });
          }

          setData(yearlyDoses);
          console.log(yearlyDoses);
          break;
        }
      }
    }
  }, [periodDays, dateFrom, dateTo, addiction]);

  useEffect(() => {
    switch (selectedIndex) {
      case 0: {
        setPeriodDays(1);
        setDateFrom(dateTo.subtract(1, "day"));
        break;
      }
      case 1: {
        setPeriodDays(7);
        setDateFrom(dateTo.subtract(7, "day"));
        break;
      }
      case 2: {
        setPeriodDays(30);
        setDateFrom(dateTo.subtract(30, "day"));
        break;
      }
      case 3: {
        setPeriodDays(365);
        // setDateFrom(dateTo.subtract(365, "day"));
        setDateFrom(dayjs().startOf("year"));
        break;
      }
    }
  }, [selectedIndex]);

  return (
    <ScrollView>
      {addiction && (
        <View>
          <Text h1 style={styles.horizontalText}>
            {addiction.name}
          </Text>
          <Divider />
          <View style={{ marginTop: 10 }}>
            {data && data.length > 0 && (
              <LineChart
                data={data}
                initialSpacing={0}
                adjustToWidth={true}
                width={windowWidth - 50}
                yAxisOffset={-3}
                color={"#2089dc"}
              />
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 40,
                paddingHorizontal: 10,
              }}
            >
              <Button
                buttonStyle={{ marginRight: 20 }}
                onPress={() => {
                  setDateFrom(dateFrom.subtract(periodDays, "day"));
                  setDateTo(dateTo.subtract(periodDays, "day"));
                }}
                icon={
                  <Ionicons
                    name={"chevron-back-outline"}
                    size={25}
                    color="white"
                  />
                }
              />
              <ButtonGroup
                buttons={["Day", "Week", "Month", "Year"]}
                selectedIndex={selectedIndex}
                onPress={(value) => {
                  console.log(value);
                  setSelectedIndex(value);
                }}
                containerStyle={{ width: 200 }}
              />
              <Button
                onPress={() => {
                  // prevent from going further than today
                  let newDateFrom;
                  const today = dayjs();
                  let newDateTo = dateTo.add(periodDays, "day");
                  if (newDateTo.isAfter(today)) {
                    newDateFrom = today
                      .subtract(periodDays, "day")
                      .startOf("day");
                    newDateTo = today.endOf("day");
                  } else {
                    newDateFrom = dateFrom.add(periodDays, "day");
                  }

                  setDateFrom(newDateFrom);
                  setDateTo(newDateTo);
                }}
                disabled={dateTo.isToday()}
                icon={
                  <Ionicons
                    name={"chevron-forward-outline"}
                    size={25}
                    color="white"
                  />
                }
              />
            </View>
          </View>
          <View style={{ paddingHorizontal: 15 }}>
            <Button
              onPress={() => {
                deleteAddiction(addiction.id);
                navigation.navigate("Home");
              }}
              title="Supprimer"
              color="warning"
            />
          </View>
          <Text>from: {dateFrom.toISOString()}</Text>
          <Text>to: {dateTo.toISOString()}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalText: {
    textAlign: "center",
    marginVertical: 10,
  },
});

export default AddictionDetails;
