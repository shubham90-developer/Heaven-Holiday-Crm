import { b2cLeadRouter } from "../modules/b2c-lead/b2cLead.routes";
import { b2bLeadRouter } from "../modules/b2b-lead/b2bLead.routes";
import { messageRouter } from "../modules/message/message.routes";
import { leadsRouter } from "../modules/leads/leads.routes";
import { queryRouter } from "../modules/queries/queries.routes";
import { enquirySupplierRouter } from "../modules/enquiry-supplier/enquirySupplier.routes";
import { supplierRouter } from "../modules/my-supplier/supplier/supplier.routes";
import { supplierContactRouter } from "../modules/my-supplier/supplier-contact/supplierContact.routes";
import { supplierBankRouter } from "../modules/my-supplier/supplier-bank/supplierBank.routes";
import { followUpRouter } from "../modules/follow-up/followUp.routes";
import { rolesRouter } from "../modules/staff-management/roles/roles.routes";
import { departmentRouter } from "../modules/staff-management/department/department.routes";
import { staffRouter } from "../modules/staff-management/staff/staff.routes";
import { hotelRouter } from "../modules/inventory/hotel/hotel.routes";
import { vehicleTransportRouter } from "../modules/inventory/vehicles/transport/transport.routes";
import { vehicleDriverRouter } from "../modules/inventory/vehicles/driver/driver.routes";
import { guideRoute } from "../modules/inventory/vehicles/guide/guide.routes";
import { visaRouter } from "../modules/inventory/visa/visa.routes";
import { areaMasterRouter } from "../modules/inventory/area-master/areaMaster.routes";
import { itineraryDescriptionRouter } from "../modules/inventory/itinerary-description/itineraryDescription.routes"
import { restaurantRouter } from "../modules/inventory/restaurants/restaurant.routes";
import { sightseeingRouter } from "../modules/inventory/sightseeing/sightseeing.routes";
import { transportRouter } from "../modules/inventory/transport-route/transportRoute.routes";
import { packageRouter } from "../modules/inventory/package/package.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { companyProfileRouter } from "../modules/settings/compay-profile/companyProfile.routes";
import { bankDetailRouter } from "../modules/settings/compay-profile/bank-details/bankDetail.routes";
import { contactRouter } from "../modules/contacts/contacts.routes";
import { destinationRouter } from "../modules/leads/destination/destination.routes";
import { travelHistoryRouter } from "../modules/leads/travelHistory/travelHistory.routes";
import { leadsExtraInfoRouter } from "../modules/leads/extra-info/leadsExtraInfo.routes";
import { leadRemarksRouter } from "../modules/leads/remark/remark.routes";
import { termsCoditionsRouter } from "../modules/settings/terms-conditions/termsConditions.routes";
import { emailTemplateRouter } from "../modules/settings/email-template/emailTemplate.routes";
import { leadSourceRouter } from "../modules/settings/lead-source/leadSource.routes";
import { inclusionRouter } from "../modules/settings/inclusions/inclusion.routes";
import { themeRouter } from "../modules/settings/themes/theme.routes";
import { foodPreferenceRouter } from "../modules/settings/food-preferences/foodPreference.routes";
import { proposalImageRouter } from "../modules/settings/proposal-images/proposalImage.routes";
import { packageBookingRouter } from "../modules/booking/packages/packages.routes";
import { dailyCollectionRouter } from "../modules/finance/daily-collection/collection.routes";
import { touchPointRouter } from "../modules/touch-points/touchPoint.routes";
import { proposalRouter } from "../modules/proposal/proposal.routes";
import { Router } from "express";

const router = Router();

const moduleRoutes = [
    {
        path: "/b2c-leads",
        route: b2cLeadRouter
    },
    {
        path: "/b2b-leads",
        route: b2bLeadRouter
    },
    {
        path: "/messages",
        route: messageRouter
    },
    {
        path: "/leads",
        route: leadsRouter
    },
    {
        path: "/query",
        route: queryRouter
    },
    {
        path: "/enquiry-supplier",
        route: enquirySupplierRouter
    },
    {
        path: "/supplier",
        route: supplierRouter
    },
    {
        path: "/supplier-contact",
        route: supplierContactRouter,
    },
    {
        path: "/supplier-bank",
        route: supplierBankRouter
    },
    {
        path: "/follow-up",
        route: followUpRouter
    },
    {
        path: "/staff-management/role",
        route: rolesRouter
    },
    {
        path: "/staff-management/department",
        route: departmentRouter
    },
    {
        path: "/staff-management/staff",
        route: staffRouter
    },
    {
        path: "/inventory/hotel",
        route: hotelRouter
    },
    {
        path: "/inventory/vehicle",
        route: vehicleTransportRouter
    },
    {
        path: "/inventory/vehicle",
        route: vehicleDriverRouter
    },
    {
        path: "/inventory/vehicle",
        route: guideRoute
    },
    {
        path: "/inventory/visa",
        route: visaRouter
    },
    {
        path: "/inventory/area-master",
        route: areaMasterRouter
    },
    {
        path: "/inventory/itinerary",
        route: itineraryDescriptionRouter
    },
    {
        path: "/inventory/restaurant",
        route: restaurantRouter
    },
    {
        path: "/inventory/sightseeing",
        route: sightseeingRouter
    },
    {
        path: "/inventory/transport-route",
        route: transportRouter
    },
    {
        path: "/inventory/package",
        route: packageRouter
    },
    {
        path: "/auth",
        route: authRouter
    },
    {
        path: "/settings/company-profile",
        route: companyProfileRouter
    },
    {
        path: "/settings/company-profile/bank-details",
        route: bankDetailRouter
    },
    {
        path: "/query/customer-contact",
        route: contactRouter
    },
    {
        path: "/destination",
        route: destinationRouter
    },
    {
        path: "/travel-history",
        route: travelHistoryRouter
    },
    {
        path: "/leads-extra-info",
        route: leadsExtraInfoRouter
    },
    {
        path: "/remark",
        route: leadRemarksRouter
    },
    {
        path: "/settings/terms-and-conditions",
        route: termsCoditionsRouter
    },
    {
        path: "/settings/email-template",
        route: emailTemplateRouter
    },
    {
        path: "/settings/lead-source",
        route: leadSourceRouter
    },
    {
        path: "/settings/inclusions",
        route: inclusionRouter
    },
    {
        path: "/settings/themes",
        route: themeRouter
    },
    {
        path: "/settings/food-preferences",
        route: foodPreferenceRouter
    },
    {
        path: "/settings/proposal-images",
        route: proposalImageRouter
    },
    {
        path: "/booking/packages",
        route: packageBookingRouter
    },
    {
        path: "/finance/daily-collection",
        route: dailyCollectionRouter
    },
    {
        path: "/proposal",
        route: proposalRouter
    },
    {
        path: "/touch-points",
        route: touchPointRouter
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;