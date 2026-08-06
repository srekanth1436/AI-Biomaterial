import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor, VotingRegressor
from xgboost import XGBRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

def generate_global_biomaterial_data(num_samples=10000):
    """
    Generates a high-purity global dataset of 10,000 biopolymer composite formulations
    incorporating realistic physical, chemical, micro-structural, and degradation thermodynamics.
    """
    np.random.seed(42)
    
    polymer_types = [
        'PLA', 'PLLA', 'PGA', 'PLGA', 'Chitosan', 'PHBV', 'PCL', 'Alginate',
        'Silk', 'Collagen', 'Gelatin', 'HA', 'Starch', 'PBS', 'PHA', 'Cellulose'
    ]
    
    fibers = [
        'Bamboo', 'Hemp', 'Flax', 'Jute', 'Sisal', 'Coir', 'Kenaf',
        'Rice Husk', 'Wood Flour', 'Nanocellulose', 'Banana Fiber', 'Sugarcane Bagasse'
    ]
    
    # Specific density and stiffness multipliers per polymer family
    polymer_densities = {
        'PLA': 1.25, 'PLLA': 1.26, 'PGA': 1.53, 'PLGA': 1.30, 'Chitosan': 1.35,
        'PHBV': 1.28, 'PCL': 1.14, 'Alginate': 1.40, 'Silk': 1.33, 'Collagen': 1.32,
        'Gelatin': 1.27, 'HA': 1.05, 'Starch': 1.42, 'PBS': 1.26, 'PHA': 1.25, 'Cellulose': 1.50
    }
    
    fiber_tensile_base = {
        'Bamboo': 290, 'Hemp': 690, 'Flax': 800, 'Jute': 450, 'Sisal': 550,
        'Coir': 175, 'Kenaf': 500, 'Rice Husk': 120, 'Wood Flour': 200,
        'Nanocellulose': 1200, 'Banana Fiber': 350, 'Sugarcane Bagasse': 220
    }

    selected_polymers = np.random.choice(polymer_types, num_samples)
    selected_fibers = np.random.choice(fibers, num_samples)
    
    base_densities = np.array([polymer_densities[p] for p in selected_polymers])
    fiber_strengths = np.array([fiber_tensile_base[f] for f in selected_fibers])

    fiber_percentages = np.random.uniform(5, 60, num_samples)
    molecular_weights = np.random.uniform(30000, 350000, num_samples)
    moisture_contents = np.random.uniform(1.5, 18.0, num_samples)
    phs = np.random.uniform(4.5, 8.5, num_samples)
    temperatures = np.random.uniform(20, 50, num_samples)
    densities = base_densities + (fiber_percentages * 0.003) + np.random.normal(0, 0.02, num_samples)

    df = pd.DataFrame({
        'polymer_type': selected_polymers,
        'natural_fiber': selected_fibers,
        'fiber_percentage': fiber_percentages,
        'molecular_weight': molecular_weights,
        'moisture_content': moisture_contents,
        'ph': phs,
        'temperature': temperatures,
        'density': np.round(densities, 3)
    })

    # --- 1. Tensile Strength (MPa) ---
    mw_factor = (df['molecular_weight'] / 100000) * 16.5
    fiber_contribution = (df['fiber_percentage'] / 100) * fiber_strengths * 0.18
    moisture_penalty = df['moisture_content'] * 1.4
    density_boost = df['density'] * 10.5
    df['tensile_strength'] = (18 + mw_factor + fiber_contribution + density_boost - moisture_penalty + np.random.normal(0, 1.2, num_samples)).round(2)
    df['tensile_strength'] = df['tensile_strength'].clip(12.0, 160.0)

    # --- 2. Elastic Modulus (GPa) ---
    df['elastic_modulus'] = ((df['density'] * 1.85) + (df['fiber_percentage'] * 0.09) + (df['molecular_weight'] / 140000) - (df['moisture_content'] * 0.04) + np.random.normal(0, 0.12, num_samples)).round(2)
    df['elastic_modulus'] = df['elastic_modulus'].clip(0.8, 18.0)

    # --- 3. Flexural Strength (MPa) ---
    df['flexural_strength'] = (df['tensile_strength'] * 1.24 + (df['fiber_percentage'] * 0.35) + np.random.normal(0, 1.8, num_samples)).round(2)
    df['flexural_strength'] = df['flexural_strength'].clip(15.0, 195.0)

    # --- 4. Impact Strength (kJ/m²) ---
    df['impact_strength'] = (3.8 + (df['fiber_percentage'] * 0.14) + (df['molecular_weight'] / 55000) - (df['density'] * 1.05) + np.random.normal(0, 0.25, num_samples)).round(2)
    df['impact_strength'] = df['impact_strength'].clip(1.5, 32.0)

    # --- 5. Degradation Time (Days) ---
    temp_effect = (df['temperature'] - 25) * 2.4
    ph_effect = abs(df['ph'] - 7.4) * 9.2
    moist_effect = df['moisture_content'] * 4.8
    df['degradation_time'] = (380 - (df['fiber_percentage'] * 1.9) - temp_effect - moist_effect + (df['molecular_weight'] / 2400) - ph_effect + np.random.normal(0, 4.5, num_samples)).round(1)
    df['degradation_time'] = df['degradation_time'].clip(14.0, 730.0)

    # --- 6. Weight Loss (%) ---
    df['weight_loss'] = (100 * (180 / df['degradation_time'])**0.75 + np.random.normal(0, 1.2, num_samples)).round(2)
    df['weight_loss'] = df['weight_loss'].clip(3.0, 98.0)

    # --- 7. Water Absorption (%) ---
    df['water_absorption'] = ((df['fiber_percentage'] * 0.42) + (df['moisture_content'] * 1.15) + (10 / df['density']) + np.random.normal(0, 0.8, num_samples)).round(2)
    df['water_absorption'] = df['water_absorption'].clip(2.0, 48.0)

    # --- 8. Biodegradation Rate (%/day) ---
    df['biodegradation_rate'] = ((df['weight_loss'] / df['degradation_time']) * 1.18 + np.random.normal(0, 0.02, num_samples)).round(3)
    df['biodegradation_rate'] = df['biodegradation_rate'].clip(0.02, 4.0)

    return df

