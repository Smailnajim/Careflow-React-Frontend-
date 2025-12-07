import type { RegisterFormValues } from '../interfaces/IRegisterFormValues';
import type { LoginFormValues } from '../interfaces/ILoginFormValues';
import type { AuthResponse, User, AuthTokens } from '../interfaces/IAuthResponse';

const API_BASE_URL = 'http://localhost:3000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Register a new user
 */
export async function register(data: RegisterFormValues): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors.errors?.[0]?.msg || 'Registration failed');
    }

    // Store tokens if returned
    if (result.tokens) {
        storeTokens(result.tokens);
    }
    if (result.user) {
        storeUser(result.user);
    }

    return result;
}

/**
 * Login user
 */
export async function login(data: LoginFormValues): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors.errors?.[0]?.msg || 'Login failed');
    }

    // Store tokens
    if (result.tokens) {
        storeTokens(result.tokens);
    }
    if (result.user) {
        storeUser(result.user);
    }

    return result;
}

/**
 * Refresh tokens
 */
export async function refreshTokens(): Promise<AuthTokens> {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/users/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    const result = await response.json();

    if (result.errors) {
        clearTokens();
        throw new Error('Session expired. Please login again.');
    }

    if (result.tokens) {
        storeTokens(result.tokens);
    }

    return result.tokens;
}

/**
 * Store tokens in localStorage
 */
function storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

/**
 * Store user in localStorage
 */
function storeUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Get stored user
 */
export function getStoredUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
    return null;
}

/**
 * Clear all auth data (logout)
 */
export function clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getAccessToken();
}
