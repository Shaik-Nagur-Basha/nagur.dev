# Database Schema & API Response Examples

## Contact Form Data Structure

### When User Submits Form

**Request:** `POST /api/contact`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in your services..."
}
```

**Successful Response (201):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "contact": {
    "id": "1705946400000",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I'm interested in your services...",
    "submittedAt": "2026-01-22T10:15:30.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid email format"
}
```

### Stored in `backend/data/contacts.json`

```json
[
  {
    "id": "1705946400000",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I'm interested in your services...",
    "submittedAt": "2026-01-22T10:15:30.000Z"
  },
  {
    "id": "1705946500000",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "Can you help with my project?",
    "submittedAt": "2026-01-22T10:16:40.000Z"
  }
]
```

## Theme Preference Data Structure

### When User Toggles Dark Mode

**Request:** `POST /api/theme`
```json
{
  "darkMode": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Theme preference saved",
  "sessionId": "1705946400000",
  "darkMode": true
}
```

### Stored in `backend/data/themes.json`

```json
{
  "1705946400000": {
    "darkMode": true,
    "lastUpdated": "2026-01-22T10:15:30.000Z",
    "expiresAt": "2026-02-21T10:15:30.000Z"
  },
  "1705950000000": {
    "darkMode": false,
    "lastUpdated": "2026-01-22T11:20:00.000Z",
    "expiresAt": "2026-02-21T11:20:00.000Z"
  }
}
```

### When User Retrieves Theme

**Request:** `GET /api/theme`
- Browser automatically sends `sessionId` cookie

**Response (with valid session):**
```json
{
  "success": true,
  "darkMode": true,
  "sessionId": "1705946400000"
}
```

**Response (no valid session):**
```json
{
  "darkMode": null,
  "sessionId": null
}
```

## Cookie Structure

### SessionId Cookie

When user toggles theme, a cookie is set:

```
Name: sessionId
Value: 1705946400000
Domain: localhost
Path: /
Expires: 2026-02-21T10:15:30Z (30 days from creation)
HttpOnly: true
Secure: false (in development, true in production)
SameSite: lax
```

## File Structure

```
backend/
├── index.js
├── .env
├── package.json
└── data/
    ├── contacts.json       ← Contact form submissions
    └── themes.json         ← Theme preferences by sessionId
```

## Response Status Codes

### Contact Endpoint
- `201 Created`: Form submitted successfully
- `400 Bad Request`: Missing fields or invalid email
- `500 Internal Server Error`: Database write error

### Theme Endpoint
- `200 OK`: Theme saved or retrieved successfully
- `500 Internal Server Error`: Database error

## Example File Contents

### Example contacts.json
```json
[
  {
    "id": "1674135930123",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "message": "Great portfolio! Can you help with my startup project?",
    "submittedAt": "2026-01-18T14:25:30.123Z"
  },
  {
    "id": "1674136040456",
    "name": "Bob Wilson",
    "email": "bob@example.com",
    "message": "Interested in collaborating on a mobile app.",
    "submittedAt": "2026-01-18T14:27:20.456Z"
  }
]
```

### Example themes.json
```json
{
  "1674135930000": {
    "darkMode": true,
    "lastUpdated": "2026-01-18T14:25:30.000Z",
    "expiresAt": "2026-02-17T14:25:30.000Z"
  },
  "1674136040000": {
    "darkMode": false,
    "lastUpdated": "2026-01-18T14:27:20.000Z",
    "expiresAt": "2026-02-17T14:27:20.000Z"
  },
  "1705946400000": {
    "darkMode": true,
    "lastUpdated": "2026-01-22T10:15:30.000Z",
    "expiresAt": "2026-02-21T10:15:30.000Z"
  }
}
```

## Validation Rules

### Contact Form
- **Name**: Required, trimmed, non-empty
- **Email**: Required, must match email regex pattern
- **Message**: Required, trimmed, non-empty

### Theme
- **darkMode**: Boolean (true/false)
- **sessionId**: Auto-generated from timestamp if not provided

## Session Management

- **Default Expiry**: 30 days (2,592,000,000 milliseconds)
- **Expiration Logic**: 
  - Session expires after 30 days from creation
  - Expired entries are automatically deleted when `GET /api/theme` is called for that session
  - New sessions get new 30-day window

## CORS Configuration

Currently allows these origins:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative port)

Both support credentials (cookies).

## Error Handling

### Frontend Error Display

Contact form errors show in red banner:
- "All fields are required"
- "Invalid email format"
- "Failed to submit the form. Please try again."

Theme sync errors are logged to console but don't break functionality (localStorage fallback).

### Backend Error Logging

All errors logged to console with context:
- "Error submitting contact form: [error details]"
- "Error saving theme preference: [error details]"
- "Error reading contacts database: [error details]"
