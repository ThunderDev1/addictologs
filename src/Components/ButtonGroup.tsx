import React, { FunctionComponent } from "react";
import { View, StyleSheet, TouchableOpacity, Button, Text } from "react-native";
import { blue, primaryText, white } from "../theme";

interface ButtonGroupProps {
  onPress: (index: number) => void;
  buttons: string[];
  selectedIndex: number;
}

const ButtonGroup: FunctionComponent<ButtonGroupProps> = ({
  onPress,
  buttons,
  selectedIndex,
}) => (
  <View style={styles.ButtonGroupContainer}>
    {buttons.map((buttonTitle, i) => (
      <TouchableOpacity
        onPress={() => onPress(i)}
        style={{
          ...styles.button,
          backgroundColor: selectedIndex === i ? blue : white,
        }}
        key={i}
      >
        <Text
          style={{
            color: selectedIndex === i ? white : primaryText,
          }}
        >
          {buttonTitle}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  ButtonGroupContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    borderColor: "#eee",
    borderWidth: 1,
    display: "flex",
    alignItems: "center",
    paddingTop: 8,
    height: 40,
    paddingHorizontal: 8,
  },
});

export default ButtonGroup;
