import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { accountAPI } from '../services/api';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard,
  User,
  Shield,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [accountRes, transactionsRes] = await Promise.all([
        accountAPI.getBalance(),
        accountAPI.getTransactions(),
      ]);
      
      setAccount(accountRes.data.data);
      setTransactions(transactionsRes.data.data.slice(0, 5)); // Get last 5
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(account?.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your account today
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          <Shield className="w-4 h-4" />
          Account Active
        </div>
      </motion.div>

      {/* Main Card */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative p-8 text-white">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Balance</p>
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-bold">
                  {showBalance ? `₦${account?.balance?.toLocaleString() || '0'}` : '••••••'}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Wallet className="w-7 h-7" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Account Number</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono">{account?.accountNumber}</span>
                <button
                  onClick={copyAccountNumber}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Account Name</p>
              <p className="font-medium">{account?.accountName}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: ArrowUpRight, label: 'Send Money', color: 'from-primary-500 to-primary-600', path: '/transfer' },
          { icon: CreditCard, label: 'Add Money', color: 'from-green-500 to-green-600', path: '#' },
          { icon: Wallet, label: 'Pay Bills', color: 'from-orange-500 to-orange-600', path: '#' },
          { icon: User, label: 'Profile', color: 'from-purple-500 to-purple-600', path: '#' },
        ].map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="group p-4 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-medium text-gray-900 text-sm">{action.label}</p>
          </Link>
        ))}
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
            <Link
              to="/transactions"
              className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              View All →
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions yet</p>
              <Link
                to="/transfer"
                className="inline-block mt-2 text-primary-600 font-medium"
              >
                Make your first transfer
              </Link>
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <div
                key={index}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.type === 'credit' ? 'Received' : 'Sent'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.createdAt), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount?.toLocaleString()}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
