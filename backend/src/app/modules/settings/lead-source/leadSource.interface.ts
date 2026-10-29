export type LeadSourceStatus = "Active" | "Inactive";

export interface ILeadSource {
  leadId: number; // unique, auto-generated (e.g. 9001)
  title: string; // Lead Source Name
  isDefaultAssignLead: boolean;
  enabled: boolean;
  status: LeadSourceStatus;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean
}