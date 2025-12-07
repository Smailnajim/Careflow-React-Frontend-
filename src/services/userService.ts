import type { UserData, UpdateUserData } from '../interfaces/IUser';
import { getAccessToken } from './authService';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Get authorization headers with access token
 * Backend expects: Authorization: "Bearer Bearer <token>" and uses split(' ')[2]
 */
function getAuthHeaders(): HeadersInit {
    const token = getAccessToken();
    return {
        'Content-Type': 'application/json',
        // Your backend uses split(' ')[2], so we send "Bearer Bearer <token>"
        ...(token ? { 'Authorization': `Bearer Bearer ${token}` } : {}),
    };
}

/**
 * Get all users (admin only)
 */
export async function getUsers(): Promise<UserData[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to fetch users');
    }

    const result = await response.json();

    if (result.errors || result.error || result.message) {
        throw new Error(result.errors?.errors?.[0]?.msg || result.error || result.message || 'Failed to fetch users');
    }

    return result.users || result;
}

/**
 * Get single user by ID
 */
export async function getUserById(userId: string): Promise<UserData> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to fetch user');
    }

    const result = await response.json();

    if (result.errors || result.error || result.message) {
        throw new Error(result.errors?.errors?.[0]?.msg || result.error || result.message || 'Failed to fetch user');
    }

    return result.user || result;
}

/**
 * Update user by ID
 */
export async function updateUser(userId: string, data: UpdateUserData): Promise<UserData> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to update user');
    }

    const result = await response.json();

    if (result.errors || result.error || result.message) {
        throw new Error(result.errors?.errors?.[0]?.msg || result.error || result.message || 'Failed to update user');
    }

    return result.user || result;
}

/**
 * Delete user by ID (admin only)
 */
export async function deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to delete user');
    }

    const result = await response.json();

    if (result.errors || result.error || result.message) {
        throw new Error(result.errors?.errors?.[0]?.msg || result.error || result.message || 'Failed to delete user');
    }
}
