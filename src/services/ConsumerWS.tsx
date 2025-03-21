

const UserManager = "https://localhost:7276/api/UserManager";
const AccessManager = "https://localhost:7276/api/AccessManager";

const Login = `${AccessManager}/Login`;
const Logout = `${AccessManager}/Logout`;

export const ConsumerWS = {
    async createUser(userName: string, password: string) {
        console.log(`email - ${userName}, senha - ${password}`);
        const response = await fetch(UserManager, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    userName,
                    password,
                }
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }

        throw new Error('Erro ao criar conta');
    },
    async signIn(userName: string, password: string) {
        const response = await fetch(Login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    userName,
                    password,
                }
            }),
        });
    
        console.log('Resposta bruta:', response);
    
        if (response.ok) {
            const token = await response.text(); 
            console.log('Token recebido:', token);
            return token;
        }
    
        const errorText = await response.text();
        console.log('Erro no login - status:', response.status, 'body:', errorText);
        throw new Error('Erro ao logar');
    }
};