import type { UserData, UpdateUserData } from '../interfaces/IUser';
import { getAccessToken, refreshTokens, clearAuth } from './authService';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Get authorization headers with access token
 */
function getAuthHeaders(): HeadersInit {
    const token = getAccessToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer Bearer ${token}` } : {}),
    };
}

/**
 * Execute a fetch request with automatic token refresh on expiry
 */
async function fetchWithAuth<T>(
    url: string,
    options: RequestInit,
    retried: boolean = false
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: getAuthHeaders(),
        credentials: 'include',
    });

    const result = await response.json();

    // Check for expired token
    if (result.message === 'expired token' && !retried) {
        try {
            // Try to refresh the token
            await refreshTokens();
            // Retry the request with new token
            return fetchWithAuth<T>(url, options, true);
        } catch (refreshError) {
            // Refresh failed, clear auth and redirect to login
            clearAuth();
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }
    }

    // Check for no token error
    if (result.message === 'there is no access token') {
        clearAuth();
        window.location.href = '/login';
        throw new Error('Please login to continue.');
    }

    // Check for other errors
    if (!response.ok || result.errors || result.error || result.message) {
        throw new Error(
            result.errors?.errors?.[0]?.msg ||
            result.error ||
            result.message ||
            'Request failed'
        );
    }

    return result;
}

/**
 * Get all users (admin only)
 */
export async function getUsers(): Promise<UserData[]> {
    const result = await fetchWithAuth<{ users?: UserData[] } | UserData[]>(
        `${API_BASE_URL}/users`,
        { method: 'GET' }
    );
    return Array.isArray(result) ? result : result.users || [];
}

/**
 * Get single user by ID
 */
export async function getUserById(userId: string): Promise<UserData> {
    const result = await fetchWithAuth<{ user?: UserData } | UserData>(
        `${API_BASE_URL}/users/${userId}`,
        { method: 'GET' }
    );
    return 'user' in result ? result.user! : result;
}

/**
 * Update user by ID
 */
export async function updateUser(userId: string, data: UpdateUserData): Promise<UserData> {
    const result = await fetchWithAuth<{ user?: UserData } | UserData>(
        `${API_BASE_URL}/users/${userId}`,
        {
            method: 'PUT',
            body: JSON.stringify(data),
        }
    );
    return 'user' in result ? result.user! : result;
}

/**
 * Delete user by ID (admin only)
 */
export async function deleteUser(userId: string): Promise<void> {
    await fetchWithAuth<unknown>(
        `${API_BASE_URL}/users/${userId}`,
        { method: 'DELETE' }
    );
}
