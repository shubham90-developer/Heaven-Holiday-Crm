import { z } from "zod";
import { TERMS_CONDITION_KEYS } from "./termsConditions.constants";

const defaultSelectedSchema = z
    .record(z.string(), z.boolean())
    .optional()
    .default({});

export const termsConditionsValidationSchema = z.object({
    ...Object.fromEntries(
        TERMS_CONDITION_KEYS.map((key) => [
            key,
            z.string().max(100000).optional().default(""),
        ])
    ),
    defaultSelected: defaultSelectedSchema,
});

export type TermsConditionsInput = z.infer<typeof termsConditionsValidationSchema>;
