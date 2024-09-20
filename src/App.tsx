import React from "react";
import { Platform } from "react-native";
import { Button, lightColors, createTheme, ThemeProvider } from "@rneui/themed";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Screens/Home";
import Settings from "./Screens/Settings";
import * as dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import CreateAddiction from "./Screens/CreateAddiction";
import AddictionDetails from "./Screens/AddictionDetails";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

dayjs.extend(isToday);
dayjs.extend(isBetween);

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
});

const Drawer = createDrawerNavigator();
const AddictionStack = createNativeStackNavigator();

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
