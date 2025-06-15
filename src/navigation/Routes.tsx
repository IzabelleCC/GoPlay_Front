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
import CreateTournament from "../pages/CreateTournament";
import EditTournament from "../pages/EditTournament";
import PlayerTournaments from "../pages/PlayerTournaments";
import TournamentDetails from "../pages/TournamentDetails";
import CategoryRegister from "../pages/CategoryRegister";
import PaymentPage from "../pages/PaymentPage";
import CategoryDetails from "../pages/CategoryDetails";
import MatchGroup from "../pages/MatchGroup";
import RoundOf32 from "../pages/RoundOf32 ";
import RoundOf16 from "../pages/RoundOf16";
import QuarterFinal from "../pages/QuarterFinal";
import SemiFinal from "../pages/SemiFinal";
import Final from "../pages/Final"; 

export type RootStackParamList = {
    Inicial: undefined;
    Login: undefined;
    HomePlayer: undefined;
    HomeAdm: undefined;
    Register: undefined;
    MyProfile: undefined;
    EditProfile: undefined;
    CreateTournament: undefined;
    EditTournament: undefined;
    PlayerTournaments: undefined;
    TournamentDetails: { tournamentId: number };
    CategoryRegister: { tournamentId: number; categoryId: number };
    PaymentPage: { categoryPlayerId: number };
    CategoryDetails: undefined;
    MatchGroup: undefined;
    RoundOf32: undefined;
    RoundOf16: undefined;
    QuarterFinal: undefined;
    SemiFinal: undefined;
    Final: undefined;
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
            CreateTournament: "createtournament",
            EditTournament: "edittournament",
            PlayerTournaments: "playertournaments",
            TournamentDetails: "tournamentdetails/:tournamentId",
            CategoryRegister: "categoryregister/:tournamentId/:categoryId",
            PaymentPage: "paymentpage/:categoryPlayerId",
            CategoryDetails: "categorydetails",
            MatchGroup: "matchgroup",
            RoundOf32: "roundof32",
            RoundOf16: "roundof16",
            QuarterFinal: "quarterfinal",
            SemiFinal: "semifinal",
            Final: "final",
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
                <Stack.Screen name="CreateTournament" component={CreateTournament} />
                <Stack.Screen name="EditTournament" component={EditTournament} />
                <Stack.Screen name="PlayerTournaments" component={PlayerTournaments} />
                <Stack.Screen name="TournamentDetails" component={TournamentDetails} />
                <Stack.Screen name="CategoryRegister" component={CategoryRegister} />
                <Stack.Screen name="PaymentPage" component={PaymentPage} /> 
                <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
                <Stack.Screen name="MatchGroup" component={MatchGroup} />
                <Stack.Screen name="RoundOf32" component={RoundOf32} />
                <Stack.Screen name="RoundOf16" component={RoundOf16} />
                <Stack.Screen name="QuarterFinal" component={QuarterFinal} />
                <Stack.Screen name="SemiFinal" component={SemiFinal} />
                <Stack.Screen name="Final" component={Final} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
