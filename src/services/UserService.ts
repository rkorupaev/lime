// @ts-nocheck
import axiosInstance from "../utils/axiosInstance";

const BASE_AUTH_URL = '/api/auth/v1/';

export interface CurrentUser {
    id: number,
    username: string,
    is_active: boolean,
    is_superuser: boolean,
    created_at: string,
    last_modified: string,
    roles_with_permissions: Role[],
};

export interface Role {
    id: number,
    name: string,
    permissions: Permission[],
}

export interface Permission {
    id: number,
    public_name: string,
    name: string,
}

export default class UserService {
    static async getCurrentUser(): Promise<CurrentUser> {
        return await axiosInstance.get(BASE_AUTH_URL + 'users/me');
    }

    static async changeUserPassword(password: string): Promise<CurrentUser> {
        return await axiosInstance.patch(BASE_AUTH_URL + 'users/me', {
            password
        });
    }
}
