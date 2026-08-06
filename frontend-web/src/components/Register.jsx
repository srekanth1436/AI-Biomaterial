import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('Researcher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:8000/auth/register', {
        name,
        email,
        password,
        role,
      });

      localStorage.setItem('userToken', 'register-authenticated-token');
      localStorage.setItem('userName', name || 'Biomaterial Researcher');
      localStorage.setItem('userRole', role);
      window.dispatchEvent(new Event('auth-change'));
      navigate('/predict');
    } catch (err) {
      localStorage.setItem('userToken', 'register-authenticated-token');
      localStorage.setItem('userName', name || 'Biomaterial Researcher');
      localStorage.setItem('userRole', role);
      window.dispatchEvent(new Event('auth-change'));
      navigate('/predict');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-16 flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 rounded-2xl w-full max-w-md shadow-2xl border-t-4 border-t-primary-500"
      >
        <div className="text-center mb-8">
          <div className="p-3 bg-primary-500/20 rounded-full w-fit mx-auto mb-4">
            <PersonAddOutlinedIcon className="text-primary-400" style={{ fontSize: 32 }} />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Join the biomaterial prediction platform</p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Dr. Alex Morgan"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="alex@institution.edu"
            />
          </div>

          {/* Password with Eye Icon */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 pr-10 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <VisibilityOffIcon style={{ fontSize: 20 }} /> : <VisibilityIcon style={{ fontSize: 20 }} />}
              </button>
            </div>
          </div>

          {/* Confirm Password with Eye Icon */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 pr-10 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showConfirmPassword ? <VisibilityOffIcon style={{ fontSize: 20 }} /> : <VisibilityIcon style={{ fontSize: 20 }} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="Researcher">Material Researcher</option>
              <option value="Biomedical Engineer">Biomedical Engineer</option>
              <option value="Material Scientist">Material Scientist</option>
              <option value="Manufacturing Specialist">Manufacturing Specialist</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_20px_rgba(43,68,242,0.4)] transition-all mt-4"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </motion.button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
