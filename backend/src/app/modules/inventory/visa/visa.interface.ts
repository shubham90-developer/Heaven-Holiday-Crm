export interface IMarkup {
  marketPlace: "B2C" | "B2B";
  currency: string;
  markUpType: "Amount" | "Percentage";
  adult: number;
  child: number;
  infant: number;
}

export interface IServiceProvider {
  display: boolean;
  serviceName: string;
  currency: string;
  fees: number;
  markup: number;
  taxable: boolean;
}

export interface IVisa {
  travelerNationality: string;
  countriesCovered: string;

  visaName: string;
  visaType: "e Visa" | "Sticker Visa";
  visaCategory: "Tourism" | "Business";
  entryType: "Single Entry" | "Multiple Entry";

  processingTime: string;
  passportExpireDays: number;
  validityDays: number;
  duration: string;

  supplier: string;
  embassyFeeCurrency: string;

  adultFee: number;
  childFee: number;
  childAge: number;
  infantFee: number;

  markup: IMarkup[];
  serviceProviders: IServiceProvider[];
}