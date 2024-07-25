import React from "react";
import { View } from "react-native";
import { Button } from "@rneui/themed";

const Home = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={() => navigation.navigate("Settings")}
        title="Go to settings"
        color="secondary"
      />
    </View>
  );
};

export default Home;
