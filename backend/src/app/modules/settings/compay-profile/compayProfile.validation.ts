import { z } from "zod";

export const companyProfileValidationSchema =
    z.object({

        personalDetails: z.object({
            firstName: z.string(),
            lastName: z.string(),
            designation: z.string(),
            mobileNumber: z.string(),
            email: z.string().email(),
            senderEmail: z.string().email()
        }),

        companyDetails: z.object({
            companyName: z.string(),
            companyDisplayName: z.string(),

            gstNumber: z.string().optional(),
            companyLogo: z.string().optional(),

            companyNumber: z.string().optional(),

            companyEmail:
                z.string().email().optional(),

            transactionCurrency:
                z.enum(["INR", "USD"]),

            registeredAddress: z.object({
                addressLine1: z.string(),
                addressLine2: z.string().optional(),
                country: z.string(),
                city: z.string(),
                pinCode: z.string()
            }),

            expertiseCountry:
                z.string().optional(),

            expertiseCity:
                z.string().optional()
        }),

        moreAboutCompany: z.object({
            aboutCompany:
                z.string().optional(),

            certificationOfTrade:
                z.array(z.string()).optional(),

            recognitionFromGovernment:
                z.array(z.string()).optional(),

            socialLinks: z.object({
                facebook:
                    z.string().optional(),

                google:
                    z.string().optional(),

                youtube:
                    z.string().optional(),

                twitter:
                    z.string().optional(),

                instagram:
                    z.string().optional(),

                pinterest:
                    z.string().optional(),

                googleFeedback:
                    z.string().optional()
            }).optional()
        })
    });