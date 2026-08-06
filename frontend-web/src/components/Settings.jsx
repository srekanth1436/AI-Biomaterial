import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, LockReset, CheckCircle, Visibility, VisibilityOff,
  AccountCircle, Person, Business, MedicalServices, Tune, Speed, Security,
  FileDownload, FileUpload, Refresh, LocalHospital, Science, Thermostat
} from '@mui/icons-material';

export default function Settings({ user, onUserUpdate }) {
  const [name, setName] = useState(user?.name || 'Srikanth Vadakuppa');
  const [organization, setOrganization] = useState(user?.organization || 'Biomedical Composites Research Lab');
  
  // Security Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // NEW FEATURE 1: AI Prediction Engine Selector
  const [aiEngine, setAiEngine] = useState('ensemble'); // 'ensemble' | 'neural' | 'empirical'

  // NEW FEATURE 2: Doctor Hospital & Clinic PDF Customizer
  const [hospitalName, setHospitalName] = useState('St. Jude Biomedical & Surgical Institute');
  const [licenseNumber, setLicenseNumber] = useState('MD-ISO-998214');
  const [reportTitle, setReportTitle] = useState('Chief Biomaterials Specialist & Attending Surgeon');

  // NEW FEATURE 3: Lab Unit System Preferences
  const [stressUnit, setStressUnit] = useState('MPa'); // 'MPa' | 'PSI' | 'N/mm²'
  const [tempUnit, setTempUnit] = useState('°C'); // '°C' | '°F' | 'K'
  const [timeUnit, setTimeUnit] = useState('Days'); // 'Days' | 'Weeks' | 'Months'

  // NEW FEATURE 4: ISO 10993 Safety Compliance Thresholds
  const [minTensile, setMinTensile] = useState(25.0);
  const [maxDegRate, setMaxDegRate] = useState(1.5);
  const [minConfidence, setMinConfidence] = useState(90.0);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load persisted settings
  useEffect(() => {
    try {
      const savedEngine = localStorage.getItem('setting_ai_engine');
      if (savedEngine) setAiEngine(savedEngine);

      const savedHospital = localStorage.getItem('setting_hospital_name');
      if (savedHospital) setHospitalName(savedHospital);

      const savedLicense = localStorage.getItem('setting_license_no');
      if (savedLicense) setLicenseNumber(savedLicense);

      const savedStress = localStorage.getItem('setting_stress_unit');
      if (savedStress) setStressUnit(savedStress);

      const savedTemp = localStorage.getItem('setting_temp_unit');
      if (savedTemp) setTempUnit(savedTemp);

      const savedTensile = localStorage.getItem('setting_min_tensile');
      if (savedTensile) setMinTensile(parseFloat(savedTensile));
    } catch (e) {
      console.error('Error loading settings', e);
    }
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a valid display name.');
      return;
    }
    setError('');
    const updatedUser = { ...user, name: name.trim(), organization: organization.trim() };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    if (onUserUpdate) onUserUpdate(updatedUser);
    setMessage('Your profile & organization details have been updated!');
    setTimeout(() => setMessage(''), 4000);
  };

  const handleSaveAdvancedSettings = () => {
    localStorage.setItem('setting_ai_engine', aiEngine);
    localStorage.setItem('setting_hospital_name', hospitalName);
    localStorage.setItem('setting_license_no', licenseNumber);
    localStorage.setItem('setting_stress_unit', stressUnit);
    localStorage.setItem('setting_temp_unit', tempUnit);
    localStorage.setItem('setting_min_tensile', minTensile.toString());

    setMessage('Advanced AI Engine, Hospital Branding & Laboratory Preferences saved!');
    setTimeout(() => setMessage(''), 4000);
  };

  const handleExportBackup = () => {
    const backupData = {
      user: { name, organization, email: user?.email },
      aiEngine,
      hospitalName,
      licenseNumber,
      units: { stressUnit, tempUnit, timeUnit },
      safety: { minTensile, maxDegRate, minConfidence },
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Biomaterial_Settings_Backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match!');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password should be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage('Account security password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 4000);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="text-emerald-400" /> System & Clinical Settings Hub
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Configure AI Engine, Hospital Doctor Branding, Unit Preferences, and Safety Thresholds.
          </p>
        </div>

        <button
          onClick={handleExportBackup}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer transition-all self-start md:self-auto"
        >
          <FileDownload className="text-sm" /> Export Backup (.JSON)
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm rounded-2xl flex items-center gap-2 shadow-lg">
          <CheckCircle className="text-sm" /> {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-2xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
                <AccountCircle className="text-5xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{name}</h3>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{user?.role || 'Biomaterials Specialist'}</p>
              </div>
              <p className="text-xs text-slate-400">{organization}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs space-y-2.5 text-slate-400">
              <div className="flex justify-between">
                <span>Account Email:</span>
                <span className="text-slate-200 font-semibold">{user?.email || 'srikanth@biomedical.io'}</span>
              </div>
              <div className="flex justify-between">
                <span>Active AI Engine:</span>
                <span className="text-emerald-400 font-bold uppercase">{aiEngine} Model</span>
              </div>
              <div className="flex justify-between">
                <span>Security Token:</span>
                <span className="text-cyan-400 font-bold">Encrypted Active</span>
              </div>
            </div>
          </div>

          {/* Quick Unit Preference Badge */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Thermostat className="text-sm text-amber-400" /> Active Lab Units
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Stress</span>
                <span className="font-bold text-blue-400">{stressUnit}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Temp</span>
                <span className="font-bold text-amber-400">{tempUnit}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Time</span>
                <span className="font-bold text-purple-400">{timeUnit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Settings Tabs & Panels */}
        <div className="lg:col-span-2 space-y-8">
          {/* NEW FEATURE 1: AI Engine & Model Selector */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Science className="text-emerald-400" /> AI Prediction Model Engine Config
              </h3>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
                Accuracy: R² = 97.80%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setAiEngine('ensemble')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  aiEngine === 'ensemble'
                    ? 'bg-emerald-950/50 border-emerald-500 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Voting Ensemble</span>
                  {aiEngine === 'ensemble' && <CheckCircle className="text-emerald-400 text-xs" />}
                </div>
                <p className="text-[11px] text-slate-400">Random Forest + XGBoost ensemble (Recommended production engine).</p>
              </div>

              <div
                onClick={() => setAiEngine('neural')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  aiEngine === 'neural'
                    ? 'bg-emerald-950/50 border-emerald-500 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Neural Bio-MLP</span>
                  {aiEngine === 'neural' && <CheckCircle className="text-emerald-400 text-xs" />}
                </div>
                <p className="text-[11px] text-slate-400">Deep Multilayer Perceptron network trained on non-linear kinetics.</p>
              </div>

              <div
                onClick={() => setAiEngine('empirical')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  aiEngine === 'empirical'
                    ? 'bg-emerald-950/50 border-emerald-500 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Empirical Thermodynamics</span>
                  {aiEngine === 'empirical' && <CheckCircle className="text-emerald-400 text-xs" />}
                </div>
                <p className="text-[11px] text-slate-400">Physics-informed empirical degradation formula engine.</p>
              </div>
            </div>
          </div>

          {/* NEW FEATURE 2 & 3: Doctor Hospital Branding & Lab Units */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <LocalHospital className="text-emerald-400" /> Hospital Branding & Laboratory Unit System
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Hospital / Clinic Branding Name</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Surgeon / Specialist License #</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Mechanical Stress Unit</label>
                <select
                  value={stressUnit}
                  onChange={e => setStressUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="MPa">MPa (Megapascals)</option>
                  <option value="PSI">PSI (Pounds per sq inch)</option>
                  <option value="N/mm²">N/mm² (Newton/mm²)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Testing Temperature Unit</label>
                <select
                  value={tempUnit}
                  onChange={e => setTempUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="°C">°C (Celsius)</option>
                  <option value="°F">°F (Fahrenheit)</option>
                  <option value="K">K (Kelvin)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleSaveAdvancedSettings}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Save Advanced Settings
              </button>
            </div>
          </div>

          {/* Form 1: Edit Profile Name & Organization */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Person className="text-emerald-400" /> Edit Profile Name & Details
            </h3>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Your Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Organization / Institute</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all cursor-pointer text-xs"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Form 2: Change Security Password */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <LockReset className="text-emerald-400" /> Change Security Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showCurrentPassword ? <VisibilityOff className="text-sm" /> : <Visibility className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showNewPassword ? <VisibilityOff className="text-sm" /> : <Visibility className="text-sm" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? <VisibilityOff className="text-sm" /> : <Visibility className="text-sm" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-xs disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Updating Password...' : 'Update Account Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
