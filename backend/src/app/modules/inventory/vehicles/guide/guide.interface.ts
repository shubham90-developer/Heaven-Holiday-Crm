export interface IGuideRate {
  currency: string;
  perDayRate: number;
  overnightCharges: number;
  markupType: "Percentage" | "Flat";
  markup: number;
  taxes: number;
  total: number;
}

export interface IGuide {
  guideName: string;
  destination: string;
  mobileNumber: string;
  email?: string;
  languages: string;
  image?: string;
  description?: string;
  rates: IGuideRate;
}