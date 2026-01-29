export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    birthDate: string;
}

export interface LoginDto {
    email: string;
    username: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    email: string;
}