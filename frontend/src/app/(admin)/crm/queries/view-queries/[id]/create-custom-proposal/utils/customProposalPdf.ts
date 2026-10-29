export type PdfHotelCity = {
  hotelCity: string;
  hotelName: string;
  checkIn: string;
  nights: number;
  finalCost?: number;
  rooms: Array<{
    sharing: string;
    roomType: string;
    mealPlan: string;
  }>;
};

export type PdfFlightLeg = {
  airlineName: string;
  airlineNo: string;
  departureDate: string;
  arrivalDate: string;
  from: string;
  to: string;
  stops: string;
  duration?: string;
};

export type PdfDay = {
  dayNumber: number;
  label: string;
  city: string;
  title: string;
  description: string;
  sicSightseeing?: string;
  pvtSightseeing?: string;
};

export type PdfPolicies = {
  notes?: string;
  inclusions: string;
  exclusions: string;
  cancellationPolicy: string;
  termsAndConditions: string;
  bookingTerms?: string;
  paymentTerms?: string;
};

export type PdfAiDay = {
  dayNumber: number;
  title: string;
  description: string;
  meals: string;
  sightseeing: string;
  activityTitle: string;
  activityDescription: string;
  imageUrls: string[];
};

export type PdfAiActivity = {
  dayNumber: number;
  name: string;
  city: string;
  description: string;
  imageUrl: string;
};

export type CustomProposalFormSnapshot = {
  hotels: PdfHotelCity[];
  hotelTotal: number;
  days: PdfDay[];
  flights: PdfFlightLeg[];
  flightTotal: number;
};

