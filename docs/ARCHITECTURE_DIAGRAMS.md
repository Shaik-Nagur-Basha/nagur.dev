# Architecture & Flow Diagrams

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                             │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           React Frontend (localhost:5173)               │ │
│  │                                                          │ │
│  │  ┌────────────────┐     ┌───────────────────┐          │ │
│  │  │  Contact.jsx   │     │ ThemeContext.jsx  │          │ │
│  │  ├────────────────┤     ├───────────────────┤          │ │
│  │  │ • Form inputs  │     │ • Dark/Light mode │          │ │
│  │  │ • Validation   │     │ • Cookie sync     │          │ │
│  │  │ • API calls    │     │ • localStorage    │          │ │
│  │  │ • Error display│     │ • Session mgmt    │          │ │
│  │  └────────────────┘     └───────────────────┘          │ │
│  │           │                         │                    │ │
│  │           └─────────────┬───────────┘                    │ │
│  │                         │                                │ │
│  │                   axios HTTP + Cookies                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         │                                      │
│                         ↓                                      │
│              ┌──────────────────────┐                         │
│              │  Cookies Storage     │                         │
│              ├──────────────────────┤                         │
│              │ sessionId (30 days)  │                         │
│              │ - HttpOnly: true     │                         │
│              │ - Secure: false*     │                         │
│              │ - SameSite: lax      │                         │
│              └──────────────────────┘                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                              │
                    CORS (credentials: true)
                              │
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                     SERVER                                     │
│               (Node.js localhost:5000)                         │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Express Server                             │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │            Middleware Stack                     │   │ │
│  │  ├──────────────────────────────────────────────────┤   │ │
│  │  │  1. CORS Middleware                             │   │ │
│  │  │  2. express.json()                              │   │ │
│  │  │  3. cookieParser()                              │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │          API Route Handlers                      │   │ │
│  │  ├──────────────────────────────────────────────────┤   │ │
│  │  │  POST /api/contact      → Save form             │   │ │
│  │  │  GET  /api/contacts     → Get all submissions   │   │ │
│  │  │  POST /api/theme        → Save preference       │   │ │
│  │  │  GET  /api/theme        → Get preference        │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │       Database Operations (File I/O)            │   │ │
│  │  ├──────────────────────────────────────────────────┤   │ │
│  │  │  readContactsDb() / writeContactsDb()           │   │ │
│  │  │  readThemesDb() / writeThemesDb()               │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         │                                      │
│                         ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              File System Storage                        │ │
│  │                                                          │ │
│  │  ┌──────────────────┐    ┌──────────────────┐          │ │
│  │  │ contacts.json    │    │ themes.json      │          │ │
│  │  ├──────────────────┤    ├──────────────────┤          │ │
│  │  │ [               │    │ {                │          │ │
│  │  │   {             │    │   "sessionId": { │          │ │
│  │  │     id,         │    │     darkMode,    │          │ │
│  │  │     name,       │    │     lastUpdated, │          │ │
│  │  │     email,      │    │     expiresAt    │          │ │
│  │  │     message,    │    │   }              │          │ │
│  │  │     timestamp   │    │ }                │          │ │
│  │  │   }             │    │                  │          │ │
│  │  │ ]               │    │                  │          │ │
│  │  └──────────────────┘    └──────────────────┘          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘

