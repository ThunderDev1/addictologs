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

  const renderLabel = () => {
    if (displayPref || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Préférence de visualisation
        </Text>
      );
    }
    return null;
  };

  return (
    <View
      style={{
        display: "flex",
        marginBottom: 5,
        marginTop: 15,
      }}
    >
      <Input
        placeholder="Addiction name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <View style={styles.container}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
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
  container: {
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
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
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
