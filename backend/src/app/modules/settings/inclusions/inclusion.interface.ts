export type InclusionStatus = "Active" | "Inactive";

export interface IInclusion {
    title: string;
    status: InclusionStatus;
    enabled: boolean;
    sortOrder: number;
    isDeleted: boolean;
}
