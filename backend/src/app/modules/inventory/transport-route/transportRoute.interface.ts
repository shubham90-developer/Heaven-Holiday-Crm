export interface ITransportRoute {
    category: string;
    transferTypes?: string[];

    transportType?: string;

    startCity?: string;
    destinationCity?: string;
    routeName?: string;

    citiesIncluded?: {
        city: string;
        noOfDays: number;
        destinationsCovered: string;
        sightseeingCovered: string;
    }[];

    description: string;

    pickupPointArea?: string;
    dropPointArea?: string;

    region?: string;
    state?: string;
    country?: string;

    vehicleCostType: string;

    currency: string;

    seasons: {
        from: string;
        to: string;
        markUpType: string;
        b2c: number;
        b2b: number;
    }[];

    website: boolean;
}