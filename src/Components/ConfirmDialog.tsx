import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { lightGrey, white } from "../theme";
import IconButton from "./IconButton";
import RoundIconButton from "./RoundIconButton";

interface ConfirmDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  isVisible: boolean;
  title: string;
  body: string;
}

const ConfirmDialog: FunctionComponent<ConfirmDialogProps> = ({
  onConfirm,
  onClose,
  isVisible,
  title,
  body,
}) => {
  return (
    <Modal visible={isVisible} transparent={true}>
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={() => {
          onClose();
        }}
        style={{ ...styles.overlay, display: isVisible ? "flex" : "none" }}
      >
        <View style={styles.box}>
          <TouchableWithoutFeedback>
            <View>
              <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
              </View>
              <View>
                <Text>{body}</Text>
                <View style={styles.actions}>
                  <Button
                    title="Valider"
                    onPress={() => {
                      onConfirm();
                    }}
                  />
                  <View style={{ marginLeft: 16 }}>
                    <Button title="Annuler" onPress={() => onClose()} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  box: {
    backgroundColor: white,
    width: "80%",
    minHeight: 100,
    marginTop: "30%",
    borderRadius: 3,
    padding: 16,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 24,
  },
});

export default ConfirmDialog;