* Secure flag set to true in production (HTTPS only)
```

---

## Contact Form Submission Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER ACTION                                │
│                                                                 │
│  1. User fills form (name, email, message)                     │
│  2. Clicks "Send Message" button                               │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND VALIDATION                            │
│                                                                 │
│  handleChange()     → Clear submit error                       │
│  handleSubmit()     → Validate fields                          │
│                     → Set isSubmitting = true                  │
│                     → Disable form inputs                      │
│                     → Change button text to "Sending..."       │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│               HTTP REQUEST (AXIOS)                              │
│                                                                 │
│  POST http://localhost:5000/api/contact                        │
│  Content-Type: application/json                               │
│  withCredentials: true                                         │
│                                                                 │
│  Body: {                                                        │
│    name: "User Input",                                         │
│    email: "user@example.com",                                  │
│    message: "User message"                                     │
│  }                                                              │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│               BACKEND PROCESSING                                │
│                                                                 │
│  1. Parse JSON body ✓                                           │
│  2. Extract { name, email, message }                           │
│  3. Validate:                                                   │
│     - All fields required? ✓                                   │
│     - Email format valid? ✓                                    │
│  4. Trim whitespace                                            │
│  5. Create contact object:                                     │
│     {                                                           │
│       id: Date.now().toString(),                               │
│       name, email, message,                                    │
│       submittedAt: ISO timestamp                               │
│     }                                                           │
│  6. Read existing contacts from JSON                           │
│  7. Append new contact                                         │
│  8. Write updated array back to contacts.json                  │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 ↓
        ┌────────┴────────┐
        │                 │
    SUCCESS            ERROR
        │                 │
        ↓                 ↓
   ┌─────────┐         ┌──────────┐
   │ 201     │         │ 400/500  │
   │ Created │         │ Bad Req  │
   └────┬────┘         │ Error    │
        │              └────┬─────┘
        ↓                   ↓
   ┌───────────────────────────────────────┐
   │    FRONTEND RESPONSE HANDLING         │
   │                                       │
   │  SUCCESS (201):                       │
   │  - setSubmitted = true                │
   │  - Clear form data                    │
   │  - Show green success message         │
   │  - Auto-hide after 3 seconds          │
   │  - Re-enable form inputs              │
   │  - Set isSubmitting = false           │
   │                                       │
   │  ERROR (400/500):                     │
   │  - setSubmitError = error message     │
   │  - Show red error banner              │
   │  - Keep form data                     │
   │  - Set isSubmitting = false           │
   │  - Re-enable form inputs              │
   └───────────────────────────────────────┘
```

---

## Dark Mode Persistence Flow

### Initial Load
```
┌──────────────────────────────┐
│   App Mounts (Page Load)     │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────┐
│ ThemeContext Initialized     │
│                              │
│ Try: localStorage value      │
│ Fallback: system preference  │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────┐
│ useEffect Hook 1 Runs        │
│ (Fetch from backend)         │
│                              │
│ GET /api/theme               │
│ (sends sessionId cookie)     │
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    │          │
SUCCESS     ERROR
    │          │
    ↓          ↓
┌────────┐  ┌─────────────┐
│ Found  │  │ Not Found   │
│ in DB  │  │ or Expired  │
└───┬────┘  └────┬────────┘
    │            │
    ↓            ↓
setDarkMode   Keep Local
from DB       Value
    │            │
    └────┬───────┘
         │
         ↓
┌──────────────────────────────┐
│ setIsInitialized = true      │
│                              │
│ useEffect 2 runs             │
│ - Update DOM                 │
│ - Update localStorage        │
└──────────────────────────────┘
```

### Toggle Theme
```
┌──────────────────────────────────────┐
│  User Clicks Theme Toggle Button     │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│  toggleDarkMode() Called             │
│  → setDarkMode(!darkMode)            │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│  useEffect 2 Runs (watches darkMode) │
│                                      │
│  1. Update localStorage              │
│     localStorage.setItem(...)        │
│                                      │
│  2. Save to backend (async)          │
│     POST /api/theme                  │
│     { darkMode: new value }          │
│                                      │
│  3. Update DOM                       │
│     Add/remove "dark" class          │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│    Backend Sets Cookie & Saves       │
│                                      │
│  1. Read themes.json                 │
│  2. Update/Create session entry      │
│  3. Set Cookie:                      │
│     sessionId = timestamp            │
│     Max-Age = 30 days                │
│  4. Write themes.json                │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│     Theme Persisted Successfully     │
│                                      │
│  ✓ localStorage updated              │
│  ✓ Database updated                  │
│  ✓ Cookie set (30 days)              │
│  ✓ DOM updated (immediate)           │
└──────────────────────────────────────┘
```

