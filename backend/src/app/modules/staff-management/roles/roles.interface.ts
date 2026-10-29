export type RoleType = "ADMIN" | "SALES" | "MANAGER" | "BACK_OFFICE";

export interface IRole {
    name: string;
    roleType: RoleType;
    description?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}