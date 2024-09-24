import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Card, Icon, Text, FAB } from "@rneui/themed";
import { Addiction, DisplayPref } from "../types/counter";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import { useMMKVArray } from "../hooks/useMMKVArray";
import { storage } from "../mmkv";
import { TouchableOpacity } from "react-native-gesture-handler";
import AddictionCard from "../Components/AddictionCard";
import { RootStackParamList } from "../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

type HomeProps = {
  navigation: ProfileScreenNavigationProp;
};

const Home = ({ navigation }: HomeProps) => {
  const [addictions, setAddictions] = useState<Addiction[]>([]);

  // useEffect(() => {
  //   const addictionsString = storage.getString("addictions");
  //   if (addictionsString) {
  //     const storedAddictions = JSON.parse(addictionsString) as Addiction[];
  //     setAddictions(storedAddictions);
  //   }
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const addictionsString = storage.getString("addictions");
      if (addictionsString) {
        const storedAddictions = JSON.parse(addictionsString) as Addiction[];
        setAddictions(storedAddictions);
      }
    }, [])
  );

  const updateDose = (id: string, amount: number) => {
    const addictionIndex = addictions.findIndex((c) => c.id == id);
    const addiction = addictions[addictionIndex];
    addiction?.doses.push({ timestamp: Date.now(), amount });
    addictions[addictionIndex] = addiction;
    storage.set("addictions", JSON.stringify([...addictions]));
  };

  // const listener = storage.addOnValueChangedListener((changedKey) => {
  //   const newValue = storage.getString("addictions");
  //   if (newValue) {
  //     const storedAddictions = JSON.parse(newValue) as Addiction[];
  //     console.log(`"${changedKey}" new value ${newValue}`);
  //     setAddictions(storedAddictions);
  //   }
  // });

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
          <View style={{ padding: 15 }}>
            <AddictionCard
              addiction={item}
              increment={updateDose}
              showDetails={() =>
                navigation.navigate("AddictionDetails", {
                  itemId: item.id,
                  name: item.name,
                })
              }
            />
          </View>
        )}
      />

      <FAB
        visible={true}
        icon={{ name: "add", color: "white" }}
        placement="right"
        color="#439ce0"
        onPress={() => {
          navigation.navigate("CreateAddiction");
        }}
      />
    </View>
  );
};

export default Home;
