import axios from "axios";

export interface AuthenticationRequestDto {
    username: string;
    password: string;
}

export interface AuthenticationResponseDto {
    token: string;
}

export const storeToken = (token: string) => {
    localStorage.setItem('authToken', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

export const removeToken = () => {
    localStorage.removeItem('authToken');
}

export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) console.log("User is not authenticated");
    return token !== null;
}

export const login = async (userData: AuthenticationRequestDto): Promise<AuthenticationResponseDto> => {
    try {
        const response = await axios.post(
            `http://localhost:8080/auth/login`,
            userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Invalid username or password");
        }
        throw new Error("Network error occurred");
    }
};
