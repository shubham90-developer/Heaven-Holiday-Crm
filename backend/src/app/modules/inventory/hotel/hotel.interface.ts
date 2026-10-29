export type TWeekend = {
  saturday: boolean;
  sunday: boolean;
};

export type THotel = {
  hotelName: string;
  cityName: string;
  contactEmail?: string;
  countryCode: string;
  contactNo: string;
  starRating?: number;
  propertyType: string;
  checkInTime: string;
  checkOutTime: string;
  weekend: TWeekend;
  roomType?: string;
  childAge?: number;
  createdAt?: Date;
  updatedAt?: Date;
};