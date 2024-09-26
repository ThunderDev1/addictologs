import React, { FunctionComponent } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { blue, white } from "../theme";

interface RoundIconButtonProps {
  onPress: () => void;
  iconName: string;
  disabled?: boolean;
}

const RoundIconButton: FunctionComponent<RoundIconButtonProps> = ({
  onPress,
  iconName,
  disabled,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={
      disabled
        ? { ...styles.RoundIconButtonContainer, backgroundColor: "grey" }
        : { ...styles.RoundIconButtonContainer, backgroundColor: white }
    }
  >
    <Ionicons name={iconName} size={25} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  RoundIconButtonContainer: {
    elevation: 8,
    borderRadius: 50,
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    paddingTop: 12,
  },
});

export default RoundIconButton;
