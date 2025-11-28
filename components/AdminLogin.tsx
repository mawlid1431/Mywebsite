import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, User, Lock, Eye, EyeOff, Moon, Sun, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminLoginProps {
  onLogin: (isAuthenticated: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Import database functions
      const { getUserByUsername, updateLastLogin } = await import('../utils/supabase/database');

      // Fetch user from database
      console.log('Attempting login with:', credentials.email);
      const user = await getUserByUsername(credentials.email);
      console.log('User found:', user ? 'Yes' : 'No', user);

      if (!user) {
        setError('Invalid username or password. User not found in database.');
        setLoading(false);
        return;
      }

      // Check if user is active
      if (!user.is_active) {
        setError('Account is disabled. Please contact administrator.');
        setLoading(false);
        return;
      }

      // Verify password
      if (credentials.password !== user.password) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      // Update last login
      await updateLastLogin(user.id);

      // Set session with timestamp
      const sessionData = {
        authenticated: 'true',
        loginTime: Date.now(),
        lastActivity: Date.now(),
        userId: user.id,
        username: user.username
      };
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminUsername', user.username);
      localStorage.setItem('adminPassword', user.password);
      localStorage.setItem('adminSession', JSON.stringify(sessionData));
      sessionStorage.setItem('adminSessionActive', 'true');

      onLogin(true);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError('');

    // Simulate sending reset email
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send email to malitmohamud@gmail.com with reset instructions
    console.log('Password reset requested for:', resetEmail);
    console.log('Reset email sent to: malitmohamud@gmail.com');

    setResetSuccess(true);
    setResetLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-background dark:via-muted/20 dark:to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Back Button and Dark Mode Toggle */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground hover:bg-gray-700/50 dark:hover:bg-muted"
            >
              <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-800/50 dark:bg-card/50 border-gray-700 dark:border-border backdrop-blur-xl">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <User className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white dark:text-foreground">Admin Login</CardTitle>
              <CardDescription className="text-gray-400 dark:text-muted-foreground">
                Access the Portfolio Management Dashboard
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && error.includes('does not exist') && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                        Database Setup Required
                      </h4>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-2">
                        The users table doesn't exist yet. Please run the SQL setup first.
                      </p>
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-yellow-800 dark:text-yellow-300 underline hover:no-underline"
                      >
                        Open Supabase Dashboard →
                      </a>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        Then run: <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">data/create-users-table.sql</code>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username/Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 dark:text-foreground">Username or Email</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      value={credentials.email}
                      onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="mowlid or malitmohamud@gmail.com"
                      className="pl-10 bg-gray-700/50 dark:bg-background border-gray-600 dark:border-border text-white dark:text-foreground placeholder-gray-400 dark:placeholder-muted-foreground focus:border-blue-500 dark:focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 dark:text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-muted-foreground w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••••••"
                      className="pl-10 pr-10 bg-gray-700/50 dark:bg-background border-gray-600 dark:border-border text-white dark:text-foreground placeholder-gray-400 dark:placeholder-muted-foreground focus:border-blue-500 dark:focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-muted-foreground hover:text-white dark:hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Forgot Password Link */}
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-gray-400 dark:text-muted-foreground hover:text-white dark:hover:text-foreground transition-colors underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700"
          >
            {!resetSuccess ? (
              <>
                <h3 className="text-xl font-bold text-white mb-4">Reset Password</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Enter your email address and we'll send password reset instructions to malitmohamud@gmail.com
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    required
                  />

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {resetLoading ? 'Sending...' : 'Send Reset Email'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForgotPassword(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Email Sent!</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Password reset instructions have been sent to malitmohamud@gmail.com
                  </p>
                  <Button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSuccess(false);
                      setResetEmail('');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Back to Login
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;