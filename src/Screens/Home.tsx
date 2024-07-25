import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Card, Icon, Text } from "@rneui/themed";
import { Counter } from "../types/counter";
import Ionicons from "react-native-vector-icons/Ionicons";

const Home = ({ navigation }) => {
  const [counters, setCounters] = useState<Array<Counter>>([
    {
      id: "1",
      name: "Beer",
      count: 4,
    },
    {
      id: "2",
      name: "Coffee",
      count: 2,
    },
    {
      id: "3",
      name: "Cigarettes",
      count: 8,
    },
  ]);

  return (
    <View
      style={{
        flex: 2,
        marginHorizontal: "auto",
        width: "100%",
      }}
    >
      <FlatList
        data={counters}
        contentContainerStyle={{ justifyContent: "space-between" }}
        columnWrapperStyle={{ flexWrap: "wrap" }}
        numColumns={2}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              maxWidth: "50%",
              alignItems: "center",
            }}
          >
            <Card>
              <Card.Title>{item.name}</Card.Title>
              <Card.Divider />

              <Text style={{ marginBottom: 10, textAlign: "center" }}>
                <Text h3>{item.count}</Text>
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  icon={<Ionicons name={"remove-outline"} size={25} />}
                  buttonStyle={{ marginRight: 20 }}
                />
                <Button icon={<Ionicons name={"add-outline"} size={25} />} />
              </View>
            </Card>
          </View>
        )}
      />
    </View>
  );
};

export default Home;
