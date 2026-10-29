import {
  adultCountFromPax,
  normalizePaxDetails,
} from "../../../../utils/paxDetails";

export type EnquiryDetails = {
  customerName: string;
  enquiryId: string;
  enquiryFor: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  noOfDays: string;
  pax: string;
  paxHtml: string;
  hotelPreference: string;
  inclusions: string;
  theme: string;
  foodPreference: string;
  remarks: string;
  subject: string;
};

export type SupplierListItem = {
  id: string;
  name: string;
  location: string;
  services: string;
  contactName: string;
  contactEmail: string;
  mobileNumber: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const escapeHtml = (value: string) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const formatDate = (date?: string | Date | null) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${day}-${MONTHS[parsed.getMonth()]}-${parsed.getFullYear()}`;
};

export const addDays = (date?: string | Date | null, days = 0) => {
  if (!date || !days) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  parsed.setDate(parsed.getDate() + days);
  return formatDate(parsed);
};

export const joinValues = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .flat()
      .map((item) => String(item ?? "").trim())
      .filter(Boolean)
      .join(", ");
  }
  if (value === 0) return "0";
  return String(value ?? "").trim();
};

export const formatHotelPreference = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        const text = String(item ?? "").trim();
        if (!text) return "";
        return /^\d+$/.test(text) ? `${text} Star` : text;
      })
      .filter(Boolean)
      .join(", ");
  }
  const text = String(value ?? "").trim();
  if (!text) return "";
  return /^\d+$/.test(text) ? `${text} Star` : text;
};

export const formatPax = (packageDetails: any = {}) => {
  const pax = normalizePaxDetails(
    packageDetails.paxDetails,
    packageDetails.travelers
  );
  const adults = adultCountFromPax(pax);
  const children =
    (Number(pax.childWithBed) || 0) + (Number(pax.childWithoutBed) || 0);
  const infants = Number(pax.infant) || 0;

  if (!adults && !children && !infants) return "";

  const parts = [`${adults || 0} Adults`];
  if (children) parts.push(`${children} Child`);
  if (infants) parts.push(`${infants} Infant`);

  return `${parts.join(", ")} Room 1: [ Adults: ${adults || 0} ]`;
};

export const formatPaxHtml = (packageDetails: any = {}) => {
  const text = formatPax(packageDetails);
  if (!text) return "";
  return escapeHtml(text).replace(/\sRoom\s/g, "<br/>Room ");
};

export const personalizeSupplierEmail = (html: string, supplierName: string) => {
  const name = supplierName || "Supplier";
  return (html || "")
    .replace(/&lt;\s*Supplier Name\s*&gt;/gi, name)
    .replace(/<\s*Supplier Name\s*>/gi, name)
    .replace(/\{supplierName\}/gi, name)
    .replace(/\(\s*Supplier name will be added automatically in mail body\s*\)/gi, "");
};

export const htmlToPlainText = (html: string) =>
  (html || "")
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<td[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const CELL =
  "border:1px solid #c8c8c8;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;vertical-align:top;";

type CellOpts = { bold?: boolean; colspan?: number; bg?: string; width?: string };

const cell = (html: string, opts: CellOpts = {}) => {
  const colspan = opts.colspan ? ` colspan="${opts.colspan}"` : "";
  const style = [
    CELL,
    opts.bold ? "font-weight:700;" : "",
    opts.bg ? `background:${opts.bg};` : "",
    opts.width ? `width:${opts.width};` : "",
  ].join("");
  return `<td${colspan} style="${style}">${html}</td>`;
};

export const buildEmailIntro = (details: EnquiryDetails) =>
  `<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;margin:0 0 10px;">Dear &lt; Supplier Name &gt; (Supplier name will be added automatically in mail body)</p>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;margin:0 0 12px;">Kindly provide the best rates for below Package enquiry for ${escapeHtml(details.destination || "the destination")} at the earliest.</p>`;

export const buildEnquiryTable = (details: EnquiryDetails) => `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;margin:0 0 14px;background:#fff;">
  <tr>
    ${cell("Customer Name", { bold: true, width: "16%" })}
    ${cell(escapeHtml(details.customerName || ""), { width: "17%" })}
    ${cell("Enquiry ID", { bold: true, width: "16%" })}
    ${cell(escapeHtml(details.enquiryId || ""), { width: "17%" })}
    ${cell("Enquiry For", { bold: true, width: "16%" })}
    ${cell(escapeHtml(details.enquiryFor || "Package"), { width: "18%" })}
  </tr>
  <tr>
    ${cell("Enquiry Details", { bold: true, colspan: 6, bg: "#f3f3f3" })}
  </tr>
  <tr>
    ${cell("Check In", { bold: true })}
    ${cell(escapeHtml(details.checkIn || "NA"))}
    ${cell("Check Out", { bold: true })}
    ${cell(escapeHtml(details.checkOut || "NA"))}
    ${cell("No Of Days", { bold: true })}
    ${cell(escapeHtml(details.noOfDays || ""))}
  </tr>
  <tr>
    ${cell("Destination", { bold: true })}
    ${cell(escapeHtml(details.destination || ""))}
    ${cell("No of Pax", { bold: true })}
    ${cell(details.paxHtml || escapeHtml(details.pax || ""), { colspan: 3 })}
  </tr>
  <tr>
    ${cell("Hotel Preference:", { bold: true })}
    ${cell(escapeHtml(details.hotelPreference || ""), { colspan: 5 })}
  </tr>
  <tr>
    ${cell("Inclusions:", { bold: true })}
    ${cell(escapeHtml(details.inclusions || ""), { colspan: 5 })}
  </tr>
  <tr>
    ${cell("Theme:", { bold: true })}
    ${cell(escapeHtml(details.theme || ""), { colspan: 5 })}
  </tr>
  <tr>
    ${cell("Food Preference:", { bold: true })}
    ${cell(escapeHtml(details.foodPreference || ""), { colspan: 5 })}
  </tr>
  <tr>
    ${cell("Remarks:", { bold: true })}
    ${cell(details.remarks ? escapeHtml(details.remarks) : "&nbsp;", { colspan: 5 })}
  </tr>
</table>`;

export const buildEmailClosing = (signerName: string, signerPhone: string) =>
  `<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;margin:12px 0 8px;">Looking forward for an early response.</p>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;margin:0 0 4px;">Regards,</p>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;margin:0 0 2px;">${escapeHtml(signerName)}</p>
${signerPhone ? `<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;margin:0;">${escapeHtml(signerPhone)}</p>` : ""}`;

export const composeEnquiryEmailHtml = (
  introHtml: string,
  details: EnquiryDetails,
  closingHtml: string
) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;line-height:1.45;">${introHtml}${buildEnquiryTable(details)}${closingHtml}</div>`;

export const buildEmailBody = (
  details: EnquiryDetails,
  signerName: string,
  signerPhone: string
) => composeEnquiryEmailHtml(buildEmailIntro(details), details, buildEmailClosing(signerName, signerPhone));

export const parsePaxLines = (pax?: string) => {
  const raw = (pax || "").trim();
  if (!raw) return { summary: "", rooms: [] as string[] };
  const parts = raw.split(/(?=Room\s+\d+\s*:)/i);
  const summary = parts[0].replace(/^(pax details:?\s*)/i, "").trim();
  const rooms = parts.slice(1).map((item) => item.trim()).filter(Boolean);
  return { summary, rooms };
};

export const buildWhatsAppText = (
  details: EnquiryDetails,
  _supplierName: string,
  signerName: string,
  signerPhone: string
) => {
  const enquiryFor = details.enquiryFor || "Package";
  const destination = details.destination || "";
  const { summary, rooms } = parsePaxLines(details.pax);
  const roomBlock = rooms.length ? `\n${rooms.join("\n")}` : "";
  const remarksLine = details.remarks?.trim()
    ? `📝 *Remarks:* ${details.remarks.trim()}`
    : "📝 *Remarks*";

  return `*Dear Sir/Mam,*

Greetings!!

Kindly provide the *best rates* for the below *${enquiryFor}* inquiry for *${destination}* at the earliest.

📌 *ENQUIRY DETAILS*

*Enquiry ID*: ${details.enquiryId || ""}
*Enquiry For*: ${enquiryFor}

📅 *Travel Details*

*Check In*: ${details.checkIn || "NA"}
*Check Out*: ${details.checkOut || "NA"}
*No Of Days*: ${details.noOfDays || ""}

📍 *Destination*: ${destination}

👥 *Pax Details:* ${summary}${roomBlock}

🏨 *Hotel Preference:* ${details.hotelPreference || ""}

✅ *Inclusions:* ${details.inclusions || ""}

🎯 *Theme:* ${details.theme || ""}

🍴 *Food Preference:* ${details.foodPreference || ""}

${remarksLine}

Looking forward to an early response.

Regards,

${signerName}
${signerPhone || ""}`.trim();
};

export const formatWhatsAppPreviewHtml = (text: string) =>
  (text || "")
    .split("\n")
    .map((line) => {
      const escaped = escapeHtml(line);
      const withBold = escaped.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
      return withBold || "&nbsp;";
    })
    .join("<br/>");

export const mapSupplierToListItem = (supplier: any): SupplierListItem => {
  const contactName = [supplier?.salutation, supplier?.firstName, supplier?.lastName]
    .filter((item) => item && item !== "-")
    .join(" ")
    .trim();

  return {
    id: supplier?._id,
    name: supplier?.companyName || contactName || "Supplier",
    location: [supplier?.city, supplier?.country].filter(Boolean).join(", "),
    services: supplier?.services || "",
    contactName: contactName || supplier?.companyName || "",
    contactEmail: supplier?.email || "",
    mobileNumber: supplier?.mobileNumber || "",
  };
};
