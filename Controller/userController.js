import User from "../Model/users.js";
import bcrypt from "bcryptjs";
import Bvn from "../Model/bvn.js";
import Account from "../Model/accounts.js";
import { generateToken } from "../utils/generateToken.js";
import { createBVN, createNibssAccount } from "../NibssAdapter/nibssExternal.js";

export const userController = {
  // ✅ Register
  async register(req, res) {
    try {
      const { firstName, lastName, email, phone, password, dob } = req.body;
      console.log("📥 Registration request:", { firstName, lastName, email, phone, dob });

      // Check existing user
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }]
      });

      if (existingUser) {
        console.log("❌ User already exists:", email);
        return res.status(400).json({
          status: "error",
          message: "User already exists"
        });
      }

      // 🔥 Step 1: Call NIBSS to create BVN
      console.log("🔄 Step 1: Creating BVN with NIBSS...");
      let bvn;
      try {
        bvn = await createBVN({
          firstName,
          lastName,
          dob,
          phone
        });
        console.log("✅ BVN created:", bvn);
      } catch (bvnError) {
        console.error("❌ BVN Creation Failed:", bvnError.message);
        return res.status(500).json({
          status: "error",
          message: `BVN Error: ${bvnError.message}`
        });
      }

      // 🔥 Step 2: Call NIBSS to create Account (requires Bearer token auth)
      console.log("🔄 Step 2: Creating NIBSS Account...");
      let accountResponse;
      try {
        accountResponse = await createNibssAccount({
          bvn,
          dob
        });
        console.log("✅ Account created:", accountResponse);
      } catch (accountError) {
        console.error("❌ Account Creation Failed:", accountError.message);
        return res.status(500).json({
          status: "error",
          message: `Account Error: ${accountError.message}`
        });
      }

      if (!accountResponse || accountResponse.status !== "success") {
        console.error("❌ Account response invalid:", accountResponse);
        return res.status(500).json({
          status: "error",
          message: "Failed to create NIBSS account - invalid response"
        });
      }

      const accountNumber = accountResponse?.account?.accountNumber;

      if (!accountNumber) {
        console.error("❌ No account number in response:", accountResponse);
        return res.status(500).json({
          status: "error",
          message: "No account number returned from NIBSS"
        });
      }

      // Step 3: Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 4: Create user only after BVN and Account are successful
      console.log("🔄 Step 3: Saving to MongoDB...");
      let user;
      try {
        user = await User.create({
          firstName,
          lastName,
          email,
          phone,
          password: hashedPassword,
          bvn
        });
        console.log("✅ User saved to MongoDB:", user._id);
      } catch (mongoError) {
        console.error("❌ MongoDB User Error:", mongoError.message);
        return res.status(500).json({
          status: "error",
          message: `Database Error (User): ${mongoError.message}`
        });
      }

      // Step 5: Save BVN record linked to user
      let bvnRecord;
      try {
        bvnRecord = await Bvn.create({
          user: user._id,
          bvn,
          firstName,
          lastName,
          dob: new Date(dob),
          phone,
          status: "verified",
          rawResponse: null
        });
        console.log("✅ BVN record saved:");
      } catch (mongoError) {
        console.error("❌ MongoDB BVN Error:", mongoError.message);
        return res.status(500).json({
          status: "error",
          message: `Database Error (BVN): ${mongoError.message}`
        });
      }

      // Step 6: Save Account record linked to user with ₦15,000 pre-funding
      try {
        await Account.create({
          user: user._id,
          bvn: bvnRecord._id,
          accountNumber,
          accountName: `${firstName} ${lastName}`,
          balance: 15000, // Pre-fund with ₦15,000 for testing
          rawResponse: accountResponse
        });
        console.log("✅ Account record saved");
      } catch (mongoError) {
        console.error("❌ MongoDB Account Error:", mongoError.message);
        return res.status(500).json({
          status: "error",
          message: `Database Error (Account): ${mongoError.message}`
        });
      }

      // Generate JWT token for auto-login
      const token = generateToken(user);
      console.log("🎉 Registration complete!");

      return res.status(201).json({
        status: "success",
        message: "User created successfully",
        token,
        data: { 
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            bvn: user.bvn
          },
          bvn, 
          accountNumber 
        }
      });
    } catch (error) {
      console.error("❌ Unexpected Registration Error:", error);
      return res.status(500).json({
        status: "error",
        message: `Registration failed: ${error.message}`
      });
    }
  },


  // ✅ Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).json({
          status: "error",
          message: "Invalid credentials"
        });
      }

      if (user.isLocked) {
        return res.status(403).json({
          status: "error",
          message: "Account is locked"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= 3) {
          user.isLocked = true;
        }

        await user.save();

        return res.status(400).json({
          status: "error",
          message: "Invalid credentials"
        });
      }

      // Reset attempts on success
      user.failedLoginAttempts = 0;
      await user.save();

      const token = generateToken(user);

      return res.status(200).json({
        status: "success",
        token,
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          bvn: user.bvn
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  },

  // ✅ Get Profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);

      return res.status(200).json({
        status: "success",
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  },

  // 🔐 Set Transaction PIN
  async setTransactionPin(req, res) {
    try {
      const { pin } = req.body;

      if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({
          status: "error",
          message: "PIN must be 4 digits"
        });
      }

      const hashedPin = await bcrypt.hash(pin, 10);

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { transactionPin: hashedPin },
        { new: true }
      );

      return res.status(200).json({
        status: "success",
        message: "Transaction PIN set successfully"
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }
};