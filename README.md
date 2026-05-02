# EliPay - NIBSS Integrated Banking System

A functional backend system supporting customer onboarding, account management, and core banking operations integrated with NibssByPhoenix APIs.

## Features

### 1. Customer Onboarding System ✅
- BVN/NIN verification via NibssByPhoenix APIs
- Customer verification required before onboarding completion
- Account creation only after successful verification
- 11-digit BVN auto-generated for each customer

### 2. Account Creation ✅
- Maximum 1 account per customer (enforced)
- Pre-funded with ₦15,000 for testing and transactions
- NIBSS account number auto-generated

### 3. Core Banking Operations ✅
- **Name Enquiry**: Verify recipient details before transfer
- **Funds Transfer**: Intra-bank and inter-bank transfers
- **Account Balance Check**: Real-time balance inquiry
- **Transaction Status Check**: Track transfer status

### 4. Transaction History & Data Privacy ✅
- Customers view only their own transaction history
- Strict data isolation - no cross-customer data access
- JWT-based authentication for all protected endpoints

### 5. NibssByPhoenix API Integration ✅
- `/auth/token` - Authentication
- `/api/insertBvn` - BVN creation
- `/api/account/create` - Account creation
- `/api/account/name-enquiry/{accountNumber}` - Name enquiry
- `/api/transfer` - Funds transfer

## API Endpoints

### Public Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "08012345678",
  "password": "password123",
  "dob": "1990-01-01"
}
```

**Flow:**
1. Validates email/phone uniqueness
2. Creates BVN via NIBSS (`/api/insertBvn`)
3. Creates account via NIBSS (`/api/account/create`)
4. Creates user with hashed password
5. Saves BVN record linked to user
6. Saves Account record with ₦15,000 pre-funded balance

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Protected Endpoints (Require Bearer Token)

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Set Transaction PIN
```http
POST /api/users/set-pin
Authorization: Bearer <token>
Content-Type: application/json

{
  "pin": "1234"
}
```

#### Get Account Balance
```http
GET /api/accounts/balance
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accountNumber": "1234567890",
    "accountName": "John Doe",
    "balance": 15000,
    "currency": "NGN"
  }
}
```

#### Name Enquiry
```http
POST /api/accounts/name-enquiry
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountNumber": "1234567890"
}
```

#### Transfer Funds
```http
POST /api/transfers
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "recipient_account_number",
  "amount": 5000
}
```

**Features:**
- Validates sender balance
- Performs name enquiry on recipient
- Calls NIBSS transfer API
- Atomic transaction (debit sender + log transaction)
- Stores transaction record

#### Get Transaction History
```http
GET /api/accounts/transactions
Authorization: Bearer <token>
```

**Features:**
- Returns only authenticated user's transactions
- Sorted by date (newest first)
- Excludes raw API responses for privacy

#### Check Transaction Status
```http
GET /api/accounts/transaction/{reference}
Authorization: Bearer <token>
```

## Security Features

1. **JWT Authentication**: All protected endpoints require valid token
2. **Password Hashing**: bcrypt with salt rounds
3. **Account Lockout**: 3 failed login attempts locks account
4. **Transaction PIN**: 4-digit PIN for transfer authorization
5. **Data Isolation**: Users can only access their own data
6. **Atomic Transactions**: MongoDB sessions for transfer integrity

## Environment Variables

```env
MONGO_URI=mongodb+srv://...
NIBSS_API_SECRET=...
NIBSS_API_KEY=...
PORT=5000
JWT_SECRET=...
```

## Models

### User
- Identity: firstName, lastName
- Contact: email, phone
- Authentication: password (hashed)
- Verification: isEmailVerified, isPhoneVerified
- Fintech: bvn
- Security: transactionPin, failedLoginAttempts, isLocked

### Account
- user (reference)
- bvn (reference)
- accountNumber
- accountName
- balance (default: 15000)
- currency (default: "NGN")
- status (active/inactive/frozen)

### BVN
- user (reference)
- bvn
- firstName, lastName, dob, phone
- status (pending/verified/failed)

### Transaction
- user (reference)
- fromAccount, toAccount
- amount
- type (debit/credit)
- status (pending/success/failed)
- reference

## Testing

### Registration Flow
1. Register a new user → Creates BVN + Account + ₦15,000 balance
2. Login → Receive JWT token
3. Check balance → Should show ₦15,000
4. Perform name enquiry on another account
5. Transfer funds (intra-bank or inter-bank)
6. Check transaction history
7. Verify transaction status

### Between Accounts
- Create multiple users
- Transfer between their accounts
- Verify balances update correctly
- Check transaction history isolation
