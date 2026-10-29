import { TermsConditionKey } from "./termsConditions.constants";

export type ITermsConditions = Record<TermsConditionKey, string> & {
    defaultSelected?: Partial<Record<TermsConditionKey, boolean>>;
};
