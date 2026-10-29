"use client";

import React from "react";
import toast from "react-hot-toast";
import FlightItineraryForm from "./itinerary/FlightItineraryForm";
import TransportItineraryForm from "./itinerary/TransportItineraryForm";
import AccommodationItineraryForm from "./itinerary/AccommodationItineraryForm";
import SightseeingItineraryForm from "./itinerary/SightseeingItineraryForm";
import CruiseItineraryForm from "./itinerary/CruiseItineraryForm";
import GuideItineraryForm from "./itinerary/GuideItineraryForm";
import MealsItineraryForm from "./itinerary/MealsItineraryForm";
import VisaItineraryForm from "./itinerary/VisaItineraryForm";
import OthersItineraryForm from "./itinerary/OthersItineraryForm";
import { ItineraryTypeOption } from "../../types/itineraryTypes";
import { DayItinerary, PackageBookingFormData } from "../../types/packageBooking";

type Props = {
    form: PackageBookingFormData;
    day: DayItinerary;
    onUpdateDay: (dayNumber: number, updates: Partial<DayItinerary>) => void;
    onCancel?: () => void;
};

const ItinerarySection = ({ form, day, onUpdateDay, onCancel }: Props) => {
    const itineraryType = (day.itineraryType || "Flight") as ItineraryTypeOption;

    const handleSave = (field: keyof DayItinerary, data: unknown) => {
        onUpdateDay(day.dayNumber, { [field]: data });
        toast.success(`${itineraryType} itinerary saved`);
    };

    const handleCancel = () => {
        onCancel?.();
        toast("Changes discarded", { icon: "↩️" });
    };

    const hotelCity = form.hotelStayCities[0];
    const city =
        hotelCity?.cityName ||
        day.location ||
        form.goingTo.split("(")[0]?.trim() ||
        form.goingTo;

    switch (itineraryType) {
        case "Flight":
            return (
                <FlightItineraryForm
                    value={day.flight}
                    travelers={form.travelers}
                    goingFrom={form.goingFrom}
                    goingTo={form.goingTo}
                    travelDate={day.date || form.travelDate}
                    onSave={(data) => handleSave("flight", data)}
                    onCancel={handleCancel}
                />
            );
        case "Transport":
            return (
                <TransportItineraryForm
                    value={day.transport}
                    goingFrom={form.goingFrom}
                    travelDate={day.date || form.travelDate}
                    onSave={(data) => handleSave("transport", data)}
                    onCancel={handleCancel}
                />
            );
        case "Accommodation":
            return (
                <AccommodationItineraryForm
                    value={day.accommodation}
                    city={city}
                    checkIn={hotelCity?.checkIn || day.date || form.travelDate}
                    nights={hotelCity?.nights || 1}
                    travelers={form.travelers}
                    onSave={(data) => handleSave("accommodation", data)}
                    onCancel={handleCancel}
                />
            );
        case "Sightseeings":
            return (
                <SightseeingItineraryForm
                    value={day.sightseeing}
                    destination={form.goingTo}
                    travelers={form.travelers}
                    onSave={(data) => handleSave("sightseeing", data)}
                    onCancel={handleCancel}
                />
            );
        case "Cruise":
            return (
                <CruiseItineraryForm
                    value={day.cruise}
                    goingFrom={form.goingFrom}
                    goingTo={form.goingTo}
                    travelDate={day.date || form.travelDate}
                    travelers={form.travelers}
                    onSave={(data) => handleSave("cruise", data)}
                    onCancel={handleCancel}
                />
            );
        case "Guide":
            return (
                <GuideItineraryForm
                    value={day.guide}
                    onSave={(data) => handleSave("guide", data)}
                    onCancel={handleCancel}
                />
            );
        case "Meals":
            return (
                <MealsItineraryForm
                    value={day.mealsItinerary}
                    onSave={(data) => handleSave("mealsItinerary", data)}
                    onCancel={handleCancel}
                />
            );
        case "Visa":
            return (
                <VisaItineraryForm
                    value={day.visaItinerary}
                    travelers={form.travelers}
                    onSave={(data) => handleSave("visaItinerary", data)}
                    onCancel={handleCancel}
                />
            );
        case "Others":
            return (
                <OthersItineraryForm
                    value={day.others}
                    travelers={form.travelers}
                    onSave={(data) => handleSave("others", data)}
                    onCancel={handleCancel}
                />
            );
        default:
            return null;
    }
};

export default ItinerarySection;
