import React, { FunctionComponent } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { blue } from "../theme";

interface FabButtonProps {
  onPress: () => void;
}

const FabButton: FunctionComponent<FabButtonProps> = ({ onPress }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onPress} style={styles.FabButtonContainer}>
      <Ionicons name={"add"} size={40} color="white" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  FabButtonContainer: {
    elevation: 8,
    backgroundColor: blue,
    borderRadius: 50,
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    paddingTop: 9,
  },

  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
    alignSelf: "flex-end",
  },
});

export default FabButton;
