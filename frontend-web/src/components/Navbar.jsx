import React from 'react';
import { Science, Dashboard as DashboardIcon, History, ShowChart, AdminPanelSettings, Logout, Settings as SettingsIcon, CompareArrows, AutoAwesome } from '@mui/icons-material';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Science />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">Biomaterial AI</span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase block -mt-1">Composite Predictor</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              <DashboardIcon className="text-sm" /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab('predict')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'predict' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              <Science className="text-sm" /> Predict Material
            </button>

            <button
              onClick={() => setActiveTab('graphs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'graphs' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              <ShowChart className="text-sm" /> Graphs
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'history' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              <History className="text-sm" /> History
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'compare' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              <CompareArrows className="text-sm" /> Compare
            </button>

            <button
              onClick={() => setActiveTab('recommender')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'recommender' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              <AutoAwesome className="text-sm" /> Recommender
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
              >
                <AdminPanelSettings className="text-sm" /> Admin Panel
              </button>
            )}

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'settings' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              <SettingsIcon className="text-sm" /> Settings
            </button>
          </div>

          {/* User Auth Info / Actions */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-emerald-400 capitalize">{user.role || 'Researcher'}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer"
                  title="Logout"
                >
                  <Logout className="text-sm" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
