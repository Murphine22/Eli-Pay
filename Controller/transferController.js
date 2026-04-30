// controllers/transfer.controller.js

import mongoose from "mongoose";
import Account from "../Model/accounts.js";
import Transaction from "../Model/transactions.js";
import { nameEnquiry, transferFunds } from "../NibssAdapter/nibssExternal.js";

export const transfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { to, amount } = req.body;

    // 1️⃣ Get sender account
    const senderAccount = await Account.findOne({ user: userId }).session(session);

    if (!senderAccount) {
      throw new Error("Sender account not found");
    }

    // 2️⃣ Validate balance
    if (senderAccount.balance < amount) {
      return res.status(400).json({
        status: "error",
        message: "Insufficient balance"
      });
    }

    // 3️⃣ Name Enquiry
    const enquiry = await nameEnquiry(to);

    if (!enquiry || enquiry.status !== "success") {
      throw new Error("Invalid destination account");
    }

    const accountName = enquiry?.accountName;

    // 4️⃣ Call NIBSS Transfer
    const transferResponse = await transferFunds({
      from: senderAccount.accountNumber,
      to,
      amount
    });

    if (transferResponse.status !== "success") {
      throw new Error("Transfer failed");
    }

    // 5️⃣ Debit sender
    senderAccount.balance -= amount;
    await senderAccount.save({ session });

    // 6️⃣ Commit transaction
    await session.commitTransaction();

    // 7️⃣ Log transaction

    const transaction = await Transaction.create({
        user: userId,
        fromAccount: senderAccount.accountNumber,
        toAccount: to,
        amount,
        type: "debit",
        status: "Success",
        reference: transferResponse.reference,
        rawResponse: transferResponse
      }, { session });

    return res.status(200).json({
      status: "success",
      message: "Transfer successful",
      data: {
        to,
        accountName,
        amount
      }
    });

  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      status: "error",
      message: error.message
    });
  } finally {
    session.endSession();
  }
};