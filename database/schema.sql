-- Database schema for AI-Enabled Biomaterial Composites Prediction System

CREATE DATABASE IF NOT EXISTS biomaterial_db;
USE biomaterial_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    organization VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: predictions
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    polymer_type VARCHAR(100) NOT NULL,
    natural_fiber VARCHAR(100) NOT NULL,
    fiber_percentage FLOAT NOT NULL,
    molecular_weight FLOAT NOT NULL,
    moisture_content FLOAT NOT NULL,
    ph FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    density FLOAT NOT NULL,
    
    -- Predicted Mechanical Properties
    tensile_strength FLOAT NOT NULL,
    elastic_modulus FLOAT NOT NULL,
    flexural_strength FLOAT NOT NULL,
    impact_strength FLOAT NOT NULL,
    
    -- Predicted Degradation Properties
    degradation_time FLOAT NOT NULL,
    weight_loss FLOAT NOT NULL,
    water_absorption FLOAT NOT NULL,
    biodegradation_rate FLOAT NOT NULL,
    
    -- Metadata
    confidence_score FLOAT DEFAULT 96.0,
    suitability_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: datasets
CREATE TABLE IF NOT EXISTS datasets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dataset_name VARCHAR(150) NOT NULL,
    sample_count INT NOT NULL,
    file_path VARCHAR(255),
    uploaded_by VARCHAR(120),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
