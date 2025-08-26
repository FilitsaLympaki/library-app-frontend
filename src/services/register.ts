import axios from "axios";

export interface RegisterRequestDto {
    email: string;
    username: string;
    password: string;
}

export const register = async (userData: RegisterRequestDto) => {
    try {
        const response = await axios.post(`http://localhost:8080/users/register`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("User registration failed.");
        }
        throw new Error("Network error occurred");
    }
}