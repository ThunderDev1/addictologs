import React from "react";
import { Platform } from "react-native";
import { lightColors, createTheme, ThemeProvider } from "@rneui/themed";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Screens/Home";
import Settings from "./Screens/Settings";
import * as dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import utc from "dayjs/plugin/utc";
import CreateAddiction from "./Screens/CreateAddiction";
import AddictionDetails from "./Screens/AddictionDetails";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

dayjs.extend(isToday);
dayjs.extend(isBetween);
dayjs.extend(utc);

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
});

export type RootStackParamList = {
  Home: undefined; // undefined because you aren't passing any params to the home screen
  AddictionDetails: { name: string; itemId: string };
  CreateAddiction: undefined;
};

const AddictionStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <GestureHandlerRootView>
          <NavigationContainer>
            <AddictionStack.Navigator>
              <AddictionStack.Screen
                name="Home"
                component={Home}
                options={{ title: "Addictologs" }}
              />
              <AddictionStack.Screen
                name="AddictionDetails"
                component={AddictionDetails}
                options={({ route }) => ({ title: route?.params?.name })}
              />
              <AddictionStack.Screen
                name="CreateAddiction"
                component={CreateAddiction}
                options={{ title: "Création" }}
              />
            </AddictionStack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
