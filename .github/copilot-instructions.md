# Copilot Instructions - RentVerse Platform

## 🏗️ Architecture Overview

RentVerse is a full-stack rental marketplace with **four independent services**:

1. **Frontend** (`rentverse-frontend/`): Next.js 15 + React 19 + TypeScript + Zustand
2. **Backend** (`rentverse-backend/`): Express.js + Prisma ORM + PostgreSQL + JWT
3. **AI Service** (`rentverse-ai-service/`): FastAPI + Python for ML-based price prediction & approval classification
4. **Datasets** (`rentverse-datasets/`): Scrapy-based data collection for training

## 📱 Frontend (Next.js 15 App Router)

### Key Technologies
- **Framework**: Next.js 15 with Turbopack (`npm run dev -- --turbopack`)
- **UI Stack**: React 19, Tailwind CSS 4, Lucide + React Icons
- **State**: Zustand stores (auth, properties, UI) in `stores/`
- **Maps**: MapTiler SDK for property location visualization
- **Mobile**: Capacitor for Android cross-compilation
- **PWA**: next-pwa for offline support

### Project Structure
```
app/                          # App Router (pages & API routes)
├── api/auth/                # Auth endpoints (send-otp, verify-otp, login, register)
├── api/properties/          # Property API routes
├── admin/                   # Admin-only pages (security-logs, properties)
├── property/[id]/           # Dynamic property details
├── rents/                   # Rental search & listing
└── account/                 # User profile & settings
components/                  # Reusable UI components (OTPInput, MFAVerification, etc.)
types/                       # TypeScript interfaces (security.ts, property.ts)
utils/                       # Helpers (rateLimiter, apiSecurity, anomalyDetection)
stores/                      # Zustand state management
hooks/                       # Custom React hooks
middleware.ts               # Next.js request middleware (auth, redirects)
```

### Conventions
- **API Calls**: Use fetch with `/api/` endpoints; implement in `app/api/` route handlers
- **Security**: `utils/apiSecurity.ts` provides CSRF, input sanitization, rate limiting
- **Rate Limiting**: `utils/rateLimiter.ts` enforces per-user limits (100/min, 10/min strict)
- **MFA**: OTP-based (6-digit, 60-second timer) in `components/MFAVerification.tsx`
- **File Uploads**: Via Cloudinary (configured in backend via `/api/upload` endpoint)
- **Admin Routes**: Require `ADMIN` role - check via middleware before rendering

### Build & Deploy
```bash
npm run dev              # Development with Turbopack
npm run build           # Production build
npm run start           # Production server
npm run build:mobile    # Build + sync to Capacitor
npm run cap:run:android # Run on Android device
```

---

## 🔌 Backend (Express.js + Prisma)

### Key Technologies
- **Framework**: Express.js with Helmet (security), Morgan (logging), CORS
- **ORM**: Prisma with PostgreSQL
- **Auth**: JWT tokens + bcryptjs password hashing
- **Docs**: Swagger UI at `/docs`
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

### Project Structure
```
src/
├── routes/
│   ├── auth.routes.js              # Login, register, password reset
│   ├── properties.routes.js        # Create, list, update property
│   ├── users.routes.js             # User profile, settings
│   ├── admin.properties.routes.js  # Admin property management
│   ├── admin.security.routes.js    # Admin security logs, alerts
│   └── admin.agreements.routes.js  # Digital agreement endpoints
├── middleware/
│   ├── auth.js                     # JWT verification + role-based authorize()
│   └── session.js                  # Express session config
├── services/                       # Business logic (property search, payment, etc.)
├── utils/                          # Helpers (email, validation, etc.)
└── config/
    ├── database.js                 # Prisma client & connection
    └── swagger.js                  # API documentation config
index.js                            # Server entry point
```

### Conventions
- **Error Handling**: Use `app.use((err, req, res, next) => {})` for global error middleware
- **DB Transactions**: Use Prisma `$transaction()` for multi-step operations
- **Rate Limiting**: Backend uses `express-rate-limit` for route protection
- **Admin Routes**: All admin routes require `authorize('ADMIN')` middleware
- **API Response**: Always return `{ success: boolean, data: T, error?: string }`
- **Authentication**: JWT in `Authorization: Bearer <token>` header
- **Password Reset**: Uses email-based OTP sent via Nodemailer

