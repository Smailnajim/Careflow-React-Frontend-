export type UserStatus = 'active' | 'inactive' | 'pending';

export interface UserData {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateNasonse?: string;
    image?: string;
    status?: UserStatus;
    roleName?: string;
}

export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateNasonse?: string;
    image?: string;
    status?: UserStatus;
    roleName?: string;
}
