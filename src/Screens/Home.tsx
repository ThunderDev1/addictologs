import React from "react";
import { View, Button } from "react-native";

const Home = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={() => navigation.navigate("Settings")}
        title="Go to settings"
      />
    </View>
  );
};

export default Home;
