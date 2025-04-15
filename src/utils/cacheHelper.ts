import AsyncStorage from '@react-native-async-storage/async-storage';

const USERNAME_KEY = 'GoPlay:userName';

export const saveUsernameToCache = async (username: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(USERNAME_KEY, username);
    } catch (error) {
        console.error('Erro ao salvar username no cache:', error);
    }
};

export const getCachedUsername = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(USERNAME_KEY);
    } catch (error) {
        console.error('Erro ao obter username do cache:', error);
        return null;
    }
};

export const clearCachedUsername = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(USERNAME_KEY);
    } catch (error) {
        console.error('Erro ao limpar username do cache:', error);
    }
};
