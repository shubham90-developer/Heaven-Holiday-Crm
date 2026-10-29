export type ThemeStatus = "Active" | "Inactive";

export interface ITheme {
    title: string;
    status: ThemeStatus;
    enabled: boolean;
    sortOrder: number;
    isDeleted: boolean;
}
