import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bird, Shield, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface AuthFormsProps {
  onSuccess: () => void;
}

export default function AuthForms({ onSuccess }: AuthFormsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAdminInit, setShowAdminInit] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (showAdminInit && (email === 'admin@ysjpoultry.com' || email === 'admin@ysj.com')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: 'Main Admin' }
          }
        });
        if (signUpError) throw signUpError;
        alert("Primary Administrator account created successfully! You can now log in.");
        setShowAdminInit(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          if (signInError.message.toLowerCase().includes('invalid login credentials') && (email === 'admin@ysjpoultry.com' || email === 'admin@ysj.com')) {
             setError("Administrator account not found. Click below to initialize the system.");
             setShowAdminInit(true);
             setLoading(false);
             return;
          }
          throw signInError;
        }
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-green p-6 text-slate-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary-gold rounded-3xl mx-auto flex items-center justify-center border border-primary-green/10">
            <Bird size={32} className="text-primary-green" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary-green">
            Farm Access
          </h1>
          <p className="text-gray-500 font-medium italic">
            YSJ Poultry Farm Portal
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3">
            <Shield size={16} className="flex-shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={showAdminInit}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-gold outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-gold outline-none transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-4 rounded-2xl font-bold active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50",
                showAdminInit ? "bg-primary-gold text-primary-green" : "bg-primary-green text-white"
              )}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (showAdminInit ? "Initialize Admin Account" : "Log In")}
              {!loading && <ArrowRight size={18} />}
            </button>
            
            {showAdminInit && (
              <button 
                type="button"
                onClick={() => {
                  setShowAdminInit(false);
                  setError(null);
                }}
                className="w-full text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                Back to Login
              </button>
            )}
          </form>

          <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
            Authorized Personnel Only • Secure session monitoring active
          </p>
        </div>
      </motion.div>
    </div>
  );
}