export type CustomProposalPdfModel = {
  customerName: string;
  destinations: string;
  goingFrom: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  daysCount: number;
  adults: number;
  currency: string;
  overview: string;
  hotels: PdfHotelCity[];
  flights: PdfFlightLeg[];
  days: PdfDay[];
  policies: PdfPolicies;
  companyName: string;
  consultantName: string;
  consultantPhone: string;
  companyLogo?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyPhone?: string;
  bank?: {
    accountHolderName?: string;
    bankName?: string;
    branch?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  googlePay?: string;
  phonePay?: string;
  pricePerPerson: number;
  totalCost: number;
  gstAmount: number;
  grandTotal: number;
  ai?: {
    coverImageUrl?: string;
    days?: PdfAiDay[];
    activities?: PdfAiActivity[];
  };
};

const esc = (value?: string | number | null) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const stripHtml = (html?: string) =>
  (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const htmlToList = (html?: string) => {
  if (!html) return "";
  const items = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((match) =>
    stripHtml(match[1])
  );
  if (items.length) {
    return items.map((item) => `<li>${esc(item)}</li>`).join("");
  }
  const text = stripHtml(html);
  if (!text) return "";
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => `<li>${esc(line)}</li>`)
    .join("");
};

const formatLongDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const parsePlace = (value?: string) => {
  const raw = (value || "").trim();
  const match = raw.match(/\(([A-Z]{3})\)/);
  return {
    city: raw.replace(/\s*\([A-Z]{3}\)\s*/g, "").trim() || raw,
    code: match?.[1] || "",
  };
};

const money = (currency: string, amount: number) =>
  `${currency} ${Number(amount || 0).toLocaleString("en-IN")}`;

const heading = (title: string) => `
  <div class="pdf-heading">
    <span class="pdf-heading-line"></span>
    <h2>${esc(title)}</h2>
    <span class="pdf-heading-line"></span>
  </div>`;

const leftHeading = (title: string) => `
  <div class="pdf-heading pdf-heading-left">
    <h2>${esc(title)}</h2>
    <span class="pdf-heading-line"></span>
  </div>`;

const formatDateTime = (value?: string) => {
  if (!value) return { date: "—", time: "", code: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { date: value, time: "", code: "" };
  }
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return { date: `${dd}/${mm}/${yyyy}`, time: `${hh}:${min}`, code: "" };
};

const durationBetween = (dep?: string, arr?: string) => {
  if (!dep || !arr) return "";
  const start = new Date(dep).getTime();
  const end = new Date(arr).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return "";
  const minutes = Math.round((end - start) / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${String(mins).padStart(2, "0")}m`;
};

const planeIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z"/></svg>`;
const bedIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#555" stroke-width="1.6"><path d="M3 18V8h2v4h9V8h7v10"/><path d="M3 14h18"/></svg>`;
const carIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#555" stroke-width="1.6"><path d="M5 16l1.5-5h11L19 16"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/><path d="M4 16h16v2H4z"/></svg>`;
const binocIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#555" stroke-width="1.6"><circle cx="7" cy="14" r="4"/><circle cx="17" cy="14" r="4"/><path d="M11 14h2M9 10l2-5h2l2 5"/></svg>`;
const dotsIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="#555"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>`;

const pdfImg = (src: string | undefined, className: string, alt: string) => {
  if (!src) {
    return `<div class="${className} pdf-img-fallback" role="img" aria-label="${esc(alt)}"></div>`;
  }
  return `<img class="${className}" src="${esc(src)}" alt="${esc(alt)}" referrerpolicy="no-referrer" />`;
};

const includeItem = (icon: string, label: string) => `
  <div class="pdf-include">
    <div class="pdf-include-icon">${icon}</div>
    <div>${esc(label)}</div>
  </div>`;

export const buildCustomProposalPdfHtml = (data: CustomProposalPdfModel) => {
  const destList = data.destinations
    .split(/[,/|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const mainDest = destList[0] || data.destinations || "Destination";
  const tripTitle = `${esc(data.customerName)}'s Trip to ${esc(mainDest.split("(")[0].trim())}`;
  const hotels = data.hotels.filter((h) => h.hotelName || h.hotelCity);
  const flights = data.flights.filter((f) => f.from || f.to || f.airlineName);
  const aiDays = data.ai?.days || [];
  const activities = data.ai?.activities || [];
  const roomCount = Math.max(
    1,
    hotels.reduce((sum, hotel) => sum + (hotel.rooms?.length || 1), 0)
  );
  const sharing = hotels[0]?.rooms?.[0]?.sharing || "Twin Sharing";
  const roomType = hotels[0]?.rooms?.[0]?.roomType || "Standard";
  const mealPlan = hotels[0]?.rooms?.[0]?.mealPlan || "CP";

  const hotelSummary = hotels
    .map(
      (hotel) =>
        `${esc(hotel.hotelCity || mainDest)} (${hotel.nights || 1}N) - ${esc(hotel.hotelName || "Hotel")}`
    )
    .join("<br/>") || `${esc(mainDest)} hotel stay as per itinerary`;

  const flightSummary = flights.length
    ? flights
        .map((leg) => `${esc(leg.from || data.goingFrom)} to ${esc(leg.to || mainDest)} (Flight)`)
        .join(" | ")
    : `${esc(data.goingFrom || "Origin")} to ${esc(mainDest)} (Flight)`;

  const sightseeingByCity: Record<string, string[]> = {};
  activities.forEach((item) => {
    const city = item.city || mainDest;
    sightseeingByCity[city] = sightseeingByCity[city] || [];
    if (item.name) sightseeingByCity[city].push(item.name);
  });
  if (!Object.keys(sightseeingByCity).length) {
    destList.forEach((city) => {
      sightseeingByCity[city] = data.days
        .filter((day) => (day.city || city) === city)
        .map((day) => day.title)
        .filter(Boolean);
    });
  }

  const flightCards = flights
    .map((leg) => {
      const dep = formatDateTime(leg.departureDate);
      const arr = formatDateTime(leg.arrivalDate);
      const fromPlace = parsePlace(leg.from || data.goingFrom);
      const toPlace = parsePlace(leg.to || mainDest);
      const duration = durationBetween(leg.departureDate, leg.arrivalDate) || leg.duration || "";
      const stops = /non/i.test(leg.stops || "") ? "No Stops" : leg.stops || "No Stops";
      return `
        <div class="pdf-flight-card">
          <div class="pdf-flight-top">
            <div class="pdf-plane">${planeIcon}</div>
            <div>${esc(fromPlace.city)} - ${esc(toPlace.city)}</div>
          </div>
          <div class="pdf-flight-route"><strong>${esc(fromPlace.city)} - ${esc(toPlace.city)} - ${esc(stops)}.</strong></div>
          <div class="pdf-flight-grid">
            <div>
              <div>${esc(leg.airlineName || "Airline")}</div>
              <div class="muted">${esc(leg.airlineNo || "")}</div>
            </div>
            <div>
              <div class="muted">${esc([fromPlace.code, dep.time].filter(Boolean).join(" "))}</div>
              <div class="strong">${esc(dep.date)}</div>
              <div class="muted">${esc(fromPlace.city)}</div>
            </div>
            <div class="pdf-duration">
              <div class="muted">◷</div>
              <div class="muted">${esc(duration)}</div>
            </div>
            <div>
              <div class="muted">${esc([arr.time, toPlace.code].filter(Boolean).join(" "))}</div>
              <div class="strong">${esc(arr.date)}</div>
              <div class="muted">${esc(toPlace.city)}</div>
            </div>
          </div>
        </div>`;
    })
    .join("");

  const itineraryHtml = data.days
    .map((day) => {
      const ai = aiDays.find((item) => item.dayNumber === day.dayNumber);
      const images = ai?.imageUrls || [];
      const hotel = hotels.find((item) =>
        (item.hotelCity || "").toLowerCase().includes((day.city || "").split("(")[0].trim().toLowerCase())
      ) || hotels[0];
      const title = (day.title || ai?.title || `DAY ${day.dayNumber}`).toUpperCase();
      const description = stripHtml(day.description) || ai?.description || stripHtml(data.overview) || `Day ${day.dayNumber} in ${day.city || mainDest}.`;
      const meals = ai?.meals || (day.dayNumber === 1 ? "Lunch, Dinner" : "Breakfast, Lunch, Dinner");
      const sightseeing = ai?.sightseeing || day.sicSightseeing || day.pvtSightseeing || "";
      const thumb = images[0] || data.ai?.coverImageUrl || "";
      const grid = images.slice(0, 5);
      const flightLeg = day.dayNumber === 1 ? flights[0] : day.dayNumber === data.days.length ? flights[1] : null;
      const flightTime = flightLeg ? formatDateTime(flightLeg.departureDate).time : "";

      return `
        <div class="pdf-day">
          <div class="pdf-day-head">
            ${pdfImg(thumb, "pdf-thumb", day.city || mainDest)}
            <div>
              <div class="strong">Day ${day.dayNumber}</div>
              <div>${esc(day.label)}</div>
              <div>${esc(day.city || mainDest)}</div>
            </div>
          </div>
          <div class="pdf-day-title">${esc(title)}</div>
          ${
            grid.length
              ? `<div class="pdf-photo-grid">
                  ${pdfImg(grid[0], "hero", title)}
                  <div class="pdf-photo-small">
                    ${grid.slice(1, 5).map((src) => pdfImg(src, "", day.city || mainDest)).join("")}
                  </div>
                </div>`
              : ""
          }
          <p class="pdf-copy">${esc(description)}</p>
          <div class="pdf-box">
            ${flightTime ? `<div><strong>${esc(flightTime)} : Flight</strong> Depart From ${esc(flightLeg?.from || data.goingFrom)} to ${esc(flightLeg?.to || day.city || mainDest)}</div>` : ""}
            <div><strong>Accommodation :</strong> ${esc(hotel?.hotelName || "Hotel as per itinerary")}</div>
            <div><strong>Meal :</strong> ${esc(meals)}</div>
            ${sightseeing ? `<div><strong>Sightseeing :</strong> ${esc(sightseeing)}</div>` : ""}
          </div>
        </div>`;
    })
    .join("");

  const activityHtml = (activities.length ? activities : data.days.map((day) => ({
    dayNumber: day.dayNumber,
    name: day.title || `Day ${day.dayNumber}`,
    city: day.city || mainDest,
    description: stripHtml(day.description) || "",
    imageUrl: "",
  }))).map((item) => {
    const day = data.days.find((d) => d.dayNumber === item.dayNumber);
    return `
      <div class="pdf-activity">
        <div class="pdf-day-head">
          ${pdfImg(item.imageUrl, "pdf-thumb wide", item.name)}
          <div>
            <div>${esc(day?.label || "")}</div>
            <div class="strong">${esc(item.name)}</div>
            <div class="strong">${esc(item.city)}</div>
          </div>
        </div>
        ${item.description ? `<p class="pdf-copy">${esc(item.description)}</p>` : ""}
      </div>`;
  }).join("");

  const defaultInclusions = [
    "Flight",
    `${hotels[0]?.nights || data.nights} Star Hotel Nights accommodation on twin sharing basis as per itinerary`,
    "Meals as per hotel plan",
    "Entrance fees at all monuments and sightseeing spots as per itinerary",
    "All transfers and sightseeing as per the itinerary in an air-conditioned vehicle on sharing basis",
    "Road taxes, parking fees, fuel charges, interstate taxes",
  ].map((line) => `<li>${esc(line)}</li>`).join("");
  const defaultExclusions = [
    "GST if not mentioned in the rates",
    "All personal expenses like tips, laundry, telephone calls/fax, alcoholic beverages, camera/video camera fees at monuments, medical expenses, airport departure tax etc.",
    "Anything not mentioned under Package Inclusions.",
    "Cost incidental to any change in the itinerary/stay on account of flight cancellation due to bad weather, ill health, and roadblocks and/or any factors beyond control.",
    "Travel Insurance if not mentioned in the itinerary",
  ].map((line) => `<li>${esc(line)}</li>`).join("");
  const defaultCancellation = [
    "121 To 900 or more days before: 10% of the total amount",
    "91 to 120 days before: 15% of the total amount",
    "61 To 90 days before: 20% of the total amount",
    "46 To 60 days before: 30% of the total amount",
    "31 To 45 days before: 40% of the total amount",
    "16 To 30 days before: 50% of the total amount",
    "11 To 15 days before: 75% of the total amount",
    "0 To 10 days before 100% (full amount applicable, no refund).",
  ].map((line) => `<li>${esc(line)}</li>`).join("");
  const defaultBookingTerms = [
    "75% advance to be paid at the time of booking to confirm the reservation.",
    "Air fare is calculated at the time of proposal creation and is subject to change at the time of booking.",
    "100% payment within 7 days of booking date.",
    "In case of cancellation, standard cancellation policies will be applicable.",
  ].map((line) => `<li>${esc(line)}</li>`).join("");
  const defaultPaymentTerms = [
    "Payment can be made by IMPS / NEFT / RTGS, cheque or DD in the company account, or through the online payment link.",
    "Advance as per booking terms is required to confirm hotels, flights and other services.",
    "Balance payment must be completed before travel as mentioned in the booking terms.",
    "GST extra if not already included in the quoted package cost.",
  ].map((line) => `<li>${esc(line)}</li>`).join("");

  const notes =
    stripHtml(data.policies.notes) ||
    "Please review the inclusions, exclusions, cancellation policy and terms carefully before confirming your booking. This proposal is subject to availability of hotels, flights and services at the time of confirmation.";
  const inclusions = htmlToList(data.policies.inclusions) || defaultInclusions;
  const exclusions = htmlToList(data.policies.exclusions) || defaultExclusions;
  const cancellation = htmlToList(data.policies.cancellationPolicy) || defaultCancellation;
  const bookingTerms = htmlToList(data.policies.bookingTerms) || defaultBookingTerms;
  const paymentTerms = htmlToList(data.policies.paymentTerms) || defaultPaymentTerms;

  const terms = stripHtml(data.policies.termsAndConditions) ||
    `All correspondence(s) in respect of Tours/Travel Service bookings should be addressed to ${data.companyName}.`;

  const hotelRows = hotels.map((hotel) => {
    const checkIn = hotel.checkIn || data.checkIn;
    const checkOutDate = hotel.checkIn
      ? (() => {
          const d = new Date(hotel.checkIn);
          if (Number.isNaN(d.getTime())) return data.checkOut;
          d.setDate(d.getDate() + Number(hotel.nights || 1));
          return formatLongDate(d.toISOString());
        })()
      : data.checkOut;
    return `<tr>
      <td>${esc(formatLongDate(checkIn))} - ${esc(checkOutDate)}</td>
      <td>${esc(hotel.hotelCity)} (${hotel.nights || 1} N)</td>
      <td>${esc(hotel.hotelName || "Hotel")}</td>
      <td>${esc(hotel.rooms?.[0]?.roomType || roomType)}(${esc((hotel.rooms?.[0]?.mealPlan || mealPlan).split(" ")[0])})</td>
      <td>${hotel.rooms?.length || 1}</td>
    </tr>`;
  }).join("");

  const flightRows = flights.map((leg) => {
    const dep = formatDateTime(leg.departureDate);
    const arr = formatDateTime(leg.arrivalDate);
    const duration = durationBetween(leg.departureDate, leg.arrivalDate) || "";
    const stops = /non/i.test(leg.stops || "") ? "No Stops" : leg.stops || "No Stops";
    return `<tr>
      <td>${esc(dep.date)} ${esc(dep.time)}</td>
      <td>${esc(leg.airlineName)} ${esc(leg.airlineNo)}</td>
      <td>${esc(leg.from)} to ${esc(leg.to)}</td>
      <td>${esc(arr.date)} ${esc(arr.time)}</td>
      <td>${esc(duration)} ${esc(stops)}</td>
    </tr>`;
  }).join("");

  const sightRows = (activities.length
    ? activities
    : data.days.map((day) => ({
        dayNumber: day.dayNumber,
        name: day.sicSightseeing || day.pvtSightseeing || day.title,
        city: day.city || mainDest,
      }))
  )
    .map((item) => {
      const day = data.days.find((d) => d.dayNumber === item.dayNumber);
      return `<tr>
      <td>${esc(day?.label || "")}</td>
      <td>${esc(item.city)}</td>
      <td>${esc(item.name)}</td>
      <td></td>
    </tr>`;
    })
    .join("");

  const stayCards = hotels.map((hotel) => `
    <div class="pdf-stay">
      <div class="strong">${esc(hotel.hotelName || "Hotel")}</div>
      <div>${esc(hotel.hotelCity)}. ${hotel.nights || 1} Night Stay</div>
      <div>No of Room(s): ${hotel.rooms?.length || roomCount} &nbsp; <strong>${esc(hotel.rooms?.[0]?.roomType || roomType)}(${esc((hotel.rooms?.[0]?.mealPlan || mealPlan).split(" ")[0])})</strong></div>
      <div class="pdf-stay-dates">
        <div><div class="muted">Check in</div><div>${esc(formatLongDate(hotel.checkIn || data.checkIn))}</div></div>
        <div><div class="muted">Check Out</div><div>${esc(formatLongDate(data.checkOut))}</div></div>
      </div>
    </div>`).join("");

  const bank = data.bank || {};

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${tripTitle}</title>
  <style>
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { margin: 0; }
    body { font-family: Arial, Helvetica, sans-serif; color: #111; background: #fff; margin: 0; padding: 28px 36px; font-size: 13px; line-height: 1.45; }
    img { max-width: 100%; }
    .pdf-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
    .pdf-logo { width: 54px; height: 54px; object-fit: contain; border-radius: 50%; background: #fff; }
    .pdf-consult { text-align: right; font-size: 11px; color: #333; }
    h1 { font-size: 22px; margin: 0 0 10px; }
    .meta { margin: 3px 0; }
    .meta b { display: inline-block; min-width: 92px; }
    .hero { width: 100%; height: 280px; object-fit: cover; object-position: center; margin: 16px 0; border-radius: 2px; background: #ececec; display: block; }
    .pdf-img-fallback { background: #ececec; }
    .pdf-photo-grid .hero { height: 220px; margin: 0; }
    .pdf-thumb { width: 92px; height: 62px; object-fit: cover; object-position: center; background: #ececec; display: block; flex-shrink: 0; }
    .pdf-thumb.wide { width: 120px; height: 70px; }
    .pdf-photo-small img, .pdf-photo-small .pdf-img-fallback { width: 100%; height: 104px; object-fit: cover; object-position: center; background: #ececec; display: block; }
    .pdf-heading { display: flex; align-items: center; gap: 12px; margin: 28px 0 14px; }
    .pdf-heading h2 { font-size: 15px; letter-spacing: .6px; margin: 0; white-space: nowrap; }
    .pdf-heading-line { flex: 1; height: 1px; background: #111; }
    .pdf-heading-left { justify-content: flex-start; }
    .pdf-heading-left h2 { text-align: left; }
    .pdf-includes { display: flex; justify-content: space-between; gap: 10px; margin-top: 8px; }
    .pdf-include { text-align: center; flex: 1; font-weight: 700; font-size: 12px; }
    .pdf-include-icon { width: 42px; height: 42px; border: 1px solid #bbb; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; }
    table.summary, table.grid { width: 100%; border-collapse: collapse; }
    table.summary td { border: 1px solid #d9d9d9; padding: 10px 12px; vertical-align: middle; }
    .icon-wrap { width: 32px; height: 32px; border: 1px solid #bbb; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
    table.grid th, table.grid td { border: 1px solid #ccc; padding: 7px 8px; text-align: left; font-size: 12px; }
    table.grid th { font-weight: 700; }
    .icon-cell { width: 42px; text-align: center; }
    .pdf-day, .pdf-activity, .pdf-flight-card, .pdf-stay { padding: 12px 0 16px; border-bottom: 1px solid #ddd; }
    .pdf-day-head { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 8px; }
    .pdf-day-title { font-weight: 700; text-transform: uppercase; margin: 6px 0 8px; }
    .pdf-copy { margin: 8px 0 12px; color: #222; }
    .pdf-box { border: 1px solid #cfcfcf; padding: 10px 12px; }
    .pdf-box div { margin: 3px 0; }
    .pdf-photo-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 8px; margin: 8px 0 12px; }
    .pdf-photo-small { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .pdf-flight-top { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .pdf-plane { width: 28px; height: 28px; border-radius: 50%; background: #1d4ed8; display: flex; align-items: center; justify-content: center; }
    .pdf-flight-grid { display: grid; grid-template-columns: 1.2fr 1fr .7fr 1fr; gap: 12px; margin-top: 8px; }
    .pdf-duration { text-align: center; }
    .pdf-stay-dates { display: grid; grid-template-columns: 1fr 1fr; margin-top: 8px; }
    .muted { color: #777; }
    .strong { font-weight: 700; }
    .price-sum { text-align: right; margin-top: 10px; }
    .price-sum div { margin: 4px 0; }
    .price-total { background: #f3f3f3; padding: 6px 8px; }
    .cta-wrap { text-align: center; margin: 22px 0 8px; }
    .cta { display: inline-block; min-width: 220px; background: #000; color: #fff !important; text-align: center; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,.28); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .pay-row .cta { margin: 0; min-width: 200px; padding: 10px 18px; }
    .pay-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 12px 0; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; }
    .help-box { border: 1px solid #d0d0d0; padding: 14px 16px; }
    .help-grid { display: grid; grid-template-columns: 1fr auto; gap: 8px 24px; }
    ul { margin: 8px 0 0 18px; padding: 0; }
    li { margin: 4px 0; }
    @media print {
      body { padding: 16mm 14mm; }
      .pdf-day, .pdf-activity, .pdf-flight-card { break-inside: avoid; }
      .cta { background: #000 !important; color: #fff !important; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="pdf-header">
    ${data.companyLogo ? `<img class="pdf-logo" src="${esc(data.companyLogo)}" alt="" />` : `<div class="pdf-logo" style="border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">HH</div>`}
    <div class="pdf-consult">
      <div><b>Consultant:</b> ${esc(data.consultantName)}</div>
      <div><b>Number:</b> ${esc(data.consultantPhone)}</div>
    </div>
  </div>

  <h1>${tripTitle}</h1>
  <div class="meta"><b>Destination:</b> ${esc(data.destinations || mainDest)}</div>
  <div class="meta"><b>Duration:</b> ${data.nights} Nights & ${data.daysCount} Days (${esc(data.checkIn)} – ${esc(data.checkOut)})</div>
  <div class="meta"><b>No of Pax:</b> ${data.adults} Adults</div>
  ${pdfImg(data.ai?.coverImageUrl, "hero", mainDest)}

  ${heading("TRIP INCLUSIONS")}
  <div class="pdf-includes">
    ${includeItem(planeIcon.replace('fill="#fff"', 'fill="#555"'), "Flights")}
    ${includeItem(bedIcon, "Hotels")}
    ${includeItem(carIcon, "Transfer")}
    ${includeItem(binocIcon, "Sightseeing")}
    ${includeItem(dotsIcon, "Others")}
  </div>

  ${heading("TRIP SUMMARY")}
  <table class="summary">
    <tr>
      <td class="icon-cell"><div class="icon-wrap">${bedIcon}</div></td>
      <td class="strong" style="width:210px">Hotel(s)</td>
      <td>${hotelSummary}</td>
    </tr>
    <tr>
      <td class="icon-cell"><div class="icon-wrap">${planeIcon.replace('fill="#fff"', 'fill="#555"')}</div></td>
      <td class="strong">Flight</td>
      <td>${flightSummary}</td>
    </tr>
    ${Object.entries(sightseeingByCity).map(([city, names]) => `
      <tr>
        <td class="icon-cell"><div class="icon-wrap">${binocIcon}</div></td>
        <td class="strong">Sightseeing(s) In ${esc(city)}</td>
        <td>${esc(names.filter(Boolean).join(", ") || "As per itinerary")}</td>
      </tr>`).join("")}
  </table>

  ${heading("DETAILED ITINERARY")}
  ${itineraryHtml}

  ${heading("ACTIVITIES/SIGHTSEEING")}
  ${activityHtml}

  ${heading("FLIGHTS")}
  ${flightCards || "<p>Flight details will be shared as per booking.</p>"}

  ${heading("FLIGHT DETAILS")}
  <table class="grid">
    <thead><tr><th>Departure Date & Time</th><th>Airlines</th><th>Route</th><th>Arrival Date & Time</th><th>Duration & Stops</th></tr></thead>
    <tbody>${flightRows || `<tr><td colspan="5">Flight schedule as per itinerary</td></tr>`}</tbody>
  </table>

  ${heading("HOTEL DETAILS")}
  <table class="grid">
    <thead><tr><th>Check in - Check Out</th><th>City/ Nights</th><th>Hotel</th><th>Room Details</th><th>No of Room(s)</th></tr></thead>
    <tbody>${hotelRows || `<tr><td colspan="5">Hotels as per itinerary</td></tr>`}</tbody>
  </table>

  ${heading("SIGHTSEEING DETAILS")}
  <table class="grid">
    <thead><tr><th>Date</th><th>Destination</th><th>Sightseeing Name</th><th>Type</th></tr></thead>
    <tbody>${sightRows || `<tr><td colspan="4">Sightseeing as per itinerary</td></tr>`}</tbody>
  </table>

  ${heading("ACCOMMODATION")}
  ${stayCards || "<p>Accommodation as per itinerary.</p>"}

  ${heading("PRICE DETAILS")}
  <table class="grid">
    <thead><tr><th>Pax Type</th><th>No of Pax</th><th>Cost Per Person</th><th>Total Cost</th></tr></thead>
    <tbody>
      <tr>
        <td>Adult ${esc(sharing)}</td>
        <td>${data.adults}</td>
        <td>${esc(money(data.currency, data.pricePerPerson))}</td>
        <td>${esc(money(data.currency, data.totalCost))}</td>
      </tr>
      <tr>
        <td colspan="3" class="strong">Total Cost (Excl. GST)</td>
        <td class="strong">${esc(money(data.currency, data.totalCost))}</td>
      </tr>
    </tbody>
  </table>
  <div class="price-sum">
    <div>Package Cost (Excl. GST) : <strong>${esc(money(data.currency, data.totalCost))}</strong></div>
    <div>Total GST on Package : <strong>${esc(money(data.currency, data.gstAmount))}</strong></div>
    <div class="price-total">Total Package Cost (Incl. GST) : <strong>${esc(money(data.currency, data.grandTotal))}</strong></div>
  </div>
  <div class="cta-wrap"><span class="cta">View online & Book</span></div>

  ${leftHeading("NOTES")}
  <p>${esc(notes)}</p>

  ${leftHeading("INCLUSIONS")}
  <ul>${inclusions}</ul>

  ${leftHeading("EXCLUSIONS")}
  <ul>${exclusions}</ul>

  ${leftHeading("CANCELLATION POLICY")}
  <p>Cancellations must be notified in writing. Charges apply from the date of receipt.</p>
  <p class="strong">If you Cancel your Tour (cancellation Charges as per person)</p>
  <ul>${cancellation}</ul>

  ${leftHeading("TERMS AND CONDITIONS")}
  <p>${esc(terms)}</p>

  ${leftHeading("BOOKING TERMS")}
  <ul>${bookingTerms}</ul>

  ${leftHeading("PAYMENT TERMS")}
  <ul>${paymentTerms}</ul>

  ${leftHeading("HOW TO BOOK")}
  <p>We offer flexible payment options to book your dream vacation. You can make the payments by IMPS transfer as per below bank details or pay online using the View online & Book your vacation.</p>
  <p class="muted">You will get all your booking voucher by email, within 2-3 working days after your initial payment. A consolidate voucher will be sent after making the final payment.</p>
  <div class="pay-row">
    <div>
      <div class="strong">Pay online</div>
      <div class="muted">Secure SSL Payment gateway. Accepts all major cards and payment modes.</div>
    </div>
    <span class="cta">Pay & book your vacation</span>
  </div>

  ${leftHeading("BANK TRANSFER OPTIONS")}
  <p>Payment needs to be made in the company name ${esc(data.companyName)} you can deposit cheque or DD in our current account as below:</p>
  <p>
    Account Name: ${esc(bank.accountHolderName || data.companyName)}<br/>
    Bank Name: ${esc(bank.bankName || "—")}<br/>
    Branch: ${esc(bank.branch || "—")}<br/>
    Account Number: ${esc(bank.accountNumber || "—")}<br/>
    IFSC CODE : ${esc(bank.ifscCode || "—")}<br/>
    GOOGLE PAY : ${esc(data.googlePay || data.companyPhone || "—")}<br/>
    PHONE PAY : ${esc(data.phonePay || data.companyPhone || "—")}
  </p>

  ${leftHeading("NEED HELP")}
  <div class="help-box">
    <div class="strong" style="font-size:15px;margin-bottom:8px">${esc(data.companyName)}</div>
    <div class="help-grid">
      <div>${data.companyAddress ? `📍 ${esc(data.companyAddress)}` : ""}</div>
      <div></div>
      <div>${data.companyEmail ? `✉ ${esc(data.companyEmail)}` : ""}</div>
      <div>${data.companyPhone || data.consultantPhone ? `☎ ${esc(data.companyPhone || data.consultantPhone)}` : ""}</div>
      <div>${data.companyWebsite ? `🌐 ${esc(data.companyWebsite)}` : ""}</div>
    </div>
  </div>
</body>
</html>`;
};

export const downloadCustomProposalPdf = (html: string, fileName: string) => {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDocument = iframe.contentDocument || frameWindow?.document;
  if (!frameWindow || !frameDocument) {
    iframe.remove();
    throw new Error("Unable to open the PDF print dialog.");
  }

  frameDocument.open();
  frameDocument.write(html);
  frameDocument.close();
  frameDocument.title = fileName.replace(/\.pdf$/i, "");

  const waitForImages = () => {
    const images = Array.from(frameDocument.images || []);
    if (!images.length) return Promise.resolve();
    return Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
              return;
            }
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    );
  };

  const cleanup = () => {
    iframe.remove();
  };

  const printNow = () => {
    try {
      frameWindow.focus();
      frameWindow.print();
    } catch {
      /* print dialog may already be open */
    } finally {
      setTimeout(cleanup, 800);
    }
  };

  Promise.race([
    waitForImages(),
    new Promise<void>((resolve) => setTimeout(resolve, 8000)),
  ]).then(() => setTimeout(printNow, 400));
};
