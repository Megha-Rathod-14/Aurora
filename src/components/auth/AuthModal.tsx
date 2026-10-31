import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { Logo } from '../common/Logo';
import { Avatar } from '../common/Avatar';
import { Sparkles, Mail, Lock, User, AtSign, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, switchDemoUser, allDemoUsers } = useAuth();
  const { showToast, triggerNeonCelebration } = useSocial();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = await login(email, password);
    if (success) {
      showToast('Welcome back to Aurora! ⚡', 'neon');
      triggerNeonCelebration();
      onClose();
    } else {
      setErrorMsg('Invalid credentials. Try Demo One-Click Sign In below.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim() || !fullName.trim() || !email.trim()) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    const success = await signup({
      username,
      fullName,
      email,
      password,
    });

    if (success) {
      showToast(`Welcome to Aurora, ${fullName}! 🌌`, 'neon');
      triggerNeonCelebration();
      onClose();
    } else {
      setErrorMsg('Failed to create account. Please try again.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setResetSent(true);
    showToast('Password reset link transmitted to email ✨', 'neon');
  };

  const handleDemoSignIn = (userId: string) => {
    switchDemoUser(userId);
    showToast('Signed in via Aurora Demo Pass! ⚡', 'neon');
    triggerNeonCelebration();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 select-none">
      <div className="relative w-full max-w-md bg-[#121218] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,217,255,0.25)] flex flex-col items-center animate-slide-in">
        {/* Hummingbird Logo with Glowing Aura */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="xl" showText={true} showTagline={true} />
        </div>

        {/* Tab switchers */}
        <div className="w-full flex items-center justify-center gap-1 p-1 bg-[#0B0B0F] rounded-2xl mb-6 border border-white/5">
          <button
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
              setResetSent(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'login'
                ? 'bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white shadow-md'
                : 'text-[#A0A0AA] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setErrorMsg('');
              setResetSent(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'register'
                ? 'bg-gradient-to-r from-[#FF258A] to-[#9B59FF] text-white shadow-md'
                : 'text-[#A0A0AA] hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="w-full p-3 rounded-xl bg-[#FF258A]/15 border border-[#FF258A]/30 text-xs text-[#FF258A] mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A0A0AA] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="creator@aurora.network"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#00D9FF]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-[#A0A0AA] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[10px] text-[#00D9FF] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A0A0AA] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#00D9FF]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:scale-102 transition-all flex items-center justify-center gap-2"
            >
              Sign In to Aurora
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A0A0AA] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Lyra Phoenix"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#FF258A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1">
                Username
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-[#A0A0AA] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="lyraphoenix"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#FF258A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A0A0AA] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="lyra@aurora.network"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#FF258A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A0A0AA] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#FF258A]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-[#FF258A] to-[#9B59FF] text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(255,37,138,0.4)] hover:scale-102 transition-all flex items-center justify-center gap-2"
            >
              Join Aurora Network
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD */}
        {authMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="w-full flex flex-col gap-4">
            <p className="text-xs text-[#A0A0AA] text-center leading-relaxed">
              Enter the email address registered with your Aurora identity to receive a magic recovery link.
            </p>

            {resetSent ? (
              <div className="p-4 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-center">
                <Check className="w-6 h-6 text-[#00D9FF] mx-auto mb-2" />
                <p className="text-xs font-bold text-white">Transmission Dispatched!</p>
                <p className="text-[11px] text-[#A0A0AA] mt-1">
                  Check your inbox for password reset instructions.
                </p>
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A0A0AA] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="creator@aurora.network"
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={resetSent}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white font-bold text-xs uppercase shadow-md disabled:opacity-50"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-xs text-[#A0A0AA] hover:text-white text-center"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* ONE-CLICK DEMO CREATOR QUICK SIGN IN */}
        {/* ============================================================== */}
        <div className="w-full mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A0A0AA] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00D9FF]" />
              Quick Demo Pass (1-Click)
            </span>
            <span className="text-[10px] text-[#FFC83D] font-mono">No password required</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {allDemoUsers.slice(0, 4).map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleDemoSignIn(u.id)}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#0B0B0F] border border-white/5 hover:border-[#00D9FF]/40 text-left transition-all hover:scale-102 group"
              >
                <Avatar src={u.avatarUrl} alt={u.fullName} size="xs" isVerified={u.isVerified} />
                <div className="truncate">
                  <p className="text-[11px] font-bold text-white group-hover:text-[#00D9FF] truncate">
                    {u.fullName.split(' ')[0]}
                  </p>
                  <p className="text-[9px] text-[#A0A0AA] truncate">@{u.username}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

