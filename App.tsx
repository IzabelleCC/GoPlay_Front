import { NativeBaseProvider, StatusBar } from 'native-base';
import { THEMES } from './src/styles/theme';
import Routes from './src/navigation/Routes';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';
import { Text, View, Platform, SafeAreaView } from 'react-native';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from './src/utils/notifications';

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  // Permissão e registro do token ao iniciar o app
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando fontes...</Text>
      </View>
    );
  }

  return (
    <NativeBaseProvider theme={THEMES}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={THEMES.colors.blue[800]}
          barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
        />
        {/* Routes agora será responsável por chamar o useNotificationHandlers no contexto correto */}
        <Routes />
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
