import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';


export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    // Solicita permissões
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
        console.log('Permissão para notificações negada!');
        return null;
    }

    // Obtém FCM token
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    return fcmToken;
}

export function useNotificationHandlers() {
    const navigation = useNavigation();

    useEffect(() => {
        // Solicita permissão
        const requestUserPermission = async () => {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status:', authStatus);
                const fcmToken = await messaging().getToken();
                console.log('FCM Token:', fcmToken);
            } else {
                console.log('Permissão do Firebase Messaging negada!');
            }
        };

        requestUserPermission();

        // Handler do Expo
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });

        // Foreground push
        const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
            console.log('Mensagem recebida em foreground:', remoteMessage);

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: remoteMessage.notification?.title,
                    body: remoteMessage.notification?.body,
                    data: remoteMessage.data,
                },
                trigger: null,
            });
        });

        // Background push
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('Mensagem tratada em background!', remoteMessage);

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: remoteMessage.notification?.title,
                    body: remoteMessage.notification?.body,
                    data: remoteMessage.data,
                },
                trigger: null,
            });
        });

        // Quando o app abre por clique em notificação no background
        const unsubscribeOnOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('Abriu app vindo de background:', remoteMessage);
            const screen = remoteMessage?.data?.screen;
            if (screen) {
                navigation.navigate("HomePlayer" as never);
            }
        });

        // Quando o app abre vindo de estado encerrado (quit)
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    console.log('Abriu app vindo de quit:', remoteMessage);
                    const screen = remoteMessage?.data?.screen;
                    if (screen) {
                        navigation.navigate("HomePlayer" as never);
                    }
                }
            });

        // Listener de clique na notificação via Expo
        const notificationResponseListener = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('Usuário clicou na notificação (Expo):', response);
            const screen = response.notification.request.content.data.screen;
            if (screen) {
                navigation.navigate("HomePlayer" as never);
            }
        });

        // Cleanup
        return () => {
            unsubscribeOnMessage();
            unsubscribeOnOpenedApp();
            notificationResponseListener.remove();
        };
    }, [navigation]);
}
