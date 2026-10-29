export type TRole = 'super_admin' | 'admin'

export interface IUser {
    name: string
    email: string
    password: string
    role: TRole
}