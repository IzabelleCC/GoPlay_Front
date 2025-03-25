// src/navigation/Routes.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Initial from "../pages/Initial";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";

export type RootStackParamList = {
    Inicial: undefined;
    Login: undefined;
    Home: undefined;
    Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Inicial" component={Initial} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Register" component={Register} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
