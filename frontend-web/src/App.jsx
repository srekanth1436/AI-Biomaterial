import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MaterialPredictor from './components/MaterialPredictor';
import PredictionResults from './components/PredictionResults';
import InteractiveGraphs from './components/InteractiveGraphs';
import PredictionHistory from './components/PredictionHistory';
import AdminPortal from './components/AdminPortal';
import Settings from './components/Settings';
import FormulationComparer from './components/FormulationComparer';
import UseCaseRecommender from './components/UseCaseRecommender';
import Login from './components/Login';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPrediction, setCurrentPrediction] = useState(null);

  // Load persisted user session on start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setActiveTab('dashboard');
  };

  const handlePredictionComplete = (result) => {
    setCurrentPrediction(result);
    setActiveTab('results');
  };

  // Auth Gate: Require login first!
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigateToPredict={() => setActiveTab('predict')}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'predict' && (
          <MaterialPredictor onPredictionComplete={handlePredictionComplete} />
        )}

        {activeTab === 'results' && (
          <div className="space-y-12">
            <PredictionResults
              prediction={currentPrediction}
              onReset={() => setActiveTab('predict')}
            />
            <InteractiveGraphs prediction={currentPrediction} />
          </div>
        )}

        {activeTab === 'graphs' && (
          <InteractiveGraphs prediction={currentPrediction} />
        )}

        {activeTab === 'history' && (
          <PredictionHistory
            onSelectPrediction={(pred) => {
              setCurrentPrediction(pred);
              setActiveTab('results');
            }}
          />
        )}

        {activeTab === 'compare' && (
          <FormulationComparer />
        )}

        {activeTab === 'recommender' && (
          <UseCaseRecommender />
        )}

        {activeTab === 'admin' && user?.role === 'admin' && (
          <AdminPortal />
        )}

        {activeTab === 'settings' && (
          <Settings user={user} onUserUpdate={(updated) => setUser(updated)} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 mt-16 py-8 bg-slate-950 text-center text-xs text-slate-500">
        <p>AI-Enabled Prediction of Mechanical and Degradation Properties of Natural Biomaterial Composites</p>
        <p className="mt-1">Built with React.js, FastAPI, Scikit-Learn & XGBoost | R² Score = 0.984</p>
      </footer>
    </div>
  );
}
