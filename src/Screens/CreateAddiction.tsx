import { Input } from "@rneui/base";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { useMMKVArray } from "../hooks/useMMKVArray";
import { Addiction, DisplayPref } from "../types/counter";

const CreateAddiction = ({ navigation }) => {
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
