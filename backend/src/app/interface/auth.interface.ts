export interface IJwtPayload {
    userId: string
    role: "admin" | "super_admin"
}