import { Endpoints } from './Endpoints';

export const ConsumerAPI = {

    async createUser(userName: string, password: string) {
        const response = await fetch(Endpoints.UserManager, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { userName, password } }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Erro ao criar conta:", error);
            throw new Error('Erro ao criar conta');
        }

        return response.json();
    },

    async signIn(userName: string, password: string) {
        const response = await fetch(Endpoints.AccessManager.Login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { userName, password } }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Erro ao logar:", error);
            throw new Error('Erro ao logar');
        }

        const token = await response.text();
        return token;
    }
};
