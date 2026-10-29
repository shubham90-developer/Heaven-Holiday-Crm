import { Document } from "mongoose";

export interface IRestaurant extends Document {
    city: string;
    address: string;
    restaurantArea: string;
    supplierName: string;
    currency: string;
    mealName: string;
    preferred: boolean;
    veg: boolean;
    nonVeg: boolean;
    ai: boolean;
}