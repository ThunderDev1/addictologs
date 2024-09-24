import React, { FunctionComponent, useState } from "react";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { StyleSheet, Vibration } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Sound from "react-native-sound";
import { Card, Text } from "@rneui/themed";
import { Addiction, DisplayPref, periodDaysMap } from "../types/counter";
import dayjs from "dayjs";

Sound.setCategory("Playback");

interface AddictionCard {
  addiction: Addiction;
  increment: (id: string, amount: number) => void;
  showDetails: () => void;
}

const getCurrentCount = (addiction: Addiction) => {
  return (
    addiction.doses
      .filter((dose) =>
        dayjs(dose.timestamp).isBetween(
          dayjs().subtract(periodDaysMap[addiction.displayPref]).startOf("day"),
          dayjs(),
          null,
          "[]"
        )
      )
      .reduce((acc, currentDose) => {
        return acc + currentDose.amount;
      }, 0) || 0
  );
};

const getPeriodTypeLabel = (displayPref: DisplayPref) => {
  switch (displayPref) {
    case DisplayPref.Day:
      return "Aujourd'hui";
    case DisplayPref.Week:
      return "Cette semaine";
    case DisplayPref.Month:
      return "Ce mois ci";
    case DisplayPref.Year:
      return "Cette année";
  }
};

const AddictionCard: FunctionComponent<AddictionCard> = (props) => {
  const { addiction, increment, showDetails } = props;
  const scale = useSharedValue(1);

  const pop = new Sound("pop.flac", Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log("failed to load the sound", error);
      return;
    }
  });
  pop.setVolume(1);

  const [count, setCount] = useState(getCurrentCount(addiction));

  const onLongPressComplete = () => {
    pop.play();
    Vibration.vibrate(100);
    const newCount = count + 1;
    setCount(newCount);
    increment(addiction.id, 1);
  };

  const longPress = Gesture.LongPress()
    .onBegin(() => {
      scale.value = withTiming(1.2, {
        duration: 600,
      });
    })
    .onStart(() => {
      runOnJS(onLongPressComplete)();
    })
    .onFinalize(() => {
      scale.value = withTiming(1, {
        duration: 250,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(showDetails)();
  });

  const composed = Gesture.Race(tap, longPress);

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Card.Title>{addiction.name}</Card.Title>
          <Card.Divider />

          <Text style={{ marginBottom: 10, textAlign: "center" }}>
            <Text h3>{count.toString()}</Text>
          </Text>
          <Text style={{ marginBottom: 10, textAlign: "center" }}>
            <Text>{getPeriodTypeLabel(addiction.displayPref)}</Text>
          </Text>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 150,
    height: 150,
    borderRadius: 20,
    cursor: "pointer",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
});

export default AddictionCard;