---

## Database State Diagram

### Contacts Database Growth
```
┌─ Submission 1 ─────────────────┐
│ {                              │
│   "id": "1705946400000",       │
│   "name": "John Doe",          │
│   "email": "john@example.com", │
│   "message": "Hello!",         │
│   "submittedAt": "2026-01-22..." │
│ }                              │
└────────────────────────────────┘
         │
         ├─ Submission 2 ─────────────────┐
         │  {                             │
         │    "id": "1705946401000",      │
         │    ...                         │
         │  }                             │
         │  └─ Submission 3 ──────────────┐
         │     {                          │
         │       "id": "1705946402000",   │
         │       ...                      │
         │     }                          │
         │     └─ ... (continued)
```

### Themes Database with Expiration
```
┌─ Session 1 ────────────────────────────────┐
│ {                                          │
│   "1705946400000": {                       │
│     "darkMode": true,                      │
│     "lastUpdated": "2026-01-22T10:00:00Z",│
│     "expiresAt": "2026-02-21T10:00:00Z"   │
│   }                                        │
│ }                                          │
└────────────────────────────────────────────┘
         │
         ├─ Session 2 (Active) ──────────────┐
         │ {                                 │
         │   "1705946500000": {              │
         │     "darkMode": false,            │
         │     "expiresAt": "2026-02-21..." │
         │   }                               │
         │ }                                 │
         │
         ├─ Session 3 (Expired) ────────────┐
         │ {                                │
         │   "1705936400000": {             │
         │     "expiresAt": "2026-01-15..." │  ← DELETE THIS
         │   }                              │
         │ }                                │
         │
         └─ ON NEXT GET /api/theme
            Expired sessions deleted
```

---

## Error Handling Flow

```
┌─────────────────────────────────────┐
│       API Request Made              │
└────────┬────────────────────────────┘
         │
    ┌────┴───────────────┐
    │                    │
SUCCESS              ERROR
    │                    │
    ↓                    ↓
┌─────────┐          ┌──────────────────┐
│200/201  │          │Network/400/500   │
│Response │          │                  │
└────┬────┘          └────┬─────────────┘
     │                    │
     ↓                    ↓
  ┌────────────────────────────────┐
  │ axios Error Handler            │
  │                                │
  │ if (error.response?.data?.error)│
  │   → Use error.response.data.err │
  │ else                           │
  │   → Use generic message        │
  └────┬───────────────────────────┘
       │
       ├─ Contact Form Error ────────────────────┐
       │                                         │
       │ setSubmitError(errorMessage)            │
       │ Display red error banner               │
       │ Keep form data                         │
       │ Re-enable inputs                       │
       │ setIsSubmitting = false                │
       │                                         │
       │ Error persists until:                  │
       │ - User starts typing (clears error)   │
       │ - User submits again                   │
       │                                         │
       └─────────────────────────────────────────┘
       │
       ├─ Theme Save Error ──────────────────┐
       │                                     │
       │ console.error(error)                │
       │ Theme already in localStorage      │
       │ Next page load uses localStorage    │
       │ Fallback works silently            │
       │                                     │
       │ Silent fail - user doesn't see     │
       │ error (theme still persists)       │
       │                                     │
       └─────────────────────────────────────┘
```

---

## Cookie Lifecycle

