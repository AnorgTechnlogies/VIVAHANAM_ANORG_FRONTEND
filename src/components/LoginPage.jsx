import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login', 'forgot', 'verify', 'success'

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_KEY;

  // Step 1: Request verification code
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!authEmail) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: authEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to send verification code`);
      }

      setSuccess("✅ Verification code sent to your email! Please check your inbox.");
      setAuthMode("verify"); // Move to verification step
      
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!verificationCode || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: authEmail, // Using email directly
          verificationCode: verificationCode,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Password reset failed`);
      }

      setSuccess("✅ Password reset successfully! You can now login with your new password.");
      setAuthMode("success"); // Move to success step
      
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!authEmail || !authPassword) {
      setError("Please fill in email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: authEmail,
          password: authPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Login failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('vivahanamToken', data.token);
      }

      // Store user data if needed
      if (data.user) {
        localStorage.setItem('vivahanamUser', JSON.stringify(data.user));
      }

      navigate("/partners");
      
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.message || "Invalid credentials. Please register if you don't have an account.";
      if (err.message.includes('verify your email') || err.message.includes('verification')) {
        setError("Please check your email for verification code and verify before logging in.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setAuthMode("login");
    setError("");
    setSuccess("");
    setAuthEmail("");
    setAuthPassword("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const switchToForgot = () => {
    setAuthMode("forgot");
    setError("");
    setSuccess("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const requestNewCode = () => {
    setAuthMode("forgot");
    setError("");
    setSuccess("");
    setVerificationCode("");
    // Keep the email filled in
  };

  const getTitle = () => {
    switch (authMode) {
      case "login":
        return "Welcome Back";
      case "forgot":
        return "Reset Your Password";
      case "verify":
        return "Enter Verification Code";
      case "success":
        return "Password Reset Successful!";
      default:
        return "Welcome Back";
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case "login":
        return "Sign in to your account to continue";
      case "forgot":
        return "Enter your email to receive a verification code";
      case "verify":
        return "Enter the code and your new password";
      case "success":
        return "Your password has been reset successfully";
      default:
        return "Sign in to your account to continue";
    }
  };

  const getButtonText = () => {
    if (loading) {
      switch (authMode) {
        case "login":
          return "Signing in...";
        case "forgot":
          return "Sending code...";
        case "verify":
          return "Resetting password...";
        default:
          return "Processing...";
      }
    }
    
    switch (authMode) {
      case "login":
        return "Sign in";
      case "forgot":
        return "Send Verification Code";
      case "verify":
        return "Reset Password";
      case "success":
        return "Back to Login";
      default:
        return "Sign in";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-2xl shadow-lg">
              <span className="text-2xl font-bold">V</span>
              <span className="text-xl font-semibold">IVAHANAM</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {getTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getSubtitle()}
          </p>
          
          {/* Show email in verify mode for context */}
          {authMode === "verify" && authEmail && (
            <p className="mt-1 text-sm text-amber-600 font-medium">
              📧 Code sent to: {authEmail}
            </p>
          )}
        </div>

        {/* Auth Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-amber-200" onSubmit={
          authMode === "login" ? handleLogin :
          authMode === "forgot" ? handleForgotPassword :
          authMode === "verify" ? handleResetPassword :
          switchToLogin
        }>
          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Success Screen */}
          {authMode === "success" && (
            <div className="text-center py-4">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successful!</h3>
              <p className="text-gray-600">You can now login with your new password.</p>
            </div>
          )}

          {/* Email Field - Show for login and forgot */}
          {(authMode === "login" || authMode === "forgot") && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:z-10 transition-colors"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          )}

          {/* Verification Code + New Password Fields - Show for verify mode */}
          {authMode === "verify" && (
            <>
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="6"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:z-10 transition-colors text-center text-lg font-mono tracking-widest"
                  placeholder="000000"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  ⏰ 6-digit code (expires in 10 minutes)
                </p>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:z-10 transition-colors"
                  placeholder="Enter new password (min 6 characters)"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:z-10 transition-colors"
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>

              {/* Request new code link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={requestNewCode}
                  className="text-sm text-amber-600 hover:text-amber-500 transition-colors font-medium"
                  disabled={loading}
                >
                  🔄 Didn't receive code? Request new one
                </button>
              </div>
            </>
          )}

          {/* Password Field - Show for login */}
          {authMode === "login" && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:z-10 transition-colors"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
          )}

          {/* Remember Me and Forgot Password - Only show for login */}
          {authMode === "login" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={switchToForgot}
                className="text-sm font-medium text-amber-600 hover:text-amber-500 transition-colors"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type={authMode === "success" ? "button" : "submit"}
              onClick={authMode === "success" ? switchToLogin : undefined}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {getButtonText()}
                </div>
              ) : (
                getButtonText()
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="text-center space-y-2">
            {authMode === "login" ? (
              <>
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
                  >
                    Register now
                  </Link>
                </p>
              </>
            ) : authMode === "success" ? (
              <p className="text-sm text-gray-600">
                Ready to login?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
                >
                  Click here to login
                </button>
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
                    disabled={loading}
                  >
                    Back to login
                  </button>
                </p>
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
                  >
                    Register now
                  </Link>
                </p>
              </>
            )}
          </div>
        </form>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-amber-600 hover:text-amber-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-amber-600 hover:text-amber-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;