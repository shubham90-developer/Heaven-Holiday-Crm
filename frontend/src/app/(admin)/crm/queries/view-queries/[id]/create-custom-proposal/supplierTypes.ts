export const SUPPLIER_TYPES = {
  THIRD_PARTY_PACKAGE: "3rd-Party Package + Self Flights & Visa",
  THIRD_PARTY_LAND: "3rd-Party Land + Self Hotel, Flights & Visa",
  SELF_SOURCED: "Self-Sourced Package / DMC",
} as const;

export const SUPPLIER_TYPE_OPTIONS = [
  SUPPLIER_TYPES.THIRD_PARTY_PACKAGE,
  SUPPLIER_TYPES.THIRD_PARTY_LAND,
  SUPPLIER_TYPES.SELF_SOURCED,
] as const;

export const showsPackageLevelSupplier = (supplierType: string) =>
  supplierType === SUPPLIER_TYPES.THIRD_PARTY_PACKAGE ||
  supplierType === SUPPLIER_TYPES.THIRD_PARTY_LAND;

export const packageSupplierLabel = (supplierType: string) =>
  supplierType === SUPPLIER_TYPES.THIRD_PARTY_LAND
    ? "Land Supplier"
    : "Package Supplier";

export const showsHotelCostingFields = (supplierType: string) =>
  supplierType !== SUPPLIER_TYPES.THIRD_PARTY_PACKAGE;
