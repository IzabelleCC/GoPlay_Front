import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import Inicial from "./Inicial";
import Home from "./Home";

const Tab = createNativeStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Inicial" component={Inicial}
                    options={{ headerShown: false }} />
                <Tab.Screen name="Login" component={Login}
                    options={{ headerShown: false }} />
                <Tab.Screen name="Home" component={Home}
                    options={{ headerShown: false }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