### Database (Prisma Schema)
Key models: `User`, `Property`, `PropertyType`, `Amenity`, `Booking`, `Agreement`, `SecurityLog`

### Build & Deploy
```bash
npm run dev                # Development mode (nodemon)
npm run db:migrate         # Run pending migrations
npm run db:seed           # Seed sample data
npm run db:studio         # Prisma Studio UI
npm run lint:fix          # Fix ESLint issues
npm run security:check    # Lint + audit dependencies
```

---

## 🤖 AI Service (FastAPI + Python)

### Key Technologies
- **Framework**: FastAPI (auto-generated docs at `/docs`)
- **ML Models**: scikit-learn pipelines (Extra Trees) for price prediction & approval classification
- **Data**: Pandas for preprocessing, joblib for model serialization
- **Dev**: Poetry for dependency management, Click for CLI

### Project Structure
```
rentverse/
├── main.py                         # FastAPI app initialization
├── cli.py                          # CLI commands (dev, start)
├── config.py                       # Environment config
├── models/
│   ├── ml_models.py               # Model loading & inference logic
│   ├── schemas.py                 # Pydantic request/response models
│   └── *.pkl                      # Serialized ML models
├── api/
│   ├── middleware.py              # CORS, error handling
│   └── routes/
│       ├── health.py              # Health checks
│       ├── prediction.py          # /predict/single, /predict/batch
│       └── classification.py      # /classify/price, /classify/approval
├── core/
│   ├── exceptions.py              # Custom error types
│   └── logging.py                 # Log config
└── utils/
    ├── helpers.py                 # Utilities
    └── preprocessor.py            # Data cleaning (outlier removal, feature scaling)
```

### API Endpoints
- **Health**: `GET /api/v1/health`, `/health/ready`, `/health/live`
- **Prediction**: `POST /api/v1/predict/single`, `POST /api/v1/predict/batch`
- **Classification**: `POST /api/v1/classify/price`, `POST /api/v1/classify/approval`
- **Docs**: `GET /docs` (Swagger), `GET /redoc` (ReDoc)

### Conventions
- **Request Validation**: Use Pydantic schemas in `models/schemas.py`
- **Error Handling**: Raise `HTTPException(status_code, detail)` for API errors
- **Batch Operations**: Support max 100 items per request
- **CORS**: Enabled for all origins (`Access-Control-Allow-Origin: *`)
- **Input Validation**: Property types must match schema (e.g., `apartment`, `house`)
- **Response Format**: Always return `{ "success": bool, "data": object, "error": null|string }`

### Model Info
- **Models Available**: `enhanced`, `standard`, `improved` price prediction pipelines
- **Model Metrics**: R² ~0.84+ (Enhanced model is default)
- **Feature Engineering**: Log transformation for price, location parsing for Malaysia

### Build & Deploy
```bash
poetry install              # Install dependencies
python -m rentverse.cli dev # Development server (auto-reload)
python -m rentverse.cli start # Production server
docker build -t rentverse-ai .
docker-compose up           # Full stack with PostgreSQL
```

---

## 🔄 Cross-Service Communication

### Frontend ↔ Backend
- **Base URL**: Environment variable `NEXT_PUBLIC_API_URL` (default: `http://localhost:3000`)
- **Authentication**: JWT token stored in localStorage, sent via Authorization header
- **CORS**: Enabled on backend via helmet configuration

### Backend ↔ AI Service
- **Base URL**: Environment variable or hardcoded in backend services
- **Calls**: Use `axios` for HTTP requests to `/api/v1/predict/*` or `/classify/*`
- **Timeout**: Configure reasonable timeouts for ML inference (can take 1-5 seconds)

### Frontend ↔ External Services
- **Authentication**: Google OAuth (configured in `GOOGLE_OAUTH_*` env vars)
- **Maps**: MapTiler SDK with API key in `NEXT_PUBLIC_MAPTILER_KEY`
- **File Storage**: Cloudinary for images (via backend `/api/upload`)

---

## 🔐 Security Features Implemented

### MFA/OTP System
- **Flow**: Email OTP (6 digits, 60-second expiry)
- **Files**: `components/MFAVerification.tsx`, `app/api/auth/send-otp/route.ts`
- **Rate Limiting**: 5 attempts per 15 minutes

