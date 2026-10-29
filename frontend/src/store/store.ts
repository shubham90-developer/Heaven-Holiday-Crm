// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { b2cLeadApi } from "./services/b2cLeadApi";
import { b2bLeadApi } from "./services/b2bLeadApi";
import { leadsApi } from "./services/leadsApi";
import { messageApi } from "./services/messageApi";
import { supplierApi } from "./services/supplierApi";
import { enquirySupplierApi } from "./services/enquirySupplierApi";
import { supplierContactApi } from "./services/supplierContactApi";
import { supplierBankApi } from "./services/supplierBankApi";
import { queryApi } from "./services/queriesApi";
import { followUpApi } from "./services/followUp.Api";
import { roleApi } from "./services/staff-management/role/roleApi";
import { departmentApi } from "./services/staff-management/department/departmentApi";
import { staffApi } from "./services/staff-management/staff/staffApi";
import { hotelApi } from "./services/inventory/hotel/hotelApi";
import { transportApi } from "./services/inventory/vehicle/transport/transportApi"
import { driverApi } from "./services/inventory/vehicle/driver/driverApi";
import { guideApi } from "./services/inventory/vehicle/guide/guideApi";
import { visaApi } from "./services/inventory/visa/visaApi";
import { areaMasterApi } from "./services/inventory/area-master/areaMasterApi";
import { itineraryApi } from "./services/inventory/itinerary-description/itineraryDescriptionApi";
import { restaurantApi } from "./services/inventory/restaurants/restaurantApi";
import { sightseeingApi } from "./services/inventory/sightseeing/sightSeeingApi";
import { transportRouteApi } from "./services/inventory/transport-route/transportRouteApi";
import { packageApi } from "./services/inventory/package/packageApi";
import { authApi } from "./services/auth/authApi";
import { companyProfileApi } from "./services/settings/company-profile/companyProfileApi";
import { bankDetailApi } from "./services/settings/company-profile/bankDetailsApi";
import { contactsApi } from "./services/customerContactApi";
import { destinationApi } from "./services/destinationApi";
import { travelHistoryApi } from "./services/travelHistoryApi";
import { leadsExtraInfoApi } from "./services/leadsExtraInfoApi"
import { leadRemarksApi } from "./services/leadRemarkApi";
import { emailTemplateApi } from "./services/settings/email-template/emailTemplateApi";
import { termsConditionsApi } from "./services/settings/terms-and-conditions/termsConditionsApi"
import { leadSourceApi } from "./services/settings/lead-source/leadSourceApi"
import { inclusionApi } from "./services/settings/inclusions/inclusionApi"
import { themeApi } from "./services/settings/themes/themeApi"
import { foodPreferenceApi } from "./services/settings/food-preferences/foodPreferenceApi"
import { proposalImageApi } from "./services/settings/proposal-images/proposalImageApi"
import { packageBookingApi } from "./services/booking/packageBookingApi"
import { dailyCollectionApi } from "./services/finance/dailyCollectionApi"
import { touchPointApi } from "./services/crm/touchPointApi"
import { proposalApi } from "./services/proposalApi"

