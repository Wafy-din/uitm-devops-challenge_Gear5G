# UiTM Mobile SecOps Challenge - Implementation Roadmap

## Challenge Overview
**Theme**: "Mobile Defense and Intelligence: Build Fast, Defend Smarter"
**Duration**: 24 Nov - 22 Dec 2025
**Prize Pool**: RM 4,000

## Implementation Status

### Core Modules (Required)

#### ✅ Module 1: Secure Login & MFA (Partially Complete)
**Current Status**:
- ✅ Email/password login
- ✅ Google OAuth
- ✅ JWT token management
- ❌ **TODO: MFA/OTP implementation**

**Files to Create**:
- `components/MFASetup.tsx` - MFA configuration UI
- `components/OTPInput.tsx` - OTP entry component
- `app/api/auth/send-otp/route.ts` - OTP generation endpoint
- `app/api/auth/verify-otp/route.ts` - OTP verification endpoint
- `types/security.ts` ✅ Created

**Security Focus**: OWASP M1-M3 (Authentication & Authorization)

---

#### ⚠️ Module 2: Secure API Gateway (Partially Complete)
**Current Status**:
- ✅ HTTPS communication
- ✅ JWT token validation
- ❌ **TODO: Rate limiting**
- ❌ **TODO: API request throttling**

**Files to Create/Modify**:
- `middleware.ts` - Add rate limiting logic
- `utils/rateLimiter.ts` - Rate limiting utilities
- `utils/apiSecurity.ts` - API security helpers

**Security Focus**: OWASP M5-M6 (Secure Communication)

---

#### ❌ Module 3: Digital Agreement (Mobile)
**TODO**: Complete new feature

**Files to Create**:
- `app/agreement/page.tsx` - Agreement interface
- `components/DigitalSignature.tsx` - Signature capture
- `app/api/agreements/route.ts` - Agreement API
- `utils/signatureValidation.ts` - Signature verification

**Security Focus**: Data Integrity & Workflow Validation

---

#### ❌ Module 4: Smart Notification & Alert System
**TODO**: Complete new feature

**Files to Create**:
- `components/SecurityAlerts.tsx` - Alert display component
- `app/security/notifications/page.tsx` - Notifications page
- `app/api/security/alerts/route.ts` - Alerts API
- `stores/securityStore.ts` - Security state management
- `utils/anomalyDetection.ts` - Pattern detection logic

**Security Focus**: DevSecOps Monitoring & Incident Detection

---

#### ❌ Module 5: Activity Log Dashboard
**TODO**: Complete new feature

**Files to Create**:
- `app/admin/security-logs/page.tsx` - Admin dashboard
- `components/ActivityLogTable.tsx` - Log display
- `components/SecurityMetrics.tsx` - Metrics visualization
- `app/api/security/logs/route.ts` - Logs API
- `utils/logAnalytics.ts` - Log analysis utilities

**Security Focus**: Threat Visualization & Accountability

---

#### ❌ Module 6: CI/CD Security Testing (Bonus)
**TODO**: Complete new feature

**Files to Create**:
- `.github/workflows/security-scan.yml` - GitHub Actions
- `.github/workflows/sast-analysis.yml` - SAST pipeline
- `security-config/eslint-security.js` - Security linting
- `scripts/security-audit.sh` - Security audit script

**Security Focus**: Continuous Testing (DevSecOps)

---

## Bonus Features (RM 2,000 Pool)

### ❌ Bonus 1: Threat Intelligence System (RM 500)
**Files to Create**:
- `utils/ai/threatDetection.ts` - AI-based detection
- `app/api/security/threats/route.ts` - Threat API
- `components/ThreatIntelligence.tsx` - Threat display

---

### ❌ Bonus 2: Zero-Trust Access Logic (RM 500)
**Files to Create**:
- `middleware/zeroTrust.ts` - Zero-trust middleware
- `utils/deviceFingerprint.ts` - Device identification
- `utils/geoLocation.ts` - Location verification
- `app/api/security/access-control/route.ts` - Access control

---

### ❌ Bonus 3: Adaptive Defense Dashboard (RM 500)
**Files to Create**:
- `app/admin/defense-dashboard/page.tsx` - Defense dashboard
- `components/RiskVisualization.tsx` - Risk charts
- `components/AutoResponse.tsx` - Auto-response UI
- `utils/riskCalculation.ts` - Risk scoring

---

### ❌ Bonus 4: Automated Security Testing (RM 500)
**Files to Create**:
- `.github/workflows/owasp-zap.yml` - ZAP integration
- `.github/workflows/mobsf.yml` - MobSF integration
- `security-reports/` - Security reports directory
- `scripts/vulnerability-scan.sh` - Scan script

---

## Priority Implementation Order

### Phase 1: Core Security (Week 1)
1. Complete MFA/OTP (Module 1)
2. Add rate limiting (Module 2)
3. Create Digital Agreement (Module 3)

### Phase 2: Monitoring & Logging (Week 2)
4. Smart Notifications (Module 4)
5. Activity Log Dashboard (Module 5)
6. Threat Intelligence System (Bonus 1)

### Phase 3: Advanced Defense (Week 3)
7. Zero-Trust Access (Bonus 2)
8. Adaptive Defense Dashboard (Bonus 3)
9. CI/CD Security Testing (Module 6)
10. Automated Security Testing (Bonus 4)

---

## Key Technologies Stack

### Frontend
- Next.js 15 (React)
- TypeScript
- Zustand (State Management)
- TailwindCSS
- Chart.js / Recharts (Visualizations)

### Backend Integration
- JWT Authentication
- RESTful APIs
- WebSocket (Real-time alerts)

### Security Tools
- OWASP ZAP
- MobSF
- ESLint Security Plugin
- GitHub Actions

### Monitoring
- Custom analytics
- Real-time threat detection
- Activity logging

---

## Deliverables Checklist

- [ ] Source code repository (GitHub)
- [ ] APK / TestFlight build
- [ ] README.md with setup instructions
- [ ] Technical documentation
- [ ] Architecture flow diagram
- [ ] 3-minute demo video
- [ ] Security testing reports

---

## Next Steps

1. **Immediate**: Implement MFA/OTP system
2. **Short-term**: Add rate limiting and digital agreements
3. **Mid-term**: Create monitoring dashboards
4. **Long-term**: Integrate CI/CD security testing

---

**Submission Deadline**: 17th December 2025
**Evaluation**: 18th – 21st December 2025
**Final Pitching**: TBA after evaluation
