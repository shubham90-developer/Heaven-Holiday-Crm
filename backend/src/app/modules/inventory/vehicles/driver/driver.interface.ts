export interface IDriver {
    driverName: string;
    mobileNumber: string;
    email?: string;
    languages: string;
    address?: string;
    country: string;
    city: string;
    drivingLicense?: string;
    primaryVehicle?: string;
    image?: string;
    remark?: string;
    createdAt?: Date;
    updatedAt?: Date;
}