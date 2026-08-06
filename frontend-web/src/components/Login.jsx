import React, { useState } from 'react';
import { Science, Email, Person, Business, Key, Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('user');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatNameFromEmail = (rawEmail) => {
    if (!rawEmail) return 'Biomedical Researcher';
    const prefix = rawEmail.split('@')[0];
    return prefix
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match! Please verify both password fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const endpoint = isRegister ? 'http://localhost:8000/auth/register' : 'http://localhost:8000/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isRegister
            ? { name: name || formatNameFromEmail(email), email, password, organization: organization || 'Biomedical Research Institute', role }
            : { email, password }
        )
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Authentication failed. Please check your credentials.');
      }

      const result = await response.json();
      
      let userData;
      if (isRegister) {
        // After successful registration, automatically log user in with returned user object
        userData = result;
      } else {
        userData = result.user;
      }

      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
      }
      localStorage.setItem('user', JSON.stringify(userData));

      setLoading(false);
      onLoginSuccess(userData);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err.message || 'Invalid email or password! Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Panel: Enterprise Branding */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-r border-slate-800/80 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Science className="text-xl" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Enterprise AI Platform</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1 leading-tight">
                Natural Biomaterial Composite Predictor
              </h1>
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Industrial AI engine predicting tensile strength, elastic modulus, degradation rates, and weight loss of biopolymer composites before laboratory manufacturing.
            </p>
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-800/80 pt-4">
            <p className="font-semibold text-slate-400">Secure Laboratory System</p>
            <p className="mt-0.5">Encrypted JWT Session & MySQL Database Connectivity</p>
          </div>
        </div>

        {/* Right Panel: Auth Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isRegister ? 'Register Researcher Account' : 'Researcher Sign In'}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              {isRegister ? 'Create an authorized laboratory profile' : 'Enter your credentials to access the AI prediction system'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <Person className="absolute left-3.5 top-3 text-slate-500 text-sm" />
                    <input
                      type="text"
                      placeholder="Srikanth Vadakuppa"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Organization / Institute</label>
                  <div className="relative">
                    <Business className="absolute left-3.5 top-3 text-slate-500 text-sm" />
                    <input
                      type="text"
                      placeholder="Biomedical Composites Research Lab"
                      value={organization}
                      onChange={e => setOrganization(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Email className="absolute left-3.5 top-3 text-slate-500 text-sm" />
                <input
                  type="email"
                  placeholder="srikanthvadakuppa@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Password Input with Eye Contact Toggle */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3 text-slate-500 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <VisibilityOff className="text-sm" /> : <Visibility className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input with Eye Contact Toggle */}
            {isRegister && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3 text-slate-500 text-sm" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    title={showConfirmPassword ? "Hide Confirm Password" : "Show Confirm Password"}
                  >
                    {showConfirmPassword ? <VisibilityOff className="text-sm" /> : <Visibility className="text-sm" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-xs mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                isRegister ? "Register Researcher Account" : "Sign In to Portal"
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer block mx-auto underline decoration-emerald-500/40"
            >
              {isRegister ? "Already registered? Sign In here" : "Don't have an account? Register Account here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
