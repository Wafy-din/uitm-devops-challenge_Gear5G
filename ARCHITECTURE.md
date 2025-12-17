# Rentverse System Architecture

## High-Level Architecture Diagram

```mermaid
graph TD
    User[User (Tenant/Owner/Admin)] -->|HTTPS/TLS| CD[Cloudflare / CDN]
    CD --> FE[Rentverse Frontend\n(Next.js 15 App Directory)]

    subgraph "Core Infrastructure"
        FE -->|REST API / Secure Proxy| GW[API Gateway / Middleware]
        GW -->|Zero-Trust Check| ZT[Zero-Trust Engine]
        
        ZT -->|Authorized| BE[Rentverse Backend API]
        ZT -->|Risk Analysis| AI[AI Threat Intelligence Service]
        
        BE -->|Read/Write| DB[(Primary Database)]
        BE -->|Cache| RD[(Redis Cache)]
    end

    subgraph "Security Services"
        AI -->|Threat Score| ZT
        GW -->|Async Logs| SL[Security Logs / Review]
    end

    subgraph "External Integrations"
        FE -->|Maps| MT[MapTiler API]
        FE -->|Media Upload| CL[Cloudinary]
        FE -->|Auth| GO[Google OAuth Provider]
    end

    classDef secure fill:#f9f,stroke:#333,stroke-width:2px;
    class ZT,AI,GW secure
```

## Component Description

### 1. Frontend (Rentverse-Frontend)
- **Tech Stack**: Next.js 15, React 19, Tailwind CSS 4, Zustand.
- **Role**: Client-side application handling UI, user interactions, and initial validation.
- **Security**: 
  - Implements `OTPInput` and `MFAVerification`.
  - Content Security Policy (CSP) headers.
  - Secure storage of session tokens.

### 2. Backend (Rentverse-Backend)
- **Tech Stack**: Node.js, Express (Assumed).
- **Role**: Core business logic, data persistence, and user management.
- **Security**:
  - JWT Authentication & Verification.
  - Rate Limiting.
  - Input Sanitization.

### 3. AI Service (Rentverse-AI-Service)
- **Tech Stack**: Python (Flask/FastAPI).
- **Role**: specialized service for threat detection and analyzing user behavior patterns.
- **Functions**:
  - Detects anomalies in login patterns.
  - Calculates confidence scores for potential threats.

### 4. Zero-Trust Engine
- **Implementation**: Middleware & Utility set.
- **Functions**:
  - Device Fingerprinting (SHA-256).
  - Geolocation Verification.
  - Trust Score Calculation (0-100%).

## Security Data Flow

1. **User Login**:
   - Credentials sent to Backend.
   - If valid, 2FA triggered (OTP sent via Email).
   - Frontend verifies OTP.

2. **Request Handling**:
   - Every API request passes through the Security Middleware.
   - **Rate Limiter** checks request frequency.
   - **Zero-Trust Logic** validates device fingerprint and location.
   - If Suspicious -> **AI Service** analyzed for threat confirmation.
   - If Safe -> Proxied to Backend or handled directly.

3. **Threat Response**:
   - High-risk activities trigger **Smart Alerts**.
   - Admins notified via **Defense Dashboard**.
   - Automated blocking for critical threats.
