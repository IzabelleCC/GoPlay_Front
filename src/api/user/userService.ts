import { Endpoints } from '../endpoints';
import {
    CreateUserPayload,
    UpdateUserPayload,
    ResetPasswordPayload,
    PasswordResetLinkPayload,
} from './userTypes';

const headers = { 'Content-Type': 'application/json' };

export const UserService = {

    async createUser(payload: CreateUserPayload) {
        const response = await fetch(Endpoints.UserManager.Base, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
            const error = await response.text();
            console.error('Erro ao criar usuário:', error);
            throw new Error('Erro ao criar usuário');
        }

        return { success: true };
    },

    async updateUser(payload: UpdateUserPayload) {
        const response = await fetch(Endpoints.UserManager.Base, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Erro ao atualizar usuário:', error);
            throw new Error('Erro ao atualizar usuário');
        }

        return response.json();
    },

    async getUserByUserName(userName: string) {
        const response = await fetch(`${Endpoints.UserManager.GetByUserName}/${userName}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Erro ao buscar usuário:', error);
            throw new Error('Erro ao buscar usuário');
        }

        return response.json();
    },

    async deleteUser(userName: string) {
        const response = await fetch(`${Endpoints.UserManager.Delete}/${userName}`, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Erro ao deletar usuário:', error);
            throw new Error('Erro ao deletar usuário');
        }

        return response.text();
    },

    async confirmEmail(email: string) {
        const url = `${Endpoints.UserManager.EmailConfirmation}?email=${encodeURIComponent(email)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Erro ao confirmar e-mail:', error);
            throw new Error('Erro ao confirmar e-mail');
        }

        return response.text();
    },

    async passwordResetLink(payload: PasswordResetLinkPayload) {
        const response = await fetch(Endpoints.UserManager.PasswordResetLink, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload), // payload já deve estar no formato { data: { email } }
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Erro ao enviar link de redefinição de senha:', error);
            throw new Error('Erro ao enviar link de redefinição de senha');
        }

        return response.text();
    },

    async resetPassword(token: string, payload: ResetPasswordPayload) {
        const url = `${Endpoints.UserManager.ResetPassword}?token=${encodeURIComponent(token)}`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Erro ao redefinir senha:', error);
            throw new Error('Erro ao redefinir senha');
        }

        return response.text();
    },
};
