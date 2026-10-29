// ======================================================
// FILE: models/destination.model.ts
// ======================================================

import mongoose,
{
    Schema,
    Document
} from "mongoose";

import {
    IDestination
} from "./destination.interface";

export interface IDestinationDocument
    extends IDestination,
    Document { }

// const StaffSnapshotSchema =
//     new Schema(
//         {
//             _id: {
//                 type: Schema.Types.ObjectId,
//                 ref: "Staff",
//             },

//             name: {
//                 type: String,
//             },
//         },
//         { _id: false }
//     );

const DestinationSchema =
    new Schema<IDestinationDocument>(
        {
            leadId: {
                type: Schema.Types.ObjectId,
                required: true,
                index: true,
            },

            leadModel: {
                type: String,

                enum: [
                    "B2CLead",
                    "B2BLead",
                ],

                required: true,
            },

            country: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            // createdBy: {
            //     type: StaffSnapshotSchema,
            //     default: null,
            // },
        },
        {
            timestamps: true,
        }
    );

DestinationSchema.index({
    leadId: 1,
    leadModel: 1,
});

export default mongoose.model<IDestinationDocument>(
    "Destination",
    DestinationSchema
);