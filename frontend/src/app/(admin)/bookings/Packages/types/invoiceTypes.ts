export interface InvoiceItemRow {
    category: string;
    description: string;
    hsnSac: string;
    qty: number;
    rate: number;
    discountType: string;
    discount: number;
    markupType: string;
    markup: number;
    gstOn: string;
    gstPercent: string;
    totalGst: number;
    totalAmt: number;
}

export interface InvoiceData {
    billedTo: string;
    currency: string;
    invoiceDate: string;
    paymentDueDate: string;
    invoiceNumber: string;
    clientAddress: string;
    pinCode: string;
    clientCity: string;
    clientState: string;
    clientGst: string;
    salesBy: string;
    salesEmail: string;
    salesPhone: string;
    items: InvoiceItemRow[];
    subTotal: number;
    igst: number;
    otherDiscount: number;
    totalInvoiceValue: number;
    advance: number;
    balanceToBePaid: number;
    notes: string;
    paymentTerms: string;
    allowPartialPayment: boolean;
    displayMarkup: boolean;
    panNo: string;
    gstinNumber: string;
    proposalIdRef: string;
}

export const DEFAULT_PAYMENT_TERMS = `Payment needs to be made in the company name A HEAVEN HOSPITALITY PVT LTD you can deposit cheque or DD in our current account as below:

Account Name: AHEAVEN HOSPITALITY PVT LTD

Bank Name: YES BANK
Branch: SHIVAJI PARK
Account Number: 004363300003005
IFSC CODE: YESB0000043
GOOGLE PAY: 9960793700
PHONE PAY: 9960793700`;

export const COMPANY_INFO = {
    name: "A HEAVEN HOSPITALITY PVT LTD",
    address:
        "B-11, 1st Floor, Prabhakar Plaza, Station Road, Kolhapur - 416001, Maharashtra (India)",
    email: "b2b.aheaven@gmail.com",
    phone: "+91-9960793700",
    website: "https://www.aheavenholiday.in/",
    gstin: "27AATCA4967A1ZF",
};

export const generateInvoiceNumber = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const seq = String(Math.floor(Math.random() * 999999)).padStart(6, "0");
    return `${y}-${m}-${seq}`;
};

export const defaultInvoiceItem = (): InvoiceItemRow => ({
    category: "package",
    description: "",
    hsnSac: "440063",
    qty: 1,
    rate: 0,
    discountType: "Fixed",
    discount: 0,
    markupType: "Fixed",
    markup: 0,
    gstOn: "No tax",
    gstPercent: "0%",
    totalGst: 0,
    totalAmt: 0,
});

export const computeInvoiceItemTotal = (row: InvoiceItemRow): InvoiceItemRow => {
    const base = Number(row.qty) * Number(row.rate);
    const discount =
        row.discountType === "Percent"
            ? (base * Number(row.discount)) / 100
            : Number(row.discount);
    const afterDiscount = base - discount;
    const markup =
        row.markupType === "Percent"
            ? (afterDiscount * Number(row.markup)) / 100
            : Number(row.markup);
    const taxable = afterDiscount + markup;
    const gstRate = parseFloat(row.gstPercent) || 0;
    const totalGst =
        row.gstOn === "No tax" ? 0 : (taxable * gstRate) / 100;
    const totalAmt = taxable + totalGst;

    return {
        ...row,
        totalGst: Math.round(totalGst * 100) / 100,
        totalAmt: Math.round(totalAmt * 100) / 100,
    };
};

export const computeInvoiceTotals = (invoice: InvoiceData): InvoiceData => {
    const items = invoice.items.map(computeInvoiceItemTotal);
    const subTotal = items.reduce((sum, row) => sum + row.totalAmt, 0);
    const igst = Number(invoice.igst) || 0;
    const otherDiscount = Number(invoice.otherDiscount) || 0;
    const totalInvoiceValue = subTotal + igst - otherDiscount;
    const advance = Number(invoice.advance) || 0;
    const balanceToBePaid = totalInvoiceValue - advance;

    return {
        ...invoice,
        items,
        subTotal: Math.round(subTotal * 100) / 100,
        totalInvoiceValue: Math.round(totalInvoiceValue * 100) / 100,
        balanceToBePaid: Math.round(balanceToBePaid * 100) / 100,
    };
};

export const buildInvoiceFromBooking = (booking: {
    customerDetails: {
        email?: string;
        mobile?: string;
        firstName?: string;
        lastName?: string;
        companyName?: string;
        customerType?: string;
        rm?: string;
    };
    goingTo?: string;
    travelers?: number;
    travelDate?: string;
    sellingPrice?: number;
    totalSalesPrice?: number;
    received?: number;
    advance?: number;
    proposalId?: number;
    owner?: string;
    invoice?: InvoiceData;
}): InvoiceData => {
    if (booking.invoice) {
        return computeInvoiceTotals(booking.invoice);
    }

    const customerName =
        booking.customerDetails.customerType === "B2B"
            ? booking.customerDetails.companyName || ""
            : `${booking.customerDetails.firstName || ""} ${booking.customerDetails.lastName || ""}`.trim();

    const today = new Date().toISOString().split("T")[0];
    const packageCost =
        booking.sellingPrice || booking.totalSalesPrice || 0;
    const description = `trip details for ${customerName.split(" ")[0] || customerName}. Adult:-${booking.travelers || 2} Child:-0 Departure Date:-${booking.travelDate || today}`;

    const item = computeInvoiceItemTotal({
        ...defaultInvoiceItem(),
        description,
        rate: packageCost,
    });

    return computeInvoiceTotals({
        billedTo: customerName,
        currency: "INR",
        invoiceDate: today,
        paymentDueDate: today,
        invoiceNumber: generateInvoiceNumber(),
        clientAddress: "",
        pinCode: "0",
        clientCity: "",
        clientState: "",
        clientGst: "No",
        salesBy: booking.owner || booking.customerDetails.rm || "RAJENDRA BUGADE",
        salesEmail: booking.customerDetails.email || "",
        salesPhone: booking.customerDetails.mobile || "",
        items: [item],
        subTotal: item.totalAmt,
        igst: 0,
        otherDiscount: 0,
        totalInvoiceValue: item.totalAmt,
        advance: booking.received || booking.advance || 0,
        balanceToBePaid: packageCost - (booking.received || 0),
        notes: "",
        paymentTerms: DEFAULT_PAYMENT_TERMS,
        allowPartialPayment: true,
        displayMarkup: false,
        panNo: "",
        gstinNumber: COMPANY_INFO.gstin,
        proposalIdRef: String(booking.proposalId || ""),
    });
};

export const amountInWords = (amount: number) => {
    if (!amount || amount === 0) return "Only/-";
    return `INR ${amount.toLocaleString("en-IN")} Only`;
};
