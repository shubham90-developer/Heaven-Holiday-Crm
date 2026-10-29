const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

export const personalizeSupplierEmail = (html: string, supplierName: string) => {
    const name = escapeHtml((supplierName || "Supplier").trim());

    return (html || "")
        .replace(/&lt;\s*Supplier Name\s*&gt;/gi, name)
        .replace(/<\s*Supplier Name\s*>/gi, name)
        .replace(/\{supplierName\}/gi, name)
        .replace(/\(\s*Supplier name will be added automatically in mail body\s*\)/gi, "");
};

export const parseEmailList = (value?: string) =>
    (value || "")
        .split(/[;,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
