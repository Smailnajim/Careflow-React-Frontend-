export type UserRole = 'admin' | 'medecin' | 'patient' | 'laboratoire';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    phone?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

export interface ApiError {
    errors?: {
        errors: Array<{
            msg: string;
            param: string;
        }>;
    };
    message?: string;
}
