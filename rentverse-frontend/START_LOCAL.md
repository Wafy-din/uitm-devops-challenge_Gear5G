# Running Frontend Locally with Cloud Backend

This guide shows you how to run the frontend locally while connecting to your cloud backend and AI service.

## Prerequisites

✅ Backend running at: `https://rentverse-be.jokoyuliyanto.my.id`  
✅ AI Service running at: `http://rentverse-ai.jokoyuliyanto.my.id`  
✅ Database and dataset in the cloud

## Configuration

Your `.env.local` is already configured to connect to:

```env
NEXT_PUBLIC_API_BASE_URL=https://rentverse-be.jokoyuliyanto.my.id
NEXT_PUBLIC_AI_SERVICE_URL=http://rentverse-ai.jokoyuliyanto.my.id
NEXT_PUBLIC_MAPTILER_API_KEY=tQACIqGlhF51rQlqRxIJ
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dk2mshppk
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=rentverse_unsigned
```

## Step-by-Step Instructions

### 1. Install Dependencies (if not already done)

```bash
cd d:\WORK\Degree\SEM_6\CSC662\Bootcamp_Code\Finale\rentverse-frontend
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

This will start the Next.js development server with Turbopack.

### 3. Open in Browser

The frontend will be available at:
- **URL**: http://localhost:3000
- or the port shown in the terminal (if 3000 is taken)

### 4. Verify Connections

Once the app loads, check:

1. **Backend Connection**
   - Try logging in or viewing properties
   - Open browser DevTools Console (F12)
   - Look for successful API calls to `rentverse-be.jokoyuliyanto.my.id`

2. **AI Service Connection**
   - Try using the price prediction feature
   - Check for API calls to `rentverse-ai.jokoyuliyanto.my.id`

3. **Map Loading**
   - Check if maps load correctly (using MapTiler)

## Troubleshooting

### CORS Errors

If you see CORS errors in the console:

```
Access to fetch at 'https://rentverse-be.jokoyuliyanto.my.id/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**: Update your backend CORS configuration to allow `http://localhost:3000`

In your backend `.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://rentverse-fe.your-domain.com
FRONTEND_URL=http://localhost:3000
```

### AI Service Mixed Content Error

If you see warnings about mixed content (HTTP/HTTPS):

```
Mixed Content: The page at 'http://localhost:3000' was loaded over HTTPS, but requested an insecure resource
```

**Solution**: Ensure your AI service URL uses HTTPS:
```env
NEXT_PUBLIC_AI_SERVICE_URL=https://rentverse-ai.jokoyuliyanto.my.id
```

### Connection Refused

If API calls fail with "Connection refused":

1. **Check backend is running**:
   ```bash
   curl https://rentverse-be.jokoyuliyanto.my.id/health
   ```

2. **Check AI service is running**:
   ```bash
   curl http://rentverse-ai.jokoyuliyanto.my.id/api/v1/health
   ```

### Environment Variables Not Loading

If changes to `.env.local` don't take effect:

1. **Stop the dev server** (Ctrl+C)
2. **Restart the dev server**:
   ```bash
   npm run dev
   ```

Next.js loads environment variables on startup.

## Build for Production (Optional)

To test production build locally:

```bash
# Build the app
npm run build

# Start production server
npm start
```

## Useful Commands

```bash
# Development with Turbopack (faster)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Network Configuration

### Local Network Access (Optional)

To access from other devices on your network (phone, tablet):

1. Find your local IP address:
   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Access from other devices:
   ```
   http://192.168.1.100:3000
   ```

## Architecture

```
┌─────────────────────────┐
│   Your Browser          │
│   localhost:3000        │
└───────────┬─────────────┘
            │
            │ HTTP/HTTPS Requests
            │
┌───────────▼─────────────┐
│   Frontend (Local)      │
│   Next.js App           │
│   Port: 3000            │
└───────────┬─────────────┘
            │
            ├─────────────────────────────────┐
            │                                 │
┌───────────▼────────────────┐   ┌───────────▼──────────────┐
│   Backend API (Cloud)      │   │   AI Service (Cloud)     │
│   rentverse-be.*.my.id     │   │   rentverse-ai.*.my.id   │
│   Express + Prisma         │   │   FastAPI + ML Model     │
└───────────┬────────────────┘   └──────────────────────────┘
            │
┌───────────▼────────────────┐
│   Database (Cloud)         │
│   PostgreSQL + PostGIS     │
└────────────────────────────┘
```

## Next Steps

1. ✅ Start the frontend locally
2. ✅ Test user authentication
3. ✅ Test property browsing
4. ✅ Test price prediction feature
5. ✅ Test image upload (Cloudinary)
6. ✅ Test map features (MapTiler)

## Support

If you encounter issues:

1. Check browser console for errors (F12)
2. Check terminal for server errors
3. Verify all cloud services are running
4. Check network connectivity

## Environment Variables Reference

| Variable | Purpose | Current Value |
|----------|---------|---------------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API endpoint | `https://rentverse-be.jokoyuliyanto.my.id` |
| `NEXT_PUBLIC_AI_SERVICE_URL` | AI service endpoint | `http://rentverse-ai.jokoyuliyanto.my.id` |
| `NEXT_PUBLIC_MAPTILER_API_KEY` | Map rendering | `tQACIqGlhF51rQlqRxIJ` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Image uploads | `dk2mshppk` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload config | `rentverse_unsigned` |

---

**Ready to start?** Run `npm run dev` in the frontend directory! 🚀
