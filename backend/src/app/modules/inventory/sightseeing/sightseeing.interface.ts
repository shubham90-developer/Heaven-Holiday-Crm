import { Document } from "mongoose";

export interface ISightseeing extends Document {
  country: string;
  city: string;
  sightseeingName: string;
  latitude: string;
  longitude: string;
  image?: string;
  address: string;
  isUnique: boolean;

  details: string;

  category: string;
  activities: string;
  difficultyLevel: string;
  season: string;
  daysOfWeek: string;
  popularity: string;
  thingsToCarry: string;
  pickupPoint: string;
  pickupTime: string;

  minPax: number;
  maxPax: number;

  durationDays: number;
  durationMinutes: number;

  minAge: number;
  maxAge: number;

  operatingTime: {
    from: string;
    to: string;
  }[];

  otherInclusions: string;
  advisory: string;
  cancellationPolicy: string;
  refundPolicy: string;
  confirmationPolicy: string;
  termsConditions: string;
}