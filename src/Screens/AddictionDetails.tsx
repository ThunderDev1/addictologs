import { useFocusEffect } from "@react-navigation/native";
import { Button, Divider, Input, Text } from "@rneui/base";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useMMKVArray } from "../hooks/useMMKVArray";
import { storage } from "../mmkv";
import { Addiction, DisplayPref } from "../types/counter";

const AddictionDetails = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [addiction, setAddiction] = useState<Addiction>();

  const deleteAddiction = (id: string) => {
    const addictionsString = storage.getString("addictions");
    if (addictionsString) {
      const storedAddictions = JSON.parse(addictionsString) as Addiction[];
      const addictionIndex = storedAddictions.findIndex((a) => a.id == id);
      storedAddictions.splice(addictionIndex, 1);
      storage.set("addictions", JSON.stringify(storedAddictions));
    }
  };

  useFocusEffect(
    useCallback(() => {
      const addictionsString = storage.getString("addictions");
      if (addictionsString) {
        const storedAddictions = JSON.parse(addictionsString) as Addiction[];
        const addictionIndex = storedAddictions.findIndex(
          (a) => a.id == itemId
        );
        setAddiction(storedAddictions[addictionIndex]);
      }
    }, [itemId])
  );

  return (
    <ScrollView>
      {addiction && (
        <View>
          <Text h1 style={styles.horizontalText}>
            {addiction.name}
          </Text>
          <Divider />
          <View style={{ paddingHorizontal: 15 }}>
            <Button
              onPress={() => {
                deleteAddiction(addiction.id);
                navigation.navigate("Home");
              }}
              title="Supprimer"
              color="warning"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalText: {
    textAlign: "center",
    marginVertical: 10,
  },
});

export default AddictionDetails;
