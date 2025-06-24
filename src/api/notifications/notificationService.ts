import { Endpoints } from "../endpoints";

export const NotificationService = {
    async registerToken(token: string, userId: string) {
        const response = await fetch(Endpoints.Notifications.Register, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, userId })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao registrar token: ${error}`);
        }

        const data = await response.json();
        console.log("Resposta do servidor ao registrar token:", data);
        return data;
    }
};