### API Security
- **CSRF Protection**: Token validation on state-changing requests
- **Rate Limiting**: Per-user limits enforced in `utils/rateLimiter.ts`
- **Input Sanitization**: XSS prevention via DOMPurify patterns
- **Device Fingerprinting**: Tracking via browser & IP identification

### Anomaly Detection
- **Monitoring**: Failed login attempts, rate limit triggers, location changes
- **Store**: `stores/securityStore.ts` tracks security events
- **Alerts**: Real-time notifications in `components/SecurityAlerts.tsx`

---

## 🧪 Testing & Debugging

### Frontend
- **Hot Reload**: Changes reflect immediately in dev mode
- **Browser DevTools**: Use React DevTools for Zustand store inspection
- **Network Tab**: Monitor API calls and responses
- **Test Files**: Examples in test scripts (see `test_*.py` in AI service)

### Backend
- **Swagger UI**: Test endpoints at `/docs` (auto-generated)
- **Prisma Studio**: Visual DB browser via `npm run db:studio`
- **Morgan Logs**: HTTP requests logged to console in dev mode
- **Debug**: Use `console.log()` or Node debugger

### AI Service
- **FastAPI Docs**: Interactive testing at `http://localhost:8000/docs`
- **Debug Script**: `debug_prediction.py` for local testing
- **Batch Testing**: `test_batch_prediction.py` for multiple predictions
- **CORS Testing**: `test_cors.py` for cross-origin requests

---

## 📝 Common Workflows

### Adding a New API Endpoint

**Backend (Express)**:
1. Create route handler in `src/routes/new.routes.js`
2. Add validation middleware & database query
3. Register route in `src/app.js` via `app.use('/api/new', newRoutes)`
4. Add Swagger documentation (JSDoc comments)

**Frontend (Next.js)**:
1. Create `app/api/new/route.ts` as API handler OR use `fetch()` to call backend
2. Use in component: `const data = await fetch('/api/new').then(r => r.json())`
3. Handle errors gracefully with try-catch

**AI Service**:
1. Create new endpoint in `api/routes/new.py`
2. Define Pydantic schema in `models/schemas.py`
3. Add logic in `models/ml_models.py` or `core/` modules
4. Register route in `main.py` via `app.include_router()`

### Debugging Data Flow
1. **Check Backend Logs**: Look for errors in Express output
2. **Inspect Network**: Use browser DevTools Network tab
3. **Verify Prisma**: Use `db:studio` to inspect current state
4. **Test AI Endpoint**: Call `/api/v1/predict/single` via Swagger UI

### Deployment Considerations
- **Environment Variables**: Keep sensitive data in `.env` files (never commit)
- **Database**: Ensure PostgreSQL is running before starting backend
- **API Keys**: MapTiler, Google OAuth, Cloudinary must be configured
- **CORS**: Update `NEXT_PUBLIC_API_URL` for production domains
- **Docker**: All services have Dockerfiles; use `docker-compose.yml` for local dev

---

## 🎯 Key Files & Patterns

| Concern | Location | Pattern |
|---------|----------|---------|
| **Auth Flow** | `app/api/auth/`, `app/api/auth/verify-otp/` | JWT + OTP verification |
| **State Mgmt** | `stores/*.ts` | Zustand with separate concerns |
| **Rate Limiting** | `utils/rateLimiter.ts`, backend middleware | Token bucket algorithm |
| **DB Schema** | `rentverse-backend/prisma/schema.prisma` | Prisma models with relations |
| **ML Inference** | `rentverse-ai-service/models/ml_models.py` | scikit-learn pipelines |
| **Admin Routes** | `app/admin/`, `src/routes/admin.*.routes.js` | Role-based authorization |
| **Error Handling** | `app/api/route.ts`, `api/core/exceptions.py` | Structured error responses |
| **Security Logs** | Backend SecurityLog model + API routes | Audit trail for compliance |

---

## 💡 Implementation Tips

- **Type Safety**: Always define request/response types (TypeScript frontend, Pydantic backend)
- **Database Queries**: Use Prisma's type-safe query builder; prefer `select` to limit fields
- **Async Operations**: Use `async/await`; handle Promise rejections
- **Environment**: Check for missing env vars at startup (fail fast principle)
- **Logging**: Log important business events + errors; avoid logging secrets
- **Testing**: Use test files as documentation (e.g., `test_new_routes.py`)
- **Documentation**: Update README/swagger docs when adding features
