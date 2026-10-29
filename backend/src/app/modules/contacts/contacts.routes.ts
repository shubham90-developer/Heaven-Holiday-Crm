import express from "express";

import {
    createContact,
    deleteContact,
    getLeadContacts,
    getSingleContact,
    updateContact,
} from "./contacts.controller";

const router = express.Router();

router.post(
    "/",
    createContact
);

router.get(
    "/:leadId",
    getLeadContacts
);

router.get(
    "/:contactId",
    getSingleContact
);

router.put(
    "/:contactId",
    updateContact
);

router.delete(
    "/:contactId",
    deleteContact
);

export const contactRouter = router;