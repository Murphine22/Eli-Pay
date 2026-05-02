import { useState } from 'react';
import { accountAPI, transferAPI } from '../services/api';
import { motion } from 'framer-motion';
import { 
  Send, 
  Search, 
  CheckCircle, 
  Loader2, 
  ArrowRight,
  User,
  Building2,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Transfer = () => {
  const [step, setStep] = useState(1);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');

  const handleNameEnquiry = async (e) => {
    e.preventDefault();
    if (!accountNumber || accountNumber.length < 10) {
      toast.error('Please enter a valid account number');
      return;
    }

    setLoading(true);
    try {
      const response = await accountAPI.nameEnquiry(accountNumber);
      setRecipient(response.data.data);
      setStep(2);
      toast.success('Account verified!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Account not found');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await transferAPI.transfer({
        to: accountNumber,
        amount: parseFloat(amount),
      });
      
      setTransactionRef(response.data.data?.reference || '');
      setSuccess(true);
      toast.success('Transfer successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setAccountNumber('');
    setAmount('');
    setRecipient(null);
    setSuccess(false);
    setTransactionRef('');
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Successful!</h2>
          <p className="text-gray-600 mb-6">
            ₦{parseFloat(amount).toLocaleString()} has been sent to {recipient?.accountName}
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Transaction Reference</p>
            <p className="font-mono text-lg text-gray-900">{transactionRef}</p>
          </div>

          <button
            onClick={resetForm}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold hover:shadow-lg transition-all"
          >
            Make Another Transfer
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Send Money</h1>
          <p className="text-gray-600">Transfer funds to any bank account</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleNameEnquiry} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter 10-digit account number"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all pl-11"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || accountNumber.length < 10}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 2 && recipient && (
          <form onSubmit={handleTransfer} className="space-y-6">
            {/* Recipient Card */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{recipient.accountName}</p>
                  <p className="text-sm text-gray-500">{recipient.accountNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{recipient.bankName || 'NibssByPhoenix'}</span>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₦)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all pl-10"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Money
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Transfer;
