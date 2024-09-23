import { StackNavigationProp } from "@react-navigation/stack";
import { Input } from "@rneui/base";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { RootStackParamList } from "../App";
import { useMMKVArray } from "../hooks/useMMKVArray";
import { Addiction, DisplayPref } from "../types/counter";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreateAddiction"
>;

type CreateAddictionProps = {
  navigation: ProfileScreenNavigationProp;
};

const CreateAddiction = ({ navigation }: CreateAddictionProps) => {
  const [addictions, setAddictions] = useMMKVArray<Addiction[]>("addictions");
  const [name, setName] = useState("");
  return (
    <View>
      <Text>Create</Text>
      <Input
        placeholder="Addiction name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Button
        onPress={() => {
          const newAddictions = addictions || [];
          newAddictions.push({
            id: name.replace(" ", "-").toLowerCase() + Date.now(),
            displayPref: DisplayPref.Day,
            name: name,
            doses: [],
          });
          setAddictions(newAddictions);
          setName("");

          navigation.navigate("Home");
        }}
        title="Ajouter"
      />
    </View>
  );
};

export default CreateAddiction;