```
┌──────────────────────────┐
│   User Toggles Theme     │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────────┐
│ POST /api/theme              │
│ Body: {darkMode: boolean}    │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│  Backend Creates Cookie                  │
│                                          │
│  sessionId = Date.now().toString()       │
│  thirtyDaysInMs = 30 * 24 * 60 * 60...   │
│  expiresAt = now + 30 days               │
│                                          │
│  res.cookie("sessionId", sessionId, {    │
│    httpOnly: true,                       │
│    secure: isProduction,                 │
│    sameSite: "lax",                      │
│    maxAge: thirtyDaysInMs                │
│  })                                      │
└────────┬───────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│  Browser Receives Response               │
│                                          │
│  Set-Cookie Header:                      │
│  sessionId=1705946400000;                │
│  Path=/;                                 │
│  Max-Age=2592000;                        │
│  HttpOnly;                               │
│  SameSite=lax                            │
└────────┬───────────────────────────────┘
         │
         ├─ 30 Days Pass ──────────────────┐
         │                                  │
         │  Next User Request               │
         │  GET /api/theme                  │
         │  Cookie: sessionId=1705946400000 │
         │                                  │
         │  Backend checks expiresAt        │
         │  If expired: DELETE from DB      │
         │  Return: darkMode = null         │
         │                                  │
         └──────────────────────────────────┘
         │
         └─ Within 30 Days ────────────────┐
            Browser Auto-Sends Cookie       │
            Every Request Includes:         │
            Cookie: sessionId=...           │
                                           │
            Backend retrieves preference    │
            Returns saved darkMode value    │
                                           │
            Process repeats                 │
            └───────────────────────────────┘
```

---

## State Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                   CONTACT FORM STATES                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INITIAL STATE                                             │
│  {                                                          │
│    formData: { name: "", email: "", message: "" },        │
│    submitted: false,                                       │
│    focusedField: null,                                     │
│    isSubmitting: false,                                    │
│    submitError: null                                       │
│  }                                                          │
│         │                                                   │
│         ├─ User Types ──→ handleChange ──→ formData[field] │
│         │              → submitError: null                 │
│         │                                                   │
│         ├─ Field Focused ──→ setFocusedField(name)        │
│         │                                                   │
│         ├─ Field Blurred ──→ setFocusedField(null)        │
│         │                                                   │
│         ├─ Submit Button Click ──→ handleSubmit()          │
│         │  {                                                │
│         │    isSubmitting: true,                           │
│         │    submitError: null,                            │
│         │    inputs: DISABLED,                             │
│         │    button: "Sending..."                          │
│         │  }                                                │
│         │     │                                             │
│         │     ├─ SUCCESS ──→                               │
│         │     │  {                                          │
│         │     │    submitted: true,    (3 sec timer)       │
│         │     │    formData: cleared,                      │
│         │     │    isSubmitting: false,                    │
│         │     │    focusedField: null                      │
│         │     │  } ──→ INITIAL STATE                       │
│         │     │                                             │
│         │     └─ ERROR ──→                                 │
│         │        {                                          │
│         │          submitError: message,                   │
│         │          isSubmitting: false,                    │
│         │          formData: KEPT,                         │
│         │          inputs: ENABLED                         │
│         │        } (clears on next input)                  │
│         │                                                   │
│         └─────────────→ INITIAL STATE                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              THEME CONTEXT STATES                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  MOUNT STATE                                            │
│  {                                                       │
│    darkMode: (from localStorage or system preference)  │
│    isInitialized: false,                               │
│    loading theme from backend...                       │
│  }                                                       │
│         │                                                │
│         ↓                                                │
│  FETCH COMPLETE                                         │
│  {                                                       │
│    darkMode: (from backend database),                  │
│    isInitialized: true,                                │
│    cookie set: sessionId                               │
│  }                                                       │
│         │                                                │
│         ├─ User Toggles ──→ toggleDarkMode()           │
│         │  {                                             │
│         │    darkMode: !current,                        │
│         │    POST /api/theme,                           │
│         │    Save to localStorage,                      │
│         │    Update DOM                                 │
│         │  }                                             │
│         │     │                                          │
│         │     ├─ SUCCESS ──→ Database updated           │
│         │     │              Cookie renewed             │
│         │     │                                          │
│         │     └─ ERROR ──→ localStorage still updated   │
│         │                Fallback works                 │
│         │                                                │
│         └─────→ READY FOR NEXT TOGGLE                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

**Diagrams Last Updated:** January 22, 2026
**Status:** Complete with all flows documented
