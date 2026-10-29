import {
    PackageBookingFormData,
    formatDisplayDate,
    getCustomerName,
} from "../../types/packageBooking";

export type PdfSectionKey =
    | "coverPage"
    | "tripSnapshot"
    | "routePlan"
    | "accommodationDetails"
    | "transfersDetails"
    | "priceDetails"
    | "tripSummary"
    | "detailedItinerary"
    | "flightDetails"
    | "sightseeingDetails"
    | "howToBook";

export type PdfSectionOptions = Record<PdfSectionKey, boolean>;

export const PDF_SECTION_LABELS: { key: PdfSectionKey; label: string }[] = [
    { key: "coverPage", label: "Cover page" },
    { key: "tripSnapshot", label: "Trip Snapshot" },
    { key: "routePlan", label: "Route Plan" },
    { key: "accommodationDetails", label: "Accommodation Details" },
    { key: "transfersDetails", label: "Transfers Details" },
    { key: "priceDetails", label: "Price Details" },
    { key: "tripSummary", label: "Trip Summary" },
    { key: "detailedItinerary", label: "Detailed Itinerary" },
    { key: "flightDetails", label: "Flight Details" },
    { key: "sightseeingDetails", label: "Sightseeing Details" },
    { key: "howToBook", label: "How to Book" },
];

export const DEFAULT_PDF_SECTIONS: PdfSectionOptions = {
    coverPage: true,
    tripSnapshot: false,
    routePlan: false,
    accommodationDetails: true,
    transfersDetails: true,
    priceDetails: true,
    tripSummary: false,
    detailedItinerary: true,
    flightDetails: true,
    sightseeingDetails: true,
    howToBook: true,
};

const addDays = (dateStr: string, days: number) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
};

const formatShortDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    const dd = String(date.getDate()).padStart(2, "0");
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return `${dd} ${months[date.getMonth()]}`;
};

