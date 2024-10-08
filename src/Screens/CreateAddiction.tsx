import { StackNavigationProp } from "@react-navigation/stack";
import { Button, Input } from "@rneui/base";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
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

  const [displayPref, setDisplayPref] = useState(DisplayPref.Day.valueOf());
  const [isFocus, setIsFocus] = useState(false);

  const displayPrefList = [
    { label: "Jour", value: DisplayPref.Day.valueOf() },
    { label: "Semaine", value: DisplayPref.Week.valueOf() },
    { label: "Mois", value: DisplayPref.Month.valueOf() },
    { label: "Année", value: DisplayPref.Year.valueOf() },
  ];

  return (
    <View
      style={{
        display: "flex",
        marginBottom: 5,
        marginTop: 15,
      }}
    >
      <View style={{ paddingHorizontal: 10 }}>
        <Input
          placeholder="Titre de l'addiction"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={{ padding: 16 }}>
        <Text style={[styles.label]}>Préférence de visualisation</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          data={displayPrefList}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Préférence de visualisation" : "..."}
          searchPlaceholder="Search..."
          value={displayPrefList.find((dp) => dp.value === displayPref)}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setDisplayPref(item.value);
            setIsFocus(false);
          }}
        />
      </View>

      <Button
        containerStyle={{
          display: "flex",
          alignItems: "center",
        }}
        onPress={() => {
          const newAddictions = addictions || [];
          newAddictions.push({
            id: name.replace(" ", "-").toLowerCase() + Date.now(),
            displayPref: displayPref as DisplayPref,
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

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: "absolute",
    backgroundColor: "#f2f2f2",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
});
