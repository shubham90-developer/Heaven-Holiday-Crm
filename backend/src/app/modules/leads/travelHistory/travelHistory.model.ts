// ======================================================
// FILE: models/travelHistory.model.ts
// ======================================================

import mongoose,
{
  Schema,
  Document
} from "mongoose";

import {
  ITravelHistory
} from "./travelHistory.interface";

export interface ITravelHistoryDocument
  extends ITravelHistory,
  Document { }

// const StaffSnapshotSchema =
//   new Schema(
//     {
//       _id: {
//         type: Schema.Types.ObjectId,
//         ref: "Staff",
//       },

//       name: {
//         type: String,
//       },
//     },
//     { _id: false }
//   );

const TravelHistorySchema =
  new Schema<ITravelHistoryDocument>(
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
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,

        enum: [
          "⭐",
          "⭐⭐",
          "⭐⭐⭐",
          "⭐⭐⭐⭐",
          "⭐⭐⭐⭐⭐",
        ],

        default: "⭐",
      },

      lastVisited: {
        type: Date,
        required: true,
      },

      //   createdBy: {
      //     type: StaffSnapshotSchema,
      //     default: null,
      //   },
    },
    {
      timestamps: true,
    }
  );

TravelHistorySchema.index({
  leadId: 1,
  leadModel: 1,
});

export default mongoose.model<ITravelHistoryDocument>(
  "TravelHistory",
  TravelHistorySchema
);