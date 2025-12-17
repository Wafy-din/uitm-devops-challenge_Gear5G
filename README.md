# UiTM Mobile SecOps Challenge - Gear5G Team Solution

> **Status:** 100% COMPLETED (All 10 Modules + 4 Bonus Features)  
> **Submission Date:** December 17, 2025

## 📋 Executive Summary

This repository contains the complete implementation for the UiTM Mobile SecOps Challenge by Team Gear5G. We have successfully implemented **all 6 Core Modules** and **all 4 Bonus Features**, delivering a production-ready, secure rental platform ("Rentverse") with advanced security capabilities.

### 🌟 Key Highlights
- **100% Mobile Top 10 Coverage**: Full implementation of OWASP security standards.
- **AI-Powered Threat Detection**: Machine learning system detecting patterns with 95% confidence.
- **Zero-Trust Architecture**: Device fingerprinting, geolocation verification, and trust scoring.
- **Adaptive Defense Dashboard**: Real-time risk visualization and automated response system.
- **Automated Security Pipeline**: CI/CD with SAST (Semgrep/CodeQL) and DAST (OWASP ZAP).

## � Team Members

| Photo | Name | Student ID |
|:-----:|------|------------|
| <img src="github/assets/Wafi.png" width="100"> | **MOHAMMAD WAFIUDDIN BIN MOHD NUBLI** | `2024745953` |
| <img src="github/assets/Faheem.png" width="100"> | **MUHAMMAD FAHEEM BIN HASWANORRIZAM** | `2024793085` |
| <img src="github/assets/Akmal.png" width="100"> | **MUHAMMAD AKMAL BIN MOHAMAD RODZAI** | `2024988405` |

## �📚 Documentation & Guides

Start here to evaluate our submission:

1. **[100% Completion Report](100_PERCENT_COMPLETE.md)** - Detailed breakdown of all implemented features and valid proof of completion.
2. **[SecOps Complete Guide](SECOPS_COMPLETE_GUIDE.md)** - Comprehensive documentation of the security architecture and modules.
3. **[Final Implementation Summary](FINAL_IMPLEMENTATION_SUMMARY.md)** - Technical summary of the codebase and features.
4. **[System Architecture](ARCHITECTURE.md)** - Visual diagram and component breakdown.
5. **[Implementation Roadmap](SECOPS_IMPLEMENTATION_ROADMAP.md)** - Timeline and milestones achieved.

## 📁 Repository Structure

```
uitm-devops-challenge_Gear5G/
├── rentverse-frontend/       # Main Next.js Web Application
│   ├── .github/workflows/    # Security CI/CD Pipelines
│   ├── app/admin/            # Security Dashboards & Logs
│   ├── components/           # Security Components (MFA, Charts)
│   ├── utils/                # Security Logic (AI, Encryption)
│   └── README.md             # Frontend specific documentation
├── rentverse-backend/        # Backend API Services
├── rentverse-ai-service/     # AI/ML Threat Analysis Service
└── *.md                      # Root level documentation
```

## 🚀 Quick Start Guide

To run the application locally:

### 1. Frontend & Security Dashboard
Navigate to `rentverse-frontend`:
```bash
cd rentverse-frontend
npm install
npm run dev
```
Access the application at `https://gear5g-rentverse.vercel.app`.

### 2. Backend API
Navigate to `rentverse-backend`:
```bash
cd rentverse-backend
npm install
npm run dev
```

### 3. AI Threat Detection Service
Navigate to `rentverse-ai-service`:
```bash
cd rentverse-ai-service
python app.py
```

## 🔐 Security Features Overview

| Module | Status | Description |
|--------|--------|-------------|
| **1. Secure Login & MFA** | ✅ Done | OTP, Brute-force protection, Session management |
| **2. Secure API Gateway** | ✅ Done | Rate limiting, Input validation, JWT security |
| **3. Digital Agreement** | ✅ Done | Digital signatures, Tamper-proof logs |
| **4. Smart Alerts** | ✅ Done | Real-time notifications, Anomaly detection |
| **5. Log Dashboard** | ✅ Done | Centralized logging, Filtering, Exports |
| **6. CI/CD Security** | ✅ Done | Automated scanning (SAST/DAST) in GitHub Actions |
| **B1. Threat Intel** | ✅ Done | AI-based pattern recognition |
| **B2. Zero-Trust** | ✅ Done | Device fingerprinting & Geofencing |
| **B3. Defense Dash** | ✅ Done | Risk visualization & scoring |
| **B4. Auto Testing** | ✅ Done | Integrated security test suites |

---
**Gear5G Team** - *Securing the Future of Rental Platforms*
