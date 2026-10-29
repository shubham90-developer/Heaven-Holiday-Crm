import express from "express";
import {
    createOrUpdateCompanyProfile,
    getCompanyProfile
} from "./companyProfile.controller";
import { verifyToken } from "../../../middleware/tokenVerification";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Settings - Company Profile
 *   description: Company profile management APIs
 */

/**
 * @swagger
 * /v1/api/settings/company-profile:
 *   post:
 *     summary: Create or update company profile
 *     tags: [Settings - Company Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personalDetails:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: Muskan
 *                   lastName:
 *                     type: string
 *                     example: Mujavar
 *                   designation:
 *                     type: string
 *                     example: Backend Developer
 *                   mobileNumber:
 *                     type: string
 *                     example: "9876543210"
 *                   email:
 *                     type: string
 *                     example: muskan@gmail.com
 *                   senderEmail:
 *                     type: string
 *                     example: noreply@company.com
 *
 *               companyDetails:
 *                 type: object
 *                 properties:
 *                   companyName:
 *                     type: string
 *                     example: Heaven Holiday
 *                   companyDisplayName:
 *                     type: string
 *                     example: Heaven Holiday Pvt Ltd
 *                   gstNumber:
 *                     type: string
 *                     example: 27ABCDE1234F1Z5
 *                   companyLogo:
 *                     type: string
 *                     example: https://example.com/logo.png
 *                   companyNumber:
 *                     type: string
 *                     example: "9876543210"
 *                   companyEmail:
 *                     type: string
 *                     example: info@heavenholiday.com
 *                   transactionCurrency:
 *                     type: string
 *                     enum: [INR, USD]
 *                     example: INR
 *
 *                   registeredAddress:
 *                     type: object
 *                     properties:
 *                       addressLine1:
 *                         type: string
 *                         example: MG Road
 *                       addressLine2:
 *                         type: string
 *                         example: Near WTC
 *                       country:
 *                         type: string
 *                         example: India
 *                       city:
 *                         type: string
 *                         example: Pune
 *                       pinCode:
 *                         type: string
 *                         example: "411014"
 *
 *                   expertiseCountry:
 *                     type: string
 *                     example: Dubai
 *                   expertiseCity:
 *                     type: string
 *                     example: Abu Dhabi
 *                   agencySignature:
 *                     type: string
 *                     example: Authorized Signatory
 *                   agencySignatureImage:
 *                     type: string
 *                     example: https://example.com/signature.png
 *                   invoiceSignatureImage:
 *                     type: string
 *                     example: https://example.com/invoice-signature.png
 *                   addressProof:
 *                     type: string
 *                     example: https://example.com/address-proof.pdf
 *
 *               moreAboutCompany:
 *                 type: object
 *                 properties:
 *                   aboutCompany:
 *                     type: string
 *                     example: We provide international travel services.
 *
 *                   certificationOfTrade:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - ISO Certified
 *                       - IATA Approved
 *
 *                   recognitionFromGovernment:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - Ministry of Tourism
 *
 *                   socialLinks:
 *                     type: object
 *                     properties:
 *                       facebook:
 *                         type: string
 *                         example: https://facebook.com/company
 *                       google:
 *                         type: string
 *                         example: https://google.com/company
 *                       youtube:
 *                         type: string
 *                         example: https://youtube.com/company
 *                       twitter:
 *                         type: string
 *                         example: https://twitter.com/company
 *                       instagram:
 *                         type: string
 *                         example: https://instagram.com/company
 *                       pinterest:
 *                         type: string
 *                         example: https://pinterest.com/company
 *                       googleFeedback:
 *                         type: string
 *                         example: https://g.page/company/review
 *
 *     responses:
 *       200:
 *         description: Company profile saved successfully
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, createOrUpdateCompanyProfile);
/**
 * @swagger
 * /v1/api/settings/company-profile:
 *   get:
 *     summary: Get logged in user's company profile
 *     tags: [Settings - Company Profile]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Company profile fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", verifyToken, getCompanyProfile);

export const companyProfileRouter = router;