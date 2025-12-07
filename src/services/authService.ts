import type { RegisterFormValues } from '../interfaces/IRegisterFormValues';
import type { LoginFormValues } from '../interfaces/ILoginFormValues';
import type { User } from '../interfaces/IAuthResponse';

const API_BASE_URL = 'http://localhost:3000/api';

// Storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

/**
 * Decode JWT token to extract user data from payload
 */
function decodeToken(token: string): User | null {
    try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        return {
            id: payload.id || payload.sub || payload.userId,
            firstName: payload.firstName || payload.first_name || '',
            lastName: payload.lastName || payload.last_name || '',
            email: payload.email || '',
        };
    } catch {
        return null;
    }
}

/**
 * Register a new user - returns { valid: user } on success
 * User should be redirected to login after registration
 */
export async function register(data: RegisterFormValues): Promise<{ valid: boolean }> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors.errors?.[0]?.msg || 'Registration failed');
    }

    return { valid: !!result.valid };
}

/**
 * Login user - returns { accessToken } and sets httpOnly cookie for refresh token
 */
export async function login(data: LoginFormValues): Promise<{ accessToken: string; user: User | null }> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.errors || result.error) {
        throw new Error(result.errors?.errors?.[0]?.msg || result.error || 'Login failed');
    }

    let user: User | null = null;

    if (result.accessToken) {
        storeAccessToken(result.accessToken);
        user = decodeToken(result.accessToken);
        if (user) {
            storeUser(user);
        }
    }

    return { accessToken: result.accessToken, user };
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
        credentials: 'include',
    });

    const result = await response.json();

    if (result.errors || !response.ok) {
        clearAuth();
        throw new Error('Session expired. Please login again.');
    }

    if (result.accessToken) {
        storeAccessToken(result.accessToken);
        const user = decodeToken(result.accessToken);
        if (user) {
            storeUser(user);
        }
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