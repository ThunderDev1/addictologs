import { useFocusEffect } from "@react-navigation/native";
import {
  Button,
  ButtonGroup,
  Dialog,
  Divider,
  FAB,
  Icon,
  Input,
  Text,
} from "@rneui/base";
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
  const [periodLabel, setPeriodLabel] = useState("");
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
  const deleteLastValue = (item: Addiction) => {
    const addictionsString = storage.getString("addictions");
    if (addictionsString) {
      const storedAddictions = JSON.parse(addictionsString) as Addiction[];
      const addictionIndex = storedAddictions.findIndex((a) => a.id == item.id);
      item.doses.splice(item.doses.length - 1, 1);
      storedAddictions[addictionIndex] = item;
      storage.set("addictions", JSON.stringify(storedAddictions));
      console.log("deleteLastValue");
      setDoses([...item.doses]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const addictionsString = storage.getString("addictions");
      if (addictionsString) {
        const storedAddictions = JSON.parse(addictionsString) as Addiction[];
        const addictionIndex = storedAddictions.findIndex(
          (a) => a.id == itemId
        );
        setAddiction(storedAddictions[addictionIndex]);
        setDoses(storedAddictions[addictionIndex].doses);
      }
    }, [itemId])
  );

  const [periodType, setPeriodType] = useState(1);
  const [periodDays, setPeriodDays] = useState(7);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLastValueModalOpen, setDeleteLastValueModalOpen] =
    useState(false);
  const [dateFrom, setDateFrom] = useState(
    dayjs().subtract(periodDays, "day").startOf("day")
  );
  const [dateTo, setDateTo] = useState(dayjs().utcOffset(0).endOf("day"));

  const loadChart = () => {
    console.log("load");
    const dosesInPeriod = doses?.filter((dose) =>
      dayjs(dose.timestamp).isBetween(dateFrom, dateTo, null, "[]")
    );
    if (dosesInPeriod) {
      switch (periodType) {
        case 0: {
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
              label: [4, 8, 12, 16, 20].includes(i) ? i + "h" : "",
            });
          }

          setData(res);
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
              label: dateFrom.add(i, "day").format("DD"),
            });
          }

          setData(weeklyDoses);
          break;
        }
        case 2: {
          const monthlyDoses: DataItem[] = [];
          for (let i = 0; i <= 30; i++) {
            const dosesThisDay = dosesInPeriod.filter(
              (dose) =>
                dayjs(dose.timestamp).date() == dateFrom.add(i, "day").date()
            );
            monthlyDoses.push({
              value: dosesThisDay.reduce((acc: number, dose: Dose) => {
                acc = acc + dose.amount;
                return acc;
              }, 0),
              label: [0, 7, 15, 22, 30].includes(i)
                ? dateFrom.add(i, "day").format("DD")
                : "",
            });
          }

          setData(monthlyDoses);
          break;
        }
        case 3: {
          const yearlyDoses: DataItem[] = [];
          for (let i = 0; i < 12; i++) {
            const dosesThisYear = dosesInPeriod.filter(
              (dose) =>
                dayjs(dose.timestamp).month() ==
                dateFrom.add(i + 1, "month").month()
            );
            yearlyDoses.push({
              value: dosesThisYear.reduce((acc: number, dose: Dose) => {
                acc = acc + dose.amount;
                return acc;
              }, 0),
              label: i > 0 ? dateFrom.add(i + 1, "month").format("MMM") : "", // hide first label
            });
          }

          setData(yearlyDoses);
          break;
        }
      }
    }
  };

  useEffect(() => {
    loadChart();
  }, [periodDays, dateFrom, dateTo, doses]);

  useEffect(() => {
    switch (periodType) {
      case 0: {
        setPeriodDays(1);
        const newDateTo = dayjs().utcOffset(0).endOf("day");
        setDateFrom(newDateTo.subtract(1, "day"));
        setDateTo(newDateTo);
        break;
      }
      case 1: {
        setPeriodDays(7);
        const newDateTo = dayjs().utcOffset(0).endOf("day");
        setDateFrom(newDateTo.subtract(6, "day").utcOffset(0).startOf("day"));
        setDateTo(newDateTo);
        break;
      }
      case 2: {
        setPeriodDays(30);
        const newDateTo = dayjs().utcOffset(0).endOf("day");
        setDateFrom(newDateTo.subtract(30, "day").utcOffset(0).startOf("day"));
        setDateTo(newDateTo);
        break;
      }
      case 3: {
        setPeriodDays(365);
        setDateFrom(
          dayjs().startOf("year").add(1, "day").utcOffset(0).startOf("day")
        );
        setDateTo(dayjs().endOf("year").utcOffset(0).startOf("day"));
        break;
      }
    }
  }, [periodType]);

  useEffect(() => {
    console.log("test");
    if (periodType == 0) {
      if (dateTo.isToday()) setPeriodLabel("Aujourd'hui");
      else setPeriodLabel(dateFrom.format("DD/MM/YYYY"));
    } else {
      setPeriodLabel(
        dateFrom.format("DD/MM/YYYY") + " - " + dateTo.format("DD/MM/YYYY")
      );
    }
  }, [periodType, dateFrom, dateTo]);

  return (
    <ScrollView>
      {addiction && (
        <View>
          <Dialog
            isVisible={deleteModalOpen}
            onBackdropPress={() => setDeleteModalOpen(false)}
            overlayStyle={{ backgroundColor: "white" }}
          >
            <Dialog.Title title="Supprimer cette addiction" />
            <Text>Voulez-vous supprimer cette addiction ?</Text>
            <Dialog.Actions>
              <Button
                title="Supprimer"
                color="error"
                onPress={() => {
                  deleteAddiction(addiction.id);
                  navigation.navigate("Home");
                }}
              />
              <Dialog.Button
                title="Annuler"
                onPress={() => setDeleteModalOpen(false)}
              />
            </Dialog.Actions>
          </Dialog>
          <Dialog
            isVisible={deleteLastValueModalOpen}
            onBackdropPress={() => setDeleteLastValueModalOpen(false)}
            overlayStyle={{ backgroundColor: "white" }}
          >
            <Dialog.Title title="Supprimer la dernière valeur" />
            <Text>Voulez-vous supprimer la dernière valeur ajoutée ?</Text>
            <Dialog.Actions>
              <Button
                title="Supprimer"
                color="warning"
                onPress={() => {
                  deleteLastValue(addiction);
                  setDeleteLastValueModalOpen(false);
                }}
              />
              <Dialog.Button
                title="Annuler"
                onPress={() => setDeleteLastValueModalOpen(false)}
              />
            </Dialog.Actions>
          </Dialog>
          {/* <Text h1 style={styles.horizontalText}>
            {addiction.name}
          </Text>
          <Divider /> */}
          {/* <FAB icon={{ name: "delete", color: "white" }} color="green" /> */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <Icon
              raised
              name="history"
              onPress={() => {
                setDeleteLastValueModalOpen(true);
              }}
            />
            <Icon
              raised
              name="delete"
              onPress={() => {
                setDeleteModalOpen(true);
              }}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            {data && data.length > 0 && (
              <LineChart
                data={data}
                initialSpacing={0}
                adjustToWidth={true}
                width={windowWidth - 50}
                yAxisOffset={-3}
                color={"#2089dc"}
                labelsExtraHeight={10}
                rotateLabel={periodType === 3}
              />
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 5,
                marginTop: 15,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{periodLabel}</Text>
            </View>
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
                selectedIndex={periodType}
                onPress={(value) => {
                  console.log(value);
                  setPeriodType(value);
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
                      .utcOffset(0)
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
          {/* <View style={{ paddingHorizontal: 15 }}>
            <Button
              onPress={() => {
                setDeleteLastValueModalOpen(true);
              }}
              title="Supprimer la dernière valeur"
              color="warning"
              containerStyle={{ marginBottom: 15 }}
            />
            <Button
              onPress={() => {
                setDeleteModalOpen(true);
              }}
              title="Supprimer ce compteur"
              color="error"
              containerStyle={{ marginBottom: 15 }}
            />
          </View> */}
          <Text>from: {dateFrom.toISOString()}</Text>
          <Text>tooo: {dateTo.toISOString()}</Text>
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
