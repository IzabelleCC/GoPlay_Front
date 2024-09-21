import { NativeBaseProvider, StatusBar } from 'native-base';
import { THEMES } from './src/styles/theme';
import Routes from './src/Routes';

export default function App() {
  return (
    <NativeBaseProvider theme={THEMES}>
      <StatusBar backgroundColor={THEMES.colors.blue[800]} />
      <Routes />
    </NativeBaseProvider>
  );
}