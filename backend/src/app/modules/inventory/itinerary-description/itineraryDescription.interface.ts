export interface IItinerary {
  startCity: string;
  destinationCity: string;
  title: string;
  status?: "Active" | "Inactive";
  createdAt?: Date;
  updatedAt?: Date;
}