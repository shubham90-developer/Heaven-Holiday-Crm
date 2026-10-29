export interface ITransport {
  carType: "Luxury" | "Standard";
  transportName: string;
  seatingCapacity: number;
  ac: boolean;
  vehicleNo: string;
  numberOfVehicles: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}