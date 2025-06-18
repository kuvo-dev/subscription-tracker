-- SQL schema and seed data for Subscription Tracker
-- Run this in your MySQL instance before starting the server

CREATE DATABASE IF NOT EXISTS SubscriptionTracker;
USE SubscriptionTracker;

-- ===============================================
-- TABLES CREATION
-- ===============================================

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    UID INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    UNIQUE KEY (email)
);

-- Subscription Category table
CREATE TABLE IF NOT EXISTS Subscription_Category (
    CID INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    UNIQUE KEY (category_name)
);

-- Subscription Plan table
CREATE TABLE IF NOT EXISTS Subscription_Plan (
    PLANID INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    plan_type ENUM('MONTHLY', 'YEARLY') NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Payment Method table
CREATE TABLE IF NOT EXISTS Payment_Method (
    PAYID INT AUTO_INCREMENT PRIMARY KEY,
    UID INT NOT NULL,
    payment_type ENUM('CREDIT', 'DEBIT') NOT NULL,
    payment_provider VARCHAR(50) NOT NULL,
    last_four VARCHAR(4) NOT NULL,
    due_day INT NOT NULL,
    FOREIGN KEY (UID) REFERENCES Users(UID)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS Subscriptions (
    SID INT AUTO_INCREMENT PRIMARY KEY,
    UID INT NOT NULL,
    subscription_name VARCHAR(100) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'CANCELLED') NOT NULL,
    PAYID INT NOT NULL,
    PLANID INT NOT NULL,
    CID INT NOT NULL,
    FOREIGN KEY (UID) REFERENCES Users(UID),
    FOREIGN KEY (PAYID) REFERENCES Payment_Method(PAYID),
    FOREIGN KEY (PLANID) REFERENCES Subscription_Plan(PLANID),
    FOREIGN KEY (CID) REFERENCES Subscription_Category(CID)
);

-- ===============================================
-- SAMPLE DATA
-- ===============================================

-- Sample Users
INSERT INTO Users (full_name, email) VALUES
    ('Kino Abillar', 'kabillar@horizon.csueastbay.edu'),
    ('Tian Zhou', 'Tian.Zhou@csueastbay.edu');

-- Sample Categories
INSERT INTO Subscription_Category (category_name) VALUES
    ('Streaming'),
    ('Cloud Storage'),
    ('Music'),
    ('Software'),
    ('Gaming'),
    ('Productivity');

-- Sample Plans
INSERT INTO Subscription_Plan (plan_name, plan_type, price) VALUES
    ('Netflix Standard', 'MONTHLY', 15.99),
    ('Spotify Premium', 'MONTHLY', 9.99),
    ('Adobe Creative Cloud', 'YEARLY', 239.88),
    ('iCloud Storage', 'MONTHLY', 2.99),
    ('Disney+', 'MONTHLY', 7.99),
    ('Xbox Game Pass', 'MONTHLY', 14.99),
    ('Amazon Prime', 'YEARLY', 139.00),
    ('Notion Pro', 'MONTHLY', 8.00),
    ('Microsoft 365', 'YEARLY', 99.99),
    ('HBO Max', 'MONTHLY', 15.99);

-- Sample Payment Methods
INSERT INTO Payment_Method (UID, payment_type, payment_provider, last_four, due_day) VALUES
    (1, 'CREDIT', 'Visa', '1234', 15),
    (1, 'DEBIT', 'MasterCard', '5678', 1),
    (2, 'CREDIT', 'American Express', '9012', 20),
    (1, 'CREDIT', 'Discover', '3456', 10),
    (2, 'DEBIT', 'Chase', '7890', 5);

-- Sample Subscriptions
INSERT INTO Subscriptions (UID, subscription_name, status, PAYID, PLANID, CID) VALUES
    (1, 'Netflix', 'ACTIVE', 1, 1, 1),
    (1, 'Spotify', 'ACTIVE', 1, 2, 3),
    (2, 'Adobe CC', 'ACTIVE', 3, 3, 4),
    (2, 'iCloud', 'ACTIVE', 3, 4, 2),
    (1, 'Disney+', 'ACTIVE', 2, 5, 1),
    (2, 'Xbox Game Pass', 'ACTIVE', 5, 6, 5),
    (1, 'Amazon Prime', 'ACTIVE', 4, 7, 1),
    (2, 'Notion Pro', 'ACTIVE', 3, 8, 6),
    (1, 'Microsoft 365', 'ACTIVE', 2, 9, 4),
    (2, 'HBO Max', 'ACTIVE', 5, 10, 1);