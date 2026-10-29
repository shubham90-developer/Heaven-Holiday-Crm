import { Types } from "mongoose";

export interface IPackage {
  packageName: string;
  packageMode: string;
  packageType: "Domestic" | "Inbound" | "International";

  startingFrom: string;
  endCity: string;
  destinationCovered: string;
  supplier: string;

  categories: string[];
  theme: string;
  inclusives: string[];

  specification: string;

  image?: string;
  youtubeUrl?: string;

  overview?: string;

//   createdBy: Types.ObjectId;
}