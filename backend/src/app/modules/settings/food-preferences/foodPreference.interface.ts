export type FoodPreferenceStatus = "Active" | "Inactive";

export interface IFoodPreference {
    title: string;
    status: FoodPreferenceStatus;
    enabled: boolean;
    sortOrder: number;
    isDeleted: boolean;
}
