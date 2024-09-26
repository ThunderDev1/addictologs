import React, { FunctionComponent } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { blue } from "../theme";

interface IconButtonProps {
  onPress: () => void;
  iconName: string;
  disabled?: boolean;
}

const IconButton: FunctionComponent<IconButtonProps> = ({
  onPress,
  iconName,
  disabled,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={
      disabled
        ? { ...styles.IconButtonContainer, backgroundColor: "grey" }
        : { ...styles.IconButtonContainer, backgroundColor: blue }
    }
  >
    <Ionicons name={iconName} size={25} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  IconButtonContainer: {
    elevation: 8,
    borderRadius: 5,
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    paddingTop: 8,
  },
});

export default IconButton;