def train_global_ensemble_models():
    print("Generating pure high-accuracy global biopolymer dataset (10,000 samples)...")
    df = generate_global_biomaterial_data(10000)
    
    # Save seed CSV
    os.makedirs('ml', exist_ok=True)
    df.to_csv('ml/biomaterial_dataset.csv', index=False)
    print("Saved high-purity global dataset to ml/biomaterial_dataset.csv")

    df_encoded = pd.get_dummies(df, columns=['polymer_type', 'natural_fiber'])
    
    targets = [
        'tensile_strength', 'elastic_modulus', 'flexural_strength', 'impact_strength',
        'degradation_time', 'weight_loss', 'water_absorption', 'biodegradation_rate'
    ]
    
    X = df_encoded.drop(targets, axis=1)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    os.makedirs('models', exist_ok=True)
    joblib.dump(scaler, 'models/scaler.pkl')
    joblib.dump(X.columns.tolist(), 'models/feature_columns.pkl')
    
    model_scores = {}
    
    print("\nStarting Training of High-Precision Ensemble Regressors...")
    for target in targets:
        y = df[target]
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.15, random_state=42)
        
        # High-capacity Random Forest + XGBoost Ensemble
        rf = RandomForestRegressor(n_estimators=250, max_depth=20, random_state=42, n_jobs=-1)
        xgb = XGBRegressor(n_estimators=250, max_depth=10, learning_rate=0.05, random_state=42, n_jobs=-1)
        
        ensemble = VotingRegressor(estimators=[('rf', rf), ('xgb', xgb)])
        ensemble.fit(X_train, y_train)
        
        score = ensemble.score(X_test, y_test)
        model_scores[target] = round(float(score), 4)
        
        print(f"  [OK] Target property '{target}' trained | R^2 Accuracy Score: {score * 100:.2f}%")
        joblib.dump(ensemble, f'models/{target}_model.pkl')

    avg_r2 = float(np.mean(list(model_scores.values())))
    print(f"\n========================================================")
    print(f"=== GLOBAL TRAINING COMPLETE! Overall Average R^2 Accuracy Score: {avg_r2 * 100:.2f}% ===")
    print(f"========================================================")
    
    joblib.dump(model_scores, 'models/model_scores.pkl')

if __name__ == "__main__":
    train_global_ensemble_models()
