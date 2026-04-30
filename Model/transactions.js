// models/Transaction.js

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    fromAccount: String,
    toAccount: String,

    amount: Number,

    type: {
      type: String,
      enum: ["debit", "credit"]
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },

    reference: String,

    rawResponse: Object
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);