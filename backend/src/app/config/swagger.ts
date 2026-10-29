import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Heaven Holiday - CRM (Customer Relationship Management)",
            version: "1.0.0",
            description: "This is a Swagger API Documentation of Heaven Holiday CRM (Customer Relationship Management)",
        },

        servers: [
            {
                url: "http://localhost:9000",
            },
        ],

        tags: [
            {
                name: "Authentication",
                description:
                    "Secure authentication module for administrator access management, supporting user registration, login, logout, JWT-based session handling, HTTP-only cookie authentication, and role-based access control for protected CRM operations.",
            },
            {
                name: "CRM / Sales - Leads",
                description:
                    "Centralized lead management module displaying and processing all B2C and B2B customer inquiries, enabling unified tracking, assignment, follow-up, and sales conversion workflows.",
            },
            {
                name: "CRM / Sales - Leads - Customer Profile - Destination (Want To Go)",
                description:
                    "Creates a destination preference for a lead by storing the country and city the customer wishes to visit. This information is maintained within the customer profile for travel planning and lead qualification purposes.",
            },
            {
                name: "CRM / Sales - Leads - Customer Profile - Travel History (Have Been To)",
                description:
                    "Manage customer travel history by recording countries and cities previously visited. This information helps sales teams understand customer travel experience, preferences, and qualification details for future travel planning.",
            },
            {
                name: "CRM / Sales - Leads - Customer Profile - Travel History (Have Been To)",
                description:
                    "Manage customer travel history by recording countries and cities previously visited. This information helps sales teams understand customer travel experience, preferences, and qualification details for future travel planning.",
            },
            {
                name: "CRM / Sales - Leads - Customer Profile - Remark",
                description:
                    "Manage customer remarks, follow-ups, meeting notes, callbacks, and sales interactions associated with a lead. Remarks help sales teams track communication history, customer engagement, and lead progression throughout the sales lifecycle.",
            },
            {
                name: "CRM / Sales - Leads - Customer Profile - Leads Extra Info",
                description:
                    "Manage additional customer profile information such as date of birth and anniversary details associated with a lead. This information helps sales teams personalize customer interactions, improve relationship management, and support customer engagement activities.",
            },
            {
                name: "CRM / Sales - Queries",
                description:
                    "This module manages all customer and business enquiry workflows generated from B2C and B2B leads. It handles travel requirement capture such as packages, flights, visas, hotels, transfers, and other services. Each query is tracked through lifecycle stages like creation, follow-ups, negotiation, confirmation, and closure, enabling full sales pipeline visibility.",
            },
            {
                name: "CRM / Sales - Confirmed Queries",
                description:
                    "This module manages all B2B & B2C confirmed queries",
            },
            {
                name: "CRM / Sales - B2B Customers (Business-to-Business)",
                description:
                    `This B2B CRM sub-module manages business inquiries received from agencies, corporate clients, and potential partners for collaborations, partnerships, and business engagements. It enables structured lead capture, validation, tracking, assignment, and processing through the sales pipeline.`,
            },
            {
                name: "CRM / Sales - B2C Customers (Business-to-Customers)",
                description:
                    "This B2C CRM sub-module manages inquiries received directly from individual customers seeking travel services. It supports customer lead capture, interaction tracking, gather & processing queries, assignment to sales executives, and follow-up management for successful conversions.",
            },
            {
                name: "CRM / Sales - My Suppliers (Supplier)",
                description:
                    "This sub-module manages supplier master data including company details, contacts, banking information, services, and compliance details for B2B and B2C operations.",
            },
            {
                name: "CRM / Sales - My Suppliers (Supplier Bank)",
                description:
                    "This sub-module manages supplier banks data including banking information for B2B and B2C operations.",
            },
            {
                name: "CRM / Sales - My Suppliers (Supplier Contact)",
                description:
                    "This sub-module manages suppliers contacts data including designation, email, department, country, state for B2B and B2C operations.",
            },
            {
                name: "CRM / Sales - Archived Leads",
                description:
                    "This sub-module manages all B2B & B2C archived leads i.e leads data that has been lost, unanswered, lost etc",
            },
            {
                name: "My Inventory - Packages",
                description:
                    "This sub-module manages travel package master data including package definitions, travel modes, destination coverage, supplier allocation, themes, inclusives, package specifications, media assets, and reusable metadata for itinerary planning and package configuration.",
            },
            {
                name: "My Inventory - Hotels",
                description:
                    "This sub-module manages hotel inventory including hotel details, room categories, check-in/check-out schedules, contact information, weekend availability, and accommodation metadata.",
            },
            {
                name: "My Inventory - Sightseeing",
                description:
                    "This sub-module manages sightseeing master data including attraction details, geo-location mapping, activity categories, operational timings, visitor constraints, pickup logistics, inclusions, policies, and reusable destination experience metadata for itinerary planning and tour configuration.",
            },
            {
                name: "My Inventory - Vehicles (Transport)",
                description:
                    "This sub-module manages vehicle and transport inventory including transport categories, vehicle details, seating capacity, AC availability, registration numbers, fleet quantity, and transport allocation metadata.",
            },
            {
                name: "My Inventory - Vehicles (Driver)",
                description:
                    "This sub-module manages driver inventory including driver profiles, contact details, language proficiency, address information, driving license details, assigned primary vehicles, and operational driver allocation metadata.",
            },
            {
                name: "My Inventory - Vehicles (Guide)",
                description:
                    "This sub-module manages driver inventory including driver profiles, contact details, language proficiency, address information, driving license details, assigned primary vehicles, and operational driver allocation metadata.",
            },
            {
                name: "My Inventory - Transport Route",
                description:
                    "This sub-module manages transport route master data including transfer categories, route mapping, city coverage, vehicle pricing configurations, seasonal rate structures, pickup and drop logistics, regional transport rules, and reusable route metadata for itinerary costing and travel operations planning.",
            },
            {
                name: "My Inventory - Visa",
                description:
                    "This sub-module manages visa master data including visa types, destination coverage, traveler nationality rules, processing timelines, fee structures, supplier associations, service provider configurations, markup rules, and reusable visa processing metadata for travel operations and booking workflows.",
            },
            {
                name: "My Inventory - Restaurants",
                description:
                    "This sub-module manages restaurant inventory including restaurant locations, supplier associations, meal offerings, cuisine preferences, accommodation meal plans, and restaurant service allocation metadata.",
            },
            {
                name: "My Inventory - Itinerary Description",
                description:
                    "This sub-module manages itinerary master descriptions including travel route definitions, start and destination cities, itinerary titles, operational status, and reusable itinerary configuration metadata for package planning.",
            },
            {
                name: "My Inventory - Area Master",
                description:
                    "This sub-module manages destination area master data including city-wise area definitions, operational status, and reusable location metadata for itinerary planning, hotel mapping, restaurant allocation, and travel logistics configuration.",
            },
            {
                name: "Staff Management - Department",
                description:
                    "This sub-module manages departments within the organization for staff role allocation, operational categorization, and workflow management.",
            },
            {
                name: "Staff Management - Roles",
                description:
                    "This sub-module manages staff roles within the organization for access control, responsibility allocation, and hierarchical workflow management.",
            },
            {
                name: "Staff Management - Staff",
                description:
                    "This sub-module manages staff profiles, organizational hierarchy, role assignments, permissions, communication settings, and employee operational status across the system.",
            },
            {
                name: "Settings - Company Profile",
                description:
                    "Company profile management module for storing and managing organization details including personal information, company details, registered address, transaction currency, social media links, trade certifications, government recognitions, company branding assets, and agency signature information for CRM operations.",
            },
            {
                name: "Settings - Company Profile (Bank Details)",
                description:
                    "Bank details management module for securely storing and managing company banking information including account holder details, account numbers, IFSC codes, account types, bank branches, active bank selection, and company-linked financial account records for CRM and transaction operations.",
            },
        ],
    },

    apis: ["./src/app/modules/**/*.ts",
        "./src/app/modules/**/**/*.ts"
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;