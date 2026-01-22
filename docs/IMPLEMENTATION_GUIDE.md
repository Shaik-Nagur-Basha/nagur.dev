# Contact Form & Theme Persistence - Implementation Guide

## Overview

The application now has fully functional backend integration with the following features:

1. **Contact Form Submission** - Form data is saved to a JSON database
2. **Dark Mode Persistence** - Theme preference is saved to the database with cookies and session management

## Backend Changes

### New Endpoints

#### 1. Contact Form Submission
- **POST** `/api/contact`
- **Request Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "message": "Your message here"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Contact form submitted successfully",
    "contact": {
      "id": "1705946400000",
      "name": "User Name",
      "email": "user@example.com",
      "message": "Your message here",
      "submittedAt": "2026-01-22T10:00:00.000Z"
    }
  }
  ```
- **Validation:**
  - All fields are required (name, email, message)
  - Email must be in valid format
  - Returns 400 if validation fails
  - Returns 500 if database write fails

#### 2. Get All Contacts (Admin)
- **GET** `/api/contacts`
- **Response:** Array of all submitted contacts
- **Note:** Add authentication before using in production

#### 3. Save Theme Preference
- **POST** `/api/theme`
- **Request Body:**
  ```json
  {
    "darkMode": true
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Theme preference saved",
    "sessionId": "1705946400000",
    "darkMode": true
  }
  ```
- **Features:**
  - Sets an httpOnly cookie with sessionId (30-day expiry)
  - Saves theme preference to database with expiration date
  - Works across page refreshes

#### 4. Get Theme Preference
- **GET** `/api/theme`
- **Response:**
  ```json
  {
    "success": true,
    "darkMode": true,
    "sessionId": "1705946400000"
  }
  ```
- **Features:**
  - Retrieves saved theme preference from cookie session
  - Automatically cleans up expired sessions
  - Returns null if no preference is saved

## Data Storage

### Database Structure

The backend uses JSON files stored in `backend/data/`:

1. **contacts.json** - All submitted contact forms
   ```json
   [
     {
       "id": "timestamp",
       "name": "User Name",
       "email": "user@example.com",
       "message": "Message content",
       "submittedAt": "ISO timestamp"
     }
   ]
   ```

2. **themes.json** - User theme preferences by session ID
   ```json
   {
     "sessionId": {
       "darkMode": true,
       "lastUpdated": "ISO timestamp",
       "expiresAt": "ISO timestamp"
     }
   }
   ```

## Frontend Changes

### Contact Component (`src/components/Contact.jsx`)

**New Features:**
- Connects to backend API for form submission
- Shows loading state while submitting
- Displays error messages if submission fails
- Disables form inputs during submission
- Shows success message for 3 seconds after successful submission
- Form is cleared after successful submission

**State Variables Added:**
- `isSubmitting` - Loading state during form submission
- `submitError` - Error message display

**Functions Updated:**
- `handleSubmit()` - Now calls `/api/contact` endpoint instead of just logging

### Theme Context (`src/context/ThemeContext.jsx`)

**New Features:**
- Fetches theme preference from backend on mount
- Saves theme preference to backend when toggled
- Falls back to localStorage if backend is unavailable
- Uses cookies with 30-day expiration for session management
- Sends `withCredentials: true` for cookie handling

**New Hooks:**
- `useEffect` to fetch theme from backend on component mount
- `useEffect` to save theme changes to backend

## Running the Application

### Backend Setup

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Start the backend server:
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:5000`
   - Watches for file changes with nodemon

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   - Frontend runs on `http://localhost:5173` (or specified port)

## Testing

### Test Contact Form Submission

1. Open the application in browser
2. Navigate to Contact section
3. Fill in the form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Message: "Test message"
4. Click "Send Message"
5. Should see success message
6. Check `backend/data/contacts.json` to verify data was saved

### Test Theme Persistence

1. Open the application
2. Toggle dark mode using theme switcher
3. Refresh the page
4. Dark mode preference should be maintained
5. Check `backend/data/themes.json` to verify session data
6. Check browser cookies to see the `sessionId` cookie (30-day expiry)

## Environment Variables

The backend uses a `.env` file with the following variables:

```
PORT=5000
NODE_ENV=development
```

### Frontend API Endpoint

The frontend expects the backend at: `http://localhost:5000/api`

If running on different hosts/ports, update the `API_URL` in:
- `src/components/Contact.jsx`
- `src/context/ThemeContext.jsx`

## Production Considerations

### Security

1. **Contact Endpoint:**
   - Add rate limiting to prevent spam
   - Implement email verification
   - Add CSRF protection
   - Consider adding a captcha

2. **Theme Endpoint:**
   - Current implementation is secure (theme preference is public data)
   - Consider adding user authentication for more personalization

3. **Database:**
   - Switch from JSON files to a proper database (MongoDB, PostgreSQL, etc.)
   - Implement proper backup strategy
   - Add data validation and sanitization

### CORS Configuration

Currently allows:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative port)

For production, update CORS in `backend/index.js`:
```javascript
app.use(cors({
  origin: "https://your-production-domain.com",
  credentials: true,
}));
```

### Cookie Settings

Update secure flag for production:
```javascript
res.cookie("sessionId", sessionId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Only HTTPS in production
  sameSite: "strict", // Consider "strict" for production
  maxAge: thirtyDaysInMs,
});
```

## Troubleshooting

### Backend Not Connecting

1. Ensure backend is running on port 5000
2. Check CORS configuration allows frontend origin
3. Verify `withCredentials: true` is set in axios calls

### Form Submission Failing

1. Check browser console for errors
2. Verify all required fields are filled
3. Check email format is valid
4. Ensure backend is running
5. Check `backend/data/` directory is writable

### Theme Not Persisting

1. Check browser console for CORS errors
2. Verify cookies are enabled in browser
3. Check `backend/data/themes.json` exists and is writable
4. Ensure the backend is running

## File Structure

```
backend/
├── index.js                 (Main server file with all endpoints)
├── .env                    (Environment variables)
├── package.json            (Dependencies)
└── data/                   (Database - auto-created)
    ├── contacts.json       (Contact form submissions)
    └── themes.json         (Theme preferences)

frontend/
├── src/
│   ├── components/
│   │   └── Contact.jsx     (Updated with API integration)
│   └── context/
│       └── ThemeContext.jsx (Updated with cookie-based persistence)
└── package.json
```

## Next Steps

1. **Database:** Migrate from JSON files to MongoDB/PostgreSQL
2. **Email:** Integrate email service (SendGrid, Mailgun) to send confirmation emails
3. **Authentication:** Add user authentication for personalized features
4. **Admin Panel:** Create an admin dashboard to view and manage contact submissions
5. **Analytics:** Add analytics to track form submissions and user preferences
