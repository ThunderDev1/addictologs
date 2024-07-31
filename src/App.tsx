import React from "react";
import { Platform } from "react-native";
import { Button, lightColors, createTheme, ThemeProvider } from "@rneui/themed";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Screens/Home";
import Settings from "./Screens/Settings";
import * as dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import CreateAddiction from "./Screens/CreateAddiction";
import AddictionDetails from "./Screens/AddictionDetails";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="CreateAddiction" component={CreateAddiction} />
            <Drawer.Screen
              name="AddictionDetails"
              component={AddictionDetails}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
