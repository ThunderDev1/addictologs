import React from "react";
import { View } from "react-native";
import { Button } from "@rneui/themed";

const Settings = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={() => navigation.navigate("Dashboard")}
        title="Go home"
        color="warning"
      />
    </View>
  );
};

export default Settings;
