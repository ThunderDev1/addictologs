import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Card, Icon, Text, FAB } from "@rneui/themed";
import { Addiction, DisplayPref } from "../types/counter";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import { useMMKVArray } from "../hooks/useMMKVArray";
import { storage } from "../mmkv";
import { TouchableOpacity } from "react-native-gesture-handler";

const Home = ({ navigation }) => {
  const [addictions, setAddictions] = useState<Addiction[]>([]);

  useEffect(() => {
    const addictionsString = storage.getString("addictions");
    if (addictionsString) {
      const storedAddictions = JSON.parse(addictionsString) as Addiction[];
      setAddictions(storedAddictions);
    }
  }, []);

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
    addictions[addictionIndex] = addiction;
    storage.set("addictions", JSON.stringify([...addictions]));
  };

  const listener = storage.addOnValueChangedListener((changedKey) => {
    const newValue = storage.getString("addictions");
    if (newValue) {
      const storedAddictions = JSON.parse(newValue) as Addiction[];
      // console.log(`"${changedKey}" new value ${newValue}`);
      setAddictions(storedAddictions);
    }
  });

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
        columnWrapperStyle={{
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
        // contentContainerStyle={{ gap: 0 }}
        numColumns={2}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              maxWidth: "50%",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Card containerStyle={{ width: "95%" }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AddictionDetails", {
                    itemId: item.id,
                  });
                }}
              >
                <Card.Title>{item.name}</Card.Title>
              </TouchableOpacity>
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
      <FAB
        visible={true}
        icon={{ name: "add", color: "white" }}
        placement="right"
        onPress={() => {
          navigation.navigate("CreateAddiction");
        }}
      />
    </View>
  );
};

export default Home;
