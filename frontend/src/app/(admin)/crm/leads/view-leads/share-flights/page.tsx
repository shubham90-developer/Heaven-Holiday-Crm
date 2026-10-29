"use client";
import { Suspense } from "react";
import ShareFlights from "../ShareFlights"; // correct — one level up from share-flights/
export default function ShareFlightsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShareFlights />
        </Suspense>
    );
}