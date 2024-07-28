import React from "react";
import { Platform } from "react-native";
import { Button, lightColors, createTheme, ThemeProvider } from "@rneui/themed";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Screens/Home";
import Settings from "./Screens/Settings";
import dayjs from "dayjs";
import CreateAddiction from "./Screens/CreateAddiction";
import AddictionDetails from "./Screens/AddictionDetails";

var isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);

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
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Settings" component={Settings} />
          <Drawer.Screen name="CreateAddiction" component={CreateAddiction} />
          <Drawer.Screen name="AddictionDetails" component={AddictionDetails} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
