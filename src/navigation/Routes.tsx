// src/navigation/Routes.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Initial from "../pages/Initial";
import Login from "../pages/Login";
import HomePlayer from "../pages/HomePlayer";
import HomeAdm from "../pages/HomeAdm";
import Register from "../pages/Register";
import MyProfile from "../pages/MyProfile";
import EditProfile from "../pages/EditProfile";

export type RootStackParamList = {
    Inicial: undefined;
    Login: undefined;
    HomePlayer: undefined;
    HomeAdm: undefined;
    Register: undefined;
    MyProfile: undefined;
    EditProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
    prefixes: ["goplay://"],
    config: {
        screens: {
            Inicial: "inicial",
            Login: "login",
            HomePlayer: "homeplayer",
            HomeAdm: "homeadm",
            Register: "register",
            MyProfile: "myprofile",
            EditProfile: "editprofile",
        },
    },
};

export default function Routes() {
    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Inicial" component={Initial} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="HomePlayer" component={HomePlayer} />
                <Stack.Screen name="HomeAdm" component={HomeAdm} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="MyProfile" component={MyProfile} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