const stripHtml = (html?: string) =>
    (html || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

const formatCurrency = (booking: PackageBookingFormData, amount: number) =>
    `${booking.currency || "INR"} ${Number(amount || 0).toLocaleString("en-IN")}`;

export const buildProposalEmailPreview = (
    booking: PackageBookingFormData,
    customerName: string,
    destination: string
) => {
    const totalDays = booking.noOfDays || booking.days?.length || 1;
    const travelers = booking.travelers || 1;
    const checkOut =
        booking.hotelStayCities?.[booking.hotelStayCities.length - 1]?.checkOut ||
        addDays(booking.travelDate, Math.max(totalDays - 1, 0));
    const total = Number(
        booking.sellingPrice || booking.totalSalesPrice || 0
    );
    const days =
        booking.days?.length > 0
            ? [...booking.days].sort((a, b) => a.dayNumber - b.dayNumber)
            : [];

    const dayLines = days.length
        ? days
              .map((day) => {
                  const dayDate =
                      day.date ||
                      addDays(booking.travelDate, day.dayNumber - 1);
                  return `📅 DAY ${day.dayNumber} - ${formatShortDate(dayDate)}`;
              })
              .join("\n")
        : Array.from({ length: totalDays }, (_, i) => {
              const dayDate = addDays(booking.travelDate, i);
              return `📅 DAY ${i + 1} - ${formatShortDate(dayDate)}`;
          }).join("\n");

    return `Dear ${customerName},

Greetings from A HEAVEN HOSPITALITY PVT LTD!

📍 ${destination.toUpperCase()} + ITINERARY
📅 ${formatShortDate(booking.travelDate)} - ${formatShortDate(checkOut)}
👥 No of Pax: ${travelers} Adult(s)

${dayLines}

💰 PRICING
Total Price for ${travelers} Pax: ${formatCurrency(booking, total)}/-

To view hotels and program in details and book online click on the below link:
https://heavenholidays.in/proposal/${booking.proposalId || booking._id || ""}

Regards,
A HEAVEN HOSPITALITY
${booking.customerDetails?.mobile ? `Phone: ${booking.customerDetails.mobile}` : ""}`.trim();
};

type BuildPdfHtmlParams = {
    booking: PackageBookingFormData;
    sections: PdfSectionOptions;
    packageTitle: string;
    customerName: string;
    destination: string;
    taxIncl: boolean;
};

const sectionHeading = (title: string) =>
    `<div style="background:#5a5a5a;color:#fff;padding:8px 12px;font-weight:600;margin:16px 0 8px;">${title}</div>`;

export const buildProposalPdfHtml = ({
    booking,
    sections,
    packageTitle,
    customerName,
    destination,
    taxIncl,
}: BuildPdfHtmlParams) => {
    const totalDays = booking.noOfDays || booking.days?.length || 1;
    const nights = Math.max(totalDays - 1, 0);
    const travelers = booking.travelers || 1;
    const total = Number(
        booking.sellingPrice || booking.totalSalesPrice || 0
    );
    const days =
        booking.days?.length > 0
            ? [...booking.days].sort((a, b) => a.dayNumber - b.dayNumber)
            : [];

    const parts: string[] = [];

    if (sections.coverPage) {
        parts.push(`
            <div style="text-align:center;padding:40px 20px;border:1px solid #ddd;margin-bottom:20px;">
                <h1 style="color:#1e3a5f;margin:0 0 8px;">A HEAVEN HOSPITALITY PVT LTD</h1>
                <h2 style="color:#e65100;margin:0 0 16px;">${packageTitle}</h2>
                <p style="font-size:14px;margin:4px 0;">Prepared for: <strong>${customerName}</strong></p>
                <p style="font-size:14px;margin:4px 0;">Destination: <strong>${destination}</strong></p>
                <p style="font-size:14px;margin:4px 0;">${nights}N / ${totalDays}D · ${travelers} Traveler(s)</p>
                <p style="font-size:14px;margin:4px 0;">Travel Date: ${formatDisplayDate(booking.travelDate) || "—"}</p>
            </div>
        `);
    }

    if (sections.tripSnapshot) {
        parts.push(sectionHeading("Trip Snapshot"));
        parts.push(`
            <p><strong>From:</strong> ${booking.goingFrom || "—"}</p>
            <p><strong>To:</strong> ${booking.goingTo || destination}</p>
            <p><strong>End Destination:</strong> ${booking.endDestination || "—"}</p>
            <p><strong>Package Type:</strong> ${booking.packageType || "—"}</p>
        `);
    }

    if (sections.routePlan && booking.hotelStayCities?.length) {
        parts.push(sectionHeading("Route Plan"));
        parts.push("<ul>");
        booking.hotelStayCities.forEach((city) => {
            parts.push(
                `<li>${city.cityName} — ${city.nights} night(s) (${formatDisplayDate(city.checkIn)} to ${formatDisplayDate(city.checkOut)})</li>`
            );
        });
        parts.push("</ul>");
    }

    if (sections.tripSummary) {
        parts.push(sectionHeading("Trip Summary"));
        parts.push(
            `<p>${destination} package for ${customerName}. ${nights} nights / ${totalDays} days with ${travelers} traveler(s).</p>`
        );
    }

    if (sections.detailedItinerary) {
        parts.push(sectionHeading("Detailed Itinerary"));
        if (days.length) {
            days.forEach((day) => {
                const dayDate =
                    day.date ||
                    addDays(booking.travelDate, day.dayNumber - 1);
                parts.push(
                    `<div style="margin-bottom:12px;padding:10px;border:1px solid #eee;">
                        <strong>Day ${day.dayNumber} (${formatDisplayDate(dayDate)})</strong>
                        ${day.title ? `<div>${day.title}</div>` : ""}
                        ${day.description ? `<div>${day.description}</div>` : ""}
                    </div>`
                );
            });
        } else {
            parts.push("<p>No itinerary days added.</p>");
        }
    }

    if (sections.flightDetails && booking.flightCost?.total > 0) {
        parts.push(sectionHeading("Flight Details"));
        parts.push(`
            <p>Flight Cost: ${formatCurrency(booking, booking.flightCost.cost)}</p>
            <p>Flight Mark Up: ${formatCurrency(booking, booking.flightCost.markup)}</p>
            <p>Total Flight Cost: ${formatCurrency(booking, booking.flightCost.total)}</p>
        `);
    }

    if (sections.accommodationDetails && booking.hotelStayCities?.length) {
        parts.push(sectionHeading("Accommodation Details"));
        parts.push("<ul>");
        booking.hotelStayCities.forEach((city) => {
            parts.push(
                `<li>${city.cityName}: Check-in ${formatDisplayDate(city.checkIn)}, Check-out ${formatDisplayDate(city.checkOut)} (${city.nights} nights)</li>`
            );
        });
        parts.push("</ul>");
    }

    if (sections.transfersDetails) {
        const transferDays = days.filter((d) => d.itineraryType === "Transport");
        if (transferDays.length) {
            parts.push(sectionHeading("Transfers Details"));
            transferDays.forEach((day) => {
                parts.push(
                    `<p>Day ${day.dayNumber}: ${stripHtml(day.description) || day.title || "Transfer included"}</p>`
                );
            });
        }
    }

    if (sections.sightseeingDetails) {
        const sightDays = days.filter(
            (d) => d.itineraryType === "Sightseeings" || Boolean(d.sightseeing)
        );
        if (sightDays.length) {
            parts.push(sectionHeading("Sightseeing Details"));
            sightDays.forEach((day) => {
                parts.push(
                    `<p>Day ${day.dayNumber}: ${stripHtml(day.description) || day.title || "Sightseeing"}</p>`
                );
            });
        }
    }

    if (sections.priceDetails) {
        parts.push(sectionHeading("Price Details"));
        parts.push(`
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr><td style="padding:6px;border:1px solid #ddd;">Land Package</td><td style="padding:6px;border:1px solid #ddd;">${formatCurrency(booking, booking.landPackageCost?.total || 0)}</td></tr>
                <tr><td style="padding:6px;border:1px solid #ddd;">Flight</td><td style="padding:6px;border:1px solid #ddd;">${formatCurrency(booking, booking.flightCost?.total || 0)}</td></tr>
                <tr><td style="padding:6px;border:1px solid #ddd;">Visa</td><td style="padding:6px;border:1px solid #ddd;">${formatCurrency(booking, booking.visaCost?.total || 0)}</td></tr>
                <tr><td style="padding:6px;border:1px solid #ddd;"><strong>Total Sales Price</strong></td><td style="padding:6px;border:1px solid #ddd;"><strong>${formatCurrency(booking, total)}${taxIncl ? " (Tax Incl.)" : ""}</strong></td></tr>
                <tr><td style="padding:6px;border:1px solid #ddd;">Advance</td><td style="padding:6px;border:1px solid #ddd;">${formatCurrency(booking, booking.advance || 0)}</td></tr>
                <tr><td style="padding:6px;border:1px solid #ddd;">Balance</td><td style="padding:6px;border:1px solid #ddd;">${formatCurrency(booking, booking.totalBalance || 0)}</td></tr>
            </table>
        `);
    }

    if (sections.howToBook) {
        parts.push(sectionHeading("How to Book"));
        parts.push(`
            <p>Contact A HEAVEN HOSPITALITY to confirm your booking.</p>
            <p>Advance required: ${booking.advanceRequiredPercent || 10}%</p>
            <p>Payment mode: ${booking.paymentMode || "—"}</p>
            ${booking.terms?.bookingTerms ? `<p>${booking.terms.bookingTerms}</p>` : ""}
        `);
    }

    if (!parts.length) {
        parts.push("<p>No sections selected for download.</p>");
    }

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${packageTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #222; padding: 24px; font-size: 13px; line-height: 1.5; }
    @media print { body { padding: 12px; } }
  </style>
</head>
<body>
  ${parts.join("\n")}
</body>
</html>`;
};

export const downloadProposalPdf = (html: string, fileName: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        throw new Error("Popup blocked");
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 300);
};

export const getProposalCustomerName = (booking: PackageBookingFormData) =>
    getCustomerName(booking.customerDetails) || "Customer";
