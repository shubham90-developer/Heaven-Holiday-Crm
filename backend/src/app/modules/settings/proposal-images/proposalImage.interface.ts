export type ProposalImageCategory = "destination" | "sightseeing";
export type ProposalImageStatus = "Active" | "Inactive";

export interface IProposalImageFile {
    fileName: string;
    url: string;
    originalName: string;
    mimeType: string;
    size: number;
}

export interface IProposalImage {
    category: ProposalImageCategory;
    name: string;
    city?: string;
    images: IProposalImageFile[];
    status: ProposalImageStatus;
    enabled: boolean;
    isDeleted: boolean;
}
