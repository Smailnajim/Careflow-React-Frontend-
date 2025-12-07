import type { RegisterFormValues } from '../interfaces/IRegisterFormValues';
import type { LoginFormValues } from '../interfaces/ILoginFormValues';
import type { AuthResponse, User } from '../interfaces/IAuthResponse';

const API_BASE_URL = 'http://localhost:3000/api';

// Storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
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
        credentials: 'include', // Send cookies
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors.errors?.[0]?.msg || 'Registration failed');
    }

    // Store access token (refresh token is in httpOnly cookie)
    if (result.accessToken) {
        storeAccessToken(result.accessToken);
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
        credentials: 'include', // Send cookies
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors.errors?.[0]?.msg || 'Login failed');
    }

    // Store access token (refresh token is in httpOnly cookie)
    if (result.accessToken) {
        storeAccessToken(result.accessToken);
    }
    if (result.user) {
        storeUser(result.user);
    }

    return result;
}

/**
 * Refresh access token (refresh token is sent automatically via httpOnly cookie)
 */
export async function refreshTokens(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/users/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // This sends the httpOnly cookie automatically
    });

    const result = await response.json();

    if (result.errors || !response.ok) {
        clearAuth();
        throw new Error('Session expired. Please login again.');
    }

    // Store new access token
    if (result.accessToken) {
        storeAccessToken(result.accessToken);
    }

    return result.accessToken;
}

/**
 * Store access token in localStorage
 */
function storeAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
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
export function clearAuth(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getAccessToken();
}
