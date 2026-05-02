import Account from "../Model/accounts.js";
import Transaction from "../Model/transactions.js";
import { nameEnquiry } from "../NibssAdapter/nibssExternal.js";

export const accountController = {
  // ✅ Get Account Balance
  async getBalance(req, res) {
    try {
      const userId = req.user.id;

      const account = await Account.findOne({ user: userId });

      if (!account) {
        return res.status(404).json({
          status: "error",
          message: "Account not found"
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          accountNumber: account.accountNumber,
          accountName: account.accountName,
          balance: account.balance,
          currency: account.currency
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  },

  // ✅ Name Enquiry
  async nameEnquiry(req, res) {
    try {
      const { accountNumber } = req.body;

      if (!accountNumber) {
        return res.status(400).json({
          status: "error",
          message: "Account number is required"
        });
      }

      const enquiry = await nameEnquiry(accountNumber);

      if (!enquiry || enquiry.status !== "success") {
        return res.status(404).json({
          status: "error",
          message: "Account not found"
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          accountNumber: enquiry.account?.accountNumber,
          accountName: enquiry.account?.accountName,
          bankName: enquiry.account?.bankName
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  },

  // ✅ Get Transaction History (User can only see their own)
  async getTransactionHistory(req, res) {
    try {
      const userId = req.user.id;

      const transactions = await Transaction.find({ user: userId })
        .sort({ createdAt: -1 })
        .select("-rawResponse"); // Exclude raw response for privacy

      return res.status(200).json({
        status: "success",
        count: transactions.length,
        data: transactions
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  },

  // ✅ Check Transaction Status
  async checkTransactionStatus(req, res) {
    try {
      const userId = req.user.id;
      const { reference } = req.params;

      const transaction = await Transaction.findOne({
        reference,
        user: userId // Ensure user can only check their own transactions
      });

      if (!transaction) {
        return res.status(404).json({
          status: "error",
          message: "Transaction not found"
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          reference: transaction.reference,
          status: transaction.status,
          amount: transaction.amount,
          type: transaction.type,
          fromAccount: transaction.fromAccount,
          toAccount: transaction.toAccount,
          createdAt: transaction.createdAt
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }
};
