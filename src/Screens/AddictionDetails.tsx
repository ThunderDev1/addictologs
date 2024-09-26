import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ButtonGroup, Dialog, Icon } from "@rneui/base";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { RootStackParamList } from "../App";
import IconButton from "../Components/IconButton";
import RoundIconButton from "../Components/RoundIconButton";
import { storage } from "../mmkv";
import { Addiction, DisplayPref, Dose, periodDaysMap } from "../types/counter";

const windowWidth = Dimensions.get("window").width;

type DataItem = {
  value: number;
  label: string;
};

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddictionDetails"
>;

type AddictionDetailsProps = {
  navigation: ProfileScreenNavigationProp;
  route: any; //todo
};

const AddictionDetails = ({ navigation, route }: AddictionDetailsProps) => {
  const { itemId } = route.params;
  const [periodLabel, setPeriodLabel] = useState("");
  const [addiction, setAddiction] = useState<Addiction>();
  const [doses, setDoses] = useState<Dose[]>();
  const [data, setData] = useState<DataItem[]>();
  const [periodType, setPeriodType] = useState<number>();
  const [periodDays, setPeriodDays] = useState<number>(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLastValueModalOpen, setDeleteLastValueModalOpen] =
    useState(false);
  const [dateFrom, setDateFrom] = useState(
    dayjs().subtract(periodDays, "day").startOf("day")
  );
  const [dateTo, setDateTo] = useState(dayjs().utcOffset(0).endOf("day"));

  const deleteAddiction = (id: string) => {
    const addictionsString = storage.getString("addictions");
    if (addictionsString) {
      const storedAddictions = JSON.parse(addictionsString) as Addiction[];
      const addictionIndex = storedAddictions.findIndex((a) => a.id == id);
      storedAddictions.splice(addictionIndex, 1);
      storage.set("addictions", JSON.stringify(storedAddictions));
    }
  };
  const deleteLastDose = (item: Addiction) => {
    const addictionsString = storage.getString("addictions");
    if (addictionsString) {
      const storedAddictions = JSON.parse(addictionsString) as Addiction[];
      const addictionIndex = storedAddictions.findIndex((a) => a.id == item.id);
      item.doses.splice(item.doses.length - 1, 1);
      storedAddictions[addictionIndex] = item;
      storage.set("addictions", JSON.stringify(storedAddictions));
      setDoses([...item.doses]);
    }
  };

  const updateDisplayPref = (item: Addiction, displayPref: number) => {
    const addictionsString = storage.getString("addictions");
    if (addictionsString) {
      const storedAddictions = JSON.parse(addictionsString) as Addiction[];
      const addictionIndex = storedAddictions.findIndex((a) => a.id == item.id);
      item.displayPref = displayPref as DisplayPref;
      storedAddictions[addictionIndex] = item;
      storage.set("addictions", JSON.stringify(storedAddictions));
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
        const tmpAddiction = storedAddictions[addictionIndex];
        setAddiction(tmpAddiction);
        setDoses(tmpAddiction.doses);
        setPeriodType(tmpAddiction.displayPref);
        setPeriodDays(periodDaysMap[tmpAddiction.displayPref]);
      }
    }, [itemId])
  );

  const loadChart = () => {
    const dosesInPeriod = doses?.filter((dose) =>
      dayjs(dose.timestamp).isBetween(dateFrom, dateTo, null, "[]")
    );
    if (dosesInPeriod) {
      switch (periodType) {
        case DisplayPref.Day: {
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
        case DisplayPref.Week: {
          const weeklyDoses: DataItem[] = [];
          for (let i = 1; i <= 7; i++) {
            const dosesThisDay = dosesInPeriod.filter(
              (dose) =>
                dayjs(dose.timestamp).date() == dateFrom.add(i, "day").date()
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
        case DisplayPref.Month: {
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
        case DisplayPref.Year: {
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
    addiction &&
      periodType != undefined &&
      updateDisplayPref(addiction, periodType);

    periodType && setPeriodDays(periodDaysMap[periodType as DisplayPref]);

    const newDateTo = dayjs().utcOffset(0).endOf("day");
    setDateFrom(
      newDateTo.subtract(periodDaysMap[periodType as DisplayPref], "day")
    );
    setDateTo(newDateTo);
  }, [periodType]);

  useEffect(() => {
    if (periodType == DisplayPref.Day) {
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
                  deleteLastDose(addiction);
                  setDeleteLastValueModalOpen(false);
                }}
              />
              <Dialog.Button
                title="Annuler"
                onPress={() => setDeleteLastValueModalOpen(false)}
              />
            </Dialog.Actions>
          </Dialog>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
              marginTop: 10,
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
            <RoundIconButton
              iconName="arrow-undo-outline"
              onPress={() => {
                setDeleteLastValueModalOpen(true);
              }}
            />
            <RoundIconButton
              iconName="trash-outline"
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
                rotateLabel={periodType === DisplayPref.Year}
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
              <IconButton
                onPress={() => {
                  setDateFrom(dateFrom.subtract(periodDays, "day"));
                  setDateTo(dateTo.subtract(periodDays, "day"));
                }}
                iconName="chevron-back-outline"
              />
              <ButtonGroup
                buttons={["Jour", "Sem.", "Mois", "Année"]}
                selectedIndex={periodType}
                onPress={(value) => {
                  setPeriodType(value);
                }}
                containerStyle={{ width: 200 }}
              />
              <IconButton
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
                iconName="chevron-forward-outline"
              />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default AddictionDetails;
