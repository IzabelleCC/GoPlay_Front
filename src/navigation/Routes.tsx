import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Spinner, Center } from "native-base";

import { useNotificationHandlers } from "../utils/notifications";
import Initial from "../pages/Shared/Initial";
import Login from "../pages/Shared/Login";
import HomePlayer from "../pages/Player/HomePlayer";
import HomeAdm from "../pages/Adm/HomeAdm";
import Register from "../pages/Shared/Register";
import MyProfile from "../pages/Shared/MyProfile";
import EditProfile from "../pages/Shared/EditProfile";
import CreateTournament from "../pages/Adm/CreateTournament";
import EditTournament from "../pages/Adm/EditTournament";
import PlayerTournaments from "../pages/Player/PlayerTournaments";
import TournamentDetails from "../pages/Player/TournamentDetails";
import CategoryRegister from "../pages/Player/CategoryRegister";
import PaymentPage from "../pages/Player/PaymentPage";
import CategoryDetails from "../pages/Adm/CategoryDetails";
import MatchGroup from "../pages/Shared/Games/MatchGroup";
import RoundOf32 from "../pages/Shared/Games/RoundOf32";
import RoundOf16 from "../pages/Shared/Games/RoundOf16";
import QuarterFinal from "../pages/Shared/Games/QuarterFinal";
import SemiFinal from "../pages/Shared/Games/SemiFinal";
import Final from "../pages/Shared/Games/Final";
import RegistrationDetails from "../pages/Player/RegistrationDetails";
import RegistrationOfCategoryDetails from "../pages/Shared/RegistrationOfCategoryDetails";

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
    RegistrationDetails: { registrationId: number };
    RegistrationOfCategoryDetails: { categoryId: number};
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
            RegistrationDetails: "registrationdetails/:registrationId",
            RegistrationOfCategoryDetails: "registrationofcategorydetails/:categoryId",
        },
    },
};

function AppStack({ initialRoute }: { initialRoute: keyof RootStackParamList }) {
    useNotificationHandlers();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
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
            <Stack.Screen name="RegistrationDetails" component={RegistrationDetails} />
            <Stack.Screen name="RegistrationOfCategoryDetails" component={RegistrationOfCategoryDetails} />
        </Stack.Navigator>
    );
}

export default function Routes() {
    const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const userId = await AsyncStorage.getItem("userId");
            const userType = await AsyncStorage.getItem("userType");

            if (userId && userType) {
                if (userType === "1") {
                    setInitialRoute("HomePlayer");
                } else if (userType === "2") {
                    setInitialRoute("HomeAdm");
                } else {
                    setInitialRoute("Login");
                }
            } else {
                setInitialRoute("Login");
            }
        };

        checkAuth();
    }, []);

    if (!initialRoute) {
        return (
            <Center flex={1}>
                <Spinner size="lg" />
            </Center>
        );
    }

    return (
        <NavigationContainer linking={linking}>
            <AppStack initialRoute={initialRoute} />
        </NavigationContainer>
    );
}
