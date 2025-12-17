# 📖 How to Use the UiTM Mobile SecOps Solution

Welcome to the **Gear5G** security implementation guide. This document provides step-by-step instructions on how to set up, run, and test the security features of the application.

---

## ⚡ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Start-5/uitm-devops-challenge_Gear5G.git
cd uitm-devops-challenge_Gear5G
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add the following keys:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://rentverse-backend-emqy.onrender.com

# AI Service (Threat Intelligence)
NEXT_PUBLIC_AI_SERVICE_URL=https://rentverse-ai.jokoyuliyanto.my.id

# Geolocation Services
NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Feature Walkthrough

### 1. Testing Secure Login & MFA (Module 1)
**Goal**: Verify that Multi-Factor Authentication works.

1. Navigate to the **Login Page** (`/auth`).
2. Enter a valid email address.
3. You will be redirected to the **OTP Verification** screen.
4. Check your email (or mock console if running locally) for the 6-digit code.
5. Enter the code.
   - **Success**: You are logged in.
   - **Fail**: Enter a wrong code 3 times to see rate limiting in action.

### 2. Digital Agreement Signing (Module 3)
**Goal**: Test the secure digital signature feature.

1. Navigate to (`/agreement`).
2. Read the terms.
3. Use your **mouse** or **touchscreen** to sign in the canvas box.
4. Click **"Save Signature"**.
5. The signature is converted to Base64 and securely stored.

### 3. Admin Security Dashboard (Module 5 & Bonus 3)
**Goal**: Monitor real-time threats and logs.

1. Navigate to (`/admin/security-logs`).
2. **Activity Logs Tab**:
   - View recent login attempts.
   - Filter by "Critical" or "High" severity.
3. **Defense Dashboard Tab**:
   - See the real-time **Risk Visualization** radar chart.
   - Check the "Trust Score" metrics.

### 4. Threat Intelligence (Bonus 1)
**Goal**: See AI-powered threat detection.

1. Simulate a simple attack (e.g., rapid refresh or multiple failed logins).
2. Go to the **Security Dashboard**.
3. Look for the **"AI Threat Analysis"** panel.
4. It will show detected patterns (e.g., "Potential Brute Force Detected").

---

## 🧪 Running Security Tests (Module 6)

You can run our automated security suite locally:

### Run Vulnerability Scan
```bash
npm audit
```

### Run Static Code Analysis (Linting)
```bash
npm run lint
```

### GitHub Actions (CI/CD)
To view the full automated reports:
1. Go to the **"Actions"** tab in this GitHub repository.
2. Click on the latest workflow run.
3. View reports for:
   - `Security Scan`
   - `SAST Analysis`
   - `OWASP ZAP`

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| **MFA Code not arriving** | Check your spam folder or verify SMTP settings in backend. |
| **Map not loading** | Ensure `NEXT_PUBLIC_MAPTILER_API_KEY` is valid in `.env.local`. |
| **API Errors** | Check if the backend server (`render.com`) is awake (it may take 30s to cold start). |

---

**Need Help?**
Contact the **Gear5G Team** or refer to `SECOPS_COMPLETE_GUIDE.md` for technical details.
