import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, LogIn, UserPlus, CheckCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { setDocWithTimeout } from '../utils/firestoreHelper';
import { toast } from '../components/Toast';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300);
  const [resendDisabled, setResendDisabled] = useState(true);
  
  const otpInputsRef = useRef([]);
  const navigate = useNavigate();
  const { login, register, logout, profile } = useAuth();

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (showOtpScreen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showOtpScreen, timer]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otpValues];
      if (!otpValues[index] && index > 0) {
        newOtp[index - 1] = '';
        setOtpValues(newOtp);
        otpInputsRef.current[index - 1].focus();
      } else {
        newOtp[index] = '';
        setOtpValues(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtpValues(newOtp);
    otpInputsRef.current[5].focus();
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP.');
      }
      
      setTimer(300);
      setResendDisabled(true);
      setOtpValues(['', '', '', '', '', '']);
      toast.success('A new verification code has been sent to your email.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to resend OTP.');
      toast.error(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        let userCred;
        try {
          userCred = await login(email, password);
        } catch (loginErr) {
          // Auto-provision demo accounts if they don't exist yet
          const normalizedEmail = email.toLowerCase();
          if (normalizedEmail === 'vanitha@clinic.com' || normalizedEmail === 'venugopal@clinic.com' || normalizedEmail === 'admin@clinic.com' || normalizedEmail === 'clinicadmin@clinic.com') {
            try {
              let demoName = 'Clinic Admin';
              let demoRole = 'admin';
              
              if (normalizedEmail.includes('vanitha')) {
                demoName = 'Dr. Vanitha Reddy';
                demoRole = 'doctor';
              } else if (normalizedEmail.includes('venugopal')) {
                demoName = 'Dr. Venugopal Reddy';
                demoRole = 'doctor';
              }

              userCred = await createUserWithEmailAndPassword(auth, email, password);
              await updateProfile(userCred.user, { displayName: demoName });
              await setDocWithTimeout(doc(db, 'users', userCred.user.uid), {
                name: demoName,
                email: email,
                phone: '0000000000',
                role: demoRole,
                createdAt: new Date().toISOString()
              }, {}, 1200);
            } catch (createErr) {
              console.error("Auto-provision error:", createErr);
              throw createErr; // Show the real error so the user knows what failed
            }
          } else {
            throw loginErr;
          }
        }
        
        // Fetch role from Firestore to determine redirect
        const uid = userCred?.user?.uid || auth.currentUser?.uid;
        if (!uid) throw new Error("Authentication failed.");
        
        const userDoc = await getDoc(doc(db, 'users', uid));
        const userRole = userDoc.exists() ? userDoc.data().role : 'patient';
        
        // Use window.location.href to force a full context reload and clear any stale Firebase/React state
        if (userRole === 'doctor') window.location.href = '/doctor';
        else if (userRole === 'admin') window.location.href = '/admin';
        else window.location.href = '/patient-dashboard';
      } else {
        if (!showOtpScreen) {
          const response = await fetch('http://localhost:5000/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to send OTP.');
          }
          
          setShowOtpScreen(true);
          setTimer(300);
          setResendDisabled(true);
          setOtpValues(['', '', '', '', '', '']);
          toast.success('Verification code sent to your email.');
        } else {
          const otpString = otpValues.join('');
          if (otpString.length !== 6) {
            throw new Error('Please enter all 6 digits of the OTP.');
          }
          
          const verifyResponse = await fetch('http://localhost:5000/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp: otpString })
          });
          
          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok) {
            throw new Error(verifyData.message || 'OTP verification failed.');
          }
          
          await register(email, password, name, phone);
          await logout();
          
          toast.success('Registration successful! Please log in.');
          setIsLogin(true);
          setShowOtpScreen(false);
          setEmail('');
          setPassword('');
          setName('');
          setPhone('');
        }
      }
    } catch (err) {
      console.error(err);
      const cleanError = err.message?.replace('Firebase: ', '') || 'Authentication failed. Please verify your credentials.';
      setError(cleanError);
      toast.error(cleanError);
    } finally {
      setLoading(false);
    }
  };

  // Remove handleDemoLogin completely since it's unused

  React.useEffect(() => {
    if (profile) {
      if (profile.role === 'admin') navigate('/admin');
      else if (profile.role === 'doctor') navigate('/doctor');
      else navigate('/patient-dashboard');
    }
  }, [profile, navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-8 space-y-6 relative overflow-hidden transition-all duration-300">
        
        {/* Subtle decorative top border/bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-blue-600" />

        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-blue-50 rounded-2xl text-primary inline-flex items-center justify-center">
            <img src="/assets/logo.png" alt="Vanitha Clinic logo" className="h-10 w-auto rounded-full" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isLogin ? 'Access your personalized healthcare dashboard' : 'Join Vanitha Clinic to book & manage appointments'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start space-x-2 animate-shake" role="alert">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {showOtpScreen ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  We have sent a verification code to
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-1 break-all">
                  {email}
                </p>
              </div>

              {/* 6 OTP Boxes */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    className="w-12 h-12 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                  />
                ))}
              </div>

              {/* Timer and Resend Action */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-sm font-medium text-slate-600">
                  Code expires in: <span className="font-bold text-primary">{formatTime(timer)}</span>
                </div>
                <button
                  type="button"
                  disabled={resendDisabled || loading}
                  onClick={handleResendOtp}
                  className="text-xs font-semibold text-primary hover:text-primary-dark disabled:opacity-50 disabled:pointer-events-none hover:underline focus:outline-none"
                >
                  Resend OTP
                </button>
              </div>

              {/* Verify / Back Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-primary-dark active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Verify & Register</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOtpScreen(false)}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all text-sm focus:outline-none"
                >
                  Back to Registration
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Name Field (Register Mode Only) */}
              {!isLogin && (
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <User size={18} />
                    </span>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Phone Field (Register Mode Only) */}
              {!isLogin && (
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Phone size={18} />
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="yourname@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 px-4 bg-primary text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-primary-dark active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center space-x-2 text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isLogin ? (
                  <>
                    <LogIn size={18} />
                    <span>Log In</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Send OTP</span>
                  </>
                )}
              </button>
            </>
          )}
        </form>

        {/* Footer Link / Toggle */}
        <div className="border-t border-slate-100 pt-5 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setShowOtpScreen(false);
            }}
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors focus:outline-none focus:underline"
          >
            {isLogin ? "Don't have a patient account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default LoginRegister;
