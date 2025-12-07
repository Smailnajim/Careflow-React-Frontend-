export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
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
