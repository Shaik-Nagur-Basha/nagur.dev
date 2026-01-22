# Quick Start Guide - Backend Integration

## What Was Implemented

✅ **Contact Form Backend Integration**
- Form submissions now save to database (`backend/data/contacts.json`)
- Email validation
- Success/error feedback to users
- Loading states during submission

✅ **Dark Mode Persistence with Cookies**
- Theme preference saved to database (`backend/data/themes.json`)
- 30-day session cookie (`sessionId`)
- Automatic session cleanup for expired entries
- Falls back to localStorage if backend unavailable

## Quick Start (5 minutes)

### 1. Start the Backend Server
```bash
# From project root
npm run dev
```
Backend will run on `http://localhost:5000`

### 2. Start the Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### 3. Test It Out
- Open http://localhost:5173 in your browser
- Fill out the contact form and submit → check `backend/data/contacts.json`
- Toggle dark mode and refresh → preference persists
- Check browser cookies → you'll see `sessionId` with 30-day expiry

## Key Files Modified

| File | Changes |
|------|---------|
| `backend/index.js` | Added 4 API endpoints + database operations |
| `frontend/src/components/Contact.jsx` | Integrated API calls, error handling, loading states |
| `frontend/src/context/ThemeContext.jsx` | Added cookie-based persistence with backend sync |
| `backend/package.json` | Added `cookie-parser` dependency |
| `backend/.env` | New file with PORT and NODE_ENV |

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contacts` | Get all submissions (admin) |
| POST | `/api/theme` | Save theme preference |
| GET | `/api/theme` | Retrieve theme preference |

## Database Structure

```
backend/data/
├── contacts.json          # All form submissions
└── themes.json            # Theme preferences by sessionId
```

## Features

### Contact Form
- ✅ Name, email, message validation
- ✅ Real-time error messages
- ✅ Submit button disabled while loading
- ✅ Success message appears for 3 seconds
- ✅ Form clears after successful submission
- ✅ All data saved to database with timestamp

### Dark Mode
- ✅ Preference saved per browser session (30 days)
- ✅ Persists across page refreshes
- ✅ Fallback to localStorage if backend unavailable
- ✅ HttpOnly cookie for security
- ✅ Automatic cleanup of expired sessions

## Troubleshooting

**Q: Form submission not working?**
A: Ensure backend is running on port 5000. Check browser console for errors.

**Q: Dark mode not persisting?**
A: Verify backend is running. Check `backend/data/themes.json` exists.

**Q: CORS errors?**
A: Backend CORS is configured for localhost:5173 and localhost:3000 by default.

**Q: Backend won't start?**
A: Ensure you've run `npm install` in the root directory.

## Next Steps

1. **Production Database**: Switch from JSON files to MongoDB or PostgreSQL
2. **Email Notifications**: Integrate email service for contact submissions
3. **User Authentication**: Add login/signup for personalized features
4. **Admin Dashboard**: Create interface to manage contact submissions
5. **Rate Limiting**: Add spam protection to contact endpoint

## Environment Setup for Production

Update `backend/.env`:
```
PORT=5000
NODE_ENV=production
```

Update `backend/index.js` CORS:
```javascript
origin: "https://your-domain.com"
```

Update cookie security:
```javascript
secure: true  // Only HTTPS
sameSite: "strict"
```

---
For detailed documentation, see [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