export const store = configureStore({
    reducer: {
        [b2cLeadApi.reducerPath]: b2cLeadApi.reducer,
        [b2bLeadApi.reducerPath]: b2bLeadApi.reducer,
        [leadsApi.reducerPath]: leadsApi.reducer,
        [messageApi.reducerPath]: messageApi.reducer,
        [supplierApi.reducerPath]: supplierApi.reducer,
        [enquirySupplierApi.reducerPath]: enquirySupplierApi.reducer,
        [supplierContactApi.reducerPath]: supplierContactApi.reducer,
        [supplierBankApi.reducerPath]: supplierBankApi.reducer,
        [queryApi.reducerPath]: queryApi.reducer,
        [followUpApi.reducerPath]: followUpApi.reducer,
        [roleApi.reducerPath]: roleApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [staffApi.reducerPath]: staffApi.reducer,
        [hotelApi.reducerPath]: hotelApi.reducer,
        [transportApi.reducerPath]: transportApi.reducer,
        [driverApi.reducerPath]: driverApi.reducer,
        [guideApi.reducerPath]: guideApi.reducer,
        [visaApi.reducerPath]: visaApi.reducer,
        [areaMasterApi.reducerPath]: areaMasterApi.reducer,
        [itineraryApi.reducerPath]: itineraryApi.reducer,
        [restaurantApi.reducerPath]: restaurantApi.reducer,
        [sightseeingApi.reducerPath]: sightseeingApi.reducer,
        [transportRouteApi.reducerPath]: transportRouteApi.reducer,
        [packageApi.reducerPath]: packageApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [companyProfileApi.reducerPath]: companyProfileApi.reducer,
        [bankDetailApi.reducerPath]: bankDetailApi.reducer,
        [contactsApi.reducerPath]: contactsApi.reducer,
        [destinationApi.reducerPath]: destinationApi.reducer,
        [travelHistoryApi.reducerPath]: travelHistoryApi.reducer,
        [leadsExtraInfoApi.reducerPath]: leadsExtraInfoApi.reducer,
        [leadRemarksApi.reducerPath]: leadRemarksApi.reducer,
        [emailTemplateApi.reducerPath]: emailTemplateApi.reducer,
        [termsConditionsApi.reducerPath]: termsConditionsApi.reducer,
        [leadSourceApi.reducerPath]: leadSourceApi.reducer,
        [inclusionApi.reducerPath]: inclusionApi.reducer,
        [themeApi.reducerPath]: themeApi.reducer,
        [foodPreferenceApi.reducerPath]: foodPreferenceApi.reducer,
        [proposalImageApi.reducerPath]: proposalImageApi.reducer,
        [packageBookingApi.reducerPath]: packageBookingApi.reducer,
        [dailyCollectionApi.reducerPath]: dailyCollectionApi.reducer,
        [touchPointApi.reducerPath]: touchPointApi.reducer,
        [proposalApi.reducerPath]: proposalApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(b2cLeadApi.middleware)
            .concat(b2bLeadApi.middleware)
            .concat(leadsApi.middleware)
            .concat(messageApi.middleware)
            .concat(supplierApi.middleware)
            .concat(enquirySupplierApi.middleware)
            .concat(supplierContactApi.middleware)
            .concat(supplierBankApi.middleware)
            .concat(queryApi.middleware)
            .concat(followUpApi.middleware)
            .concat(roleApi.middleware)
            .concat(departmentApi.middleware)
            .concat(staffApi.middleware)
            .concat(hotelApi.middleware)
            .concat(transportApi.middleware)
            .concat(driverApi.middleware)
            .concat(guideApi.middleware)
            .concat(visaApi.middleware)
            .concat(areaMasterApi.middleware)
            .concat(itineraryApi.middleware)
            .concat(restaurantApi.middleware)
            .concat(sightseeingApi.middleware)
            .concat(transportRouteApi.middleware)
            .concat(packageApi.middleware)
            .concat(authApi.middleware)
            .concat(companyProfileApi.middleware)
            .concat(bankDetailApi.middleware)
            .concat(contactsApi.middleware)
            .concat(destinationApi.middleware)
            .concat(travelHistoryApi.middleware)
            .concat(leadsExtraInfoApi.middleware)
            .concat(leadRemarksApi.middleware)
            .concat(emailTemplateApi.middleware)
            .concat(termsConditionsApi.middleware)
            .concat(leadSourceApi.middleware)
            .concat(inclusionApi.middleware)
            .concat(themeApi.middleware)
            .concat(foodPreferenceApi.middleware)
            .concat(proposalImageApi.middleware)
            .concat(packageBookingApi.middleware)
            .concat(dailyCollectionApi.middleware)
            .concat(touchPointApi.middleware)
            .concat(proposalApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;