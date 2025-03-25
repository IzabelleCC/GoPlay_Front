import { Endpoints } from '../endpoints';
import { LoginPayload } from './accessTypes';

const headers = { 'Content-Type': 'application/json' };

export const AccessService = {
    async login(payload: LoginPayload) {
        const response = await fetch(Endpoints.AccessManager.Login, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Erro ao logar:", error);
            throw new Error('Erro ao logar');
        }

        return response.text(); // Token
    },

    async logout() {
        const response = await fetch(Endpoints.AccessManager.Logout, {
            method: 'POST',
            headers,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Erro ao deslogar:", error);
            throw new Error('Erro ao deslogar');
        }

        return response.text();
    }
};
