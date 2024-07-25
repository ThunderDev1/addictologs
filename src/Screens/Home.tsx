import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Card, Icon, Text } from "@rneui/themed";
import { Addiction, DisplayPref } from "../types/counter";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";

const Home = ({ navigation }) => {
  const [addictions, setAddictions] = useState<Array<Addiction>>([
    {
      id: "1",
      name: "Beer",
      displayPref: DisplayPref.Day,
      doses: [],
    },
  ]);

  const getCurrentCount = (addiction: Addiction) => {
    switch (addiction.displayPref) {
      default:
        return addiction.doses
          .filter((dose) => dayjs(dose.timestamp).isToday())
          .reduce((acc, currentDose) => {
            return acc + currentDose.amount;
          }, 0);
    }
  };

  const updateDose = (id: string, amount: number) => {
    const addictionIndex = addictions.findIndex((c) => c.id == id);
    const addiction = addictions[addictionIndex];
    addiction?.doses.push({ timestamp: Date.now(), amount });
    console.log(addiction);
    addictions[addictionIndex] = addiction;
    setAddictions([...addictions]);
  };

  return (
    <View
      style={{
        flex: 2,
        marginHorizontal: "auto",
        width: "100%",
      }}
    >
      <FlatList
        data={addictions}
        contentContainerStyle={{ justifyContent: "space-between" }}
        columnWrapperStyle={{ flexWrap: "wrap" }}
        numColumns={2}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              maxWidth: "50%",
              alignItems: "center",
            }}
          >
            <Card>
              <Card.Title>{item.name}</Card.Title>
              <Card.Divider />

              <Text style={{ marginBottom: 10, textAlign: "center" }}>
                <Text h3>{getCurrentCount(item)}</Text>
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  buttonStyle={{ marginRight: 20 }}
                  onPress={() => updateDose(item.id, -1)}
                  disabled={getCurrentCount(item) <= 0}
                  icon={<Ionicons name={"remove-outline"} size={25} />}
                />
                <Button
                  onPress={() => updateDose(item.id, 1)}
                  icon={<Ionicons name={"add-outline"} size={25} />}
                />
              </View>
            </Card>
          </View>
        )}
      />
    </View>
  );
};

export default Home;
