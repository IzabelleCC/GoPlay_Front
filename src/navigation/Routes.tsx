// src/navigation/Routes.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Initial from "../pages/Initial";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";

export type RootStackParamList = {
    Inicial: undefined;
    Login: undefined;
    Home: undefined;
    Register: undefined;
    ResetPassword: { token: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
    prefixes: ["goplay://"],
    config: {
        screens: {
            Inicial: "inicial",
            Login: "login",
            Home: "home",
            Register: "register",
            ResetPassword: "reset-password",
        },
    },
};

export default function Routes() {
    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Inicial" component={Initial} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
