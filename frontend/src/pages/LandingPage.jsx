import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight,
  CreditCard,
  Smartphone,
  Lock
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Banking',
      description: 'Bank-grade security with encryption and multi-factor authentication',
    },
    {
      icon: Zap,
      title: 'Instant Transfers',
      description: 'Send money instantly to any bank account in Nigeria',
    },
    {
      icon: Globe,
      title: '24/7 Access',
      description: 'Bank anytime, anywhere with our digital platform',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">EliPay</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="hidden sm:block text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Powered by NIBSS
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Banking Made{' '}
                <span className="gradient-text">Simple & Secure</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Experience seamless banking with instant transfers, secure payments, 
                and real-time notifications. Your money, your control.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300"
                >
                  Open Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-primary-500 hover:text-primary-600 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl shadow-primary-500/20 p-6 max-w-sm mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Welcome back</p>
                        <p className="font-semibold text-gray-900">John Doe</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-primary-600 to-secondary-500 rounded-2xl p-5 text-white mb-6">
                    <p className="text-sm opacity-80 mb-1">Total Balance</p>
                    <p className="text-3xl font-bold">₦150,000.00</p>
                    <div className="flex items-center gap-2 mt-4">
                      <CreditCard className="w-5 h-5 opacity-80" />
                      <span className="text-sm opacity-80">•••• 4582</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[SendIcon, HistoryIcon, WalletIcon].map((Icon, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <Icon className="w-6 h-6 text-gray-600" />
                        <span className="text-xs text-gray-600">Action</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Background decorations */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow delay-1000"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="gradient-text">EliPay</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience banking that puts you first with cutting-edge technology 
              and unmatched security
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-500 p-10 sm:p-16 text-center"
          >
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
                Join thousands of users who trust EliPay for their daily banking needs
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-600 font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">
            © 2024 EliPay. All rights reserved. Powered by NIBSS
          </p>
        </div>
      </footer>
    </div>
  );
};

// Icon components for the mock UI
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const HistoryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WalletIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export default LandingPage;
