# Technical Reference

## API Endpoints Reference

### 1. POST /api/contact
**Purpose:** Submit contact form

**Request:**
```
Method: POST
URL: http://localhost:5000/api/contact
Content-Type: application/json
Credentials: include
Body: {
  "name": "string (required)",
  "email": "string (required, valid email format)",
  "message": "string (required)"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "contact": {
    "id": "timestamp string",
    "name": "User Name",
    "email": "user@example.com",
    "message": "Message text",
    "submittedAt": "ISO 8601 timestamp"
  }
}
```

**Response Error (400):**
```json
{
  "error": "All fields are required"
}
```
or
```json
{
  "error": "Invalid email format"
}
```

**Response Error (500):**
```json
{
  "error": "Failed to submit contact form"
}
```

**Backend Code Location:** `backend/index.js:97-138`

---

### 2. GET /api/contacts
**Purpose:** Retrieve all submitted contacts (admin endpoint)

**Request:**
```
Method: GET
URL: http://localhost:5000/api/contacts
```

**Response Success (200):**
```json
[
  {
    "id": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Test message",
    "submittedAt": "2026-01-22T10:15:30.000Z"
  },
  {
    "id": "1234567891",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "Another message",
    "submittedAt": "2026-01-22T10:16:40.000Z"
  }
]
```

**Response Error (500):**
```json
{
  "error": "Failed to fetch contacts"
}
```

**Backend Code Location:** `backend/index.js:140-147`

---

### 3. POST /api/theme
**Purpose:** Save dark mode preference with session cookie

**Request:**
```
Method: POST
URL: http://localhost:5000/api/theme
Content-Type: application/json
Credentials: include
Body: {
  "darkMode": boolean (true or false)
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Theme preference saved",
  "sessionId": "1234567890000",
  "darkMode": true
}
```

**Cookie Set (automatic):**
```
Name: sessionId
Value: 1234567890000
Path: /
Domain: localhost
MaxAge: 2592000000 ms (30 days)
HttpOnly: true
Secure: false (true in production)
SameSite: lax
```

**Response Error (500):**
```json
{
  "error": "Failed to save theme preference"
}
```

**Backend Code Location:** `backend/index.js:149-187`

---

### 4. GET /api/theme
**Purpose:** Retrieve saved dark mode preference

**Request:**
```
Method: GET
URL: http://localhost:5000/api/theme
Credentials: include
Cookies: sessionId=... (automatic)
```

**Response Success (200) - With Valid Session:**
```json
{
  "success": true,
  "darkMode": true,
  "sessionId": "1234567890000"
}
```

**Response Success (200) - No Valid Session:**
```json
{
  "darkMode": null,
  "sessionId": null
}
```

**Response Error (500):**
```json
{
  "error": "Failed to fetch theme preference"
}
```

**Backend Code Location:** `backend/index.js:189-219`

---

## Frontend Integration Points

### Contact.jsx - Key Changes

**Imports Added:**
```javascript
import axios from "axios";
const API_URL = "http://localhost:5000/api";
```

**New State:**
```javascript
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState(null);
```

**Updated handleSubmit Function:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitError(null);

  try {
    const response = await axios.post(`${API_URL}/contact`, formData, {
      withCredentials: true,
    });

    if (response.status === 201) {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setFocusedField(null);
      
      setTimeout(() => setSubmitted(false), 3000);
    }
  } catch (error) {
    setSubmitError(
      error.response?.data?.error ||
        "Failed to submit the form. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};
```

**File Location:** `frontend/src/components/Contact.jsx:57-82`

---

### ThemeContext.jsx - Key Changes

**API Integration:**
```javascript
const API_URL = "http://localhost:5000/api";

// Fetch theme on mount
useEffect(() => {
  const fetchThemePreference = async () => {
    try {
      const response = await axios.get(`${API_URL}/theme`, {
        withCredentials: true,
      });

      if (response.data.darkMode !== null) {
        setDarkMode(response.data.darkMode);
      }
    } catch (error) {
      // Fallback to localStorage
    } finally {
      setIsInitialized(true);
    }
  };

  fetchThemePreference();
}, []);

// Save theme changes
useEffect(() => {
  if (!isInitialized) return;

  localStorage.setItem("darkMode", JSON.stringify(darkMode));

  const saveTheme = async () => {
    try {
      await axios.post(`${API_URL}/theme`, { darkMode }, {
        withCredentials: true,
      });
    } catch (error) {
      // Continue with localStorage
    }
  };

  saveTheme();

  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [darkMode, isInitialized]);
```

**File Location:** `frontend/src/context/ThemeContext.jsx:1-82`

---

## Database Schema

### contacts.json Structure
```
Array of Contact Objects

Contact Object:
{
  id: string (milliseconds timestamp)
  name: string (trimmed)
  email: string (trimmed, validated)
  message: string (trimmed)
  submittedAt: string (ISO 8601 timestamp)
}

Example:
[
  {
    "id": "1705946400000",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello World",
    "submittedAt": "2026-01-22T10:00:00.000Z"
  }
]
```

### themes.json Structure
```
Object with sessionId keys

Theme Object:
{
  [sessionId]: {
    darkMode: boolean
    lastUpdated: string (ISO 8601 timestamp)
    expiresAt: string (ISO 8601 timestamp)
  }
}

Example:
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

---

## Middleware Stack

**Order of Execution:**

1. **CORS Middleware** - Validates cross-origin requests
2. **express.json()** - Parses JSON request bodies
3. **cookieParser()** - Parses cookies from headers
4. **Route Handlers** - Processes specific endpoint requests

```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
```

---

## Error Handling Strategy

### Frontend Error Display
```javascript
{submitError && (
  <div className="error-message">
    <p className="font-bold">Error</p>
    <p className="text-sm">{submitError}</p>
  </div>
)}
```

### Backend Error Logging
```javascript
console.error("Error submitting contact form:", error);
res.status(500).json({ error: "Failed to submit contact form" });
```

### Fallback Mechanisms
- **Theme**: localStorage used if backend unavailable
- **Contact**: Error shown to user, no fallback (requires backend)

---

## Session Management Logic

### Session Creation
1. User toggles dark mode
2. POST /api/theme called
3. Backend generates `sessionId` from current timestamp
4. Cookie set with 30-day expiry
5. Theme preference saved to themes.json with expiration date

### Session Retrieval
1. Page loads/refreshes
2. GET /api/theme called (with sessionId cookie)
3. Backend looks up sessionId in themes.json
4. Checks if session expired
5. If expired, deletes from database and returns null
6. If valid, returns darkMode preference

### Session Cleanup
```javascript
const expirationDate = new Date(themeData.expiresAt);
if (expirationDate < new Date()) {
  delete themes[sessionId];
  writeThemesDb(themes);
  return null;
}
```

---

## CORS Configuration

### Allowed Origins
- `http://localhost:5173` - Vite dev server
- `http://localhost:3000` - Alternative dev port

### Credentials Policy
- `credentials: true` - Allows cookies to be sent

### For Production
```javascript
app.use(cors({
  origin: "https://yourdomain.com",
  credentials: true,
}));
```

---

## Dependencies

### Backend
```json
{
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "nodemon": "^3.1.11",
  "cookie-parser": "^1.4.6"
}
```

### Frontend
```json
{
  "axios": "^1.13.2",
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

---

## File I/O Operations

### Read Database
```javascript
const readContactsDb = () => {
  try {
    return JSON.parse(fs.readFileSync(contactsDbPath, "utf8"));
  } catch (err) {
    console.error("Error reading contacts database:", err);
    return [];
  }
};
```

### Write Database
```javascript
const writeContactsDb = (data) => {
  try {
    fs.writeFileSync(contactsDbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing contacts database:", err);
  }
};
```

### Directory Creation
```javascript
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
```

---

## Request/Response Examples

### Example: Submit Contact Form
```bash
# Request
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "message": "Great work!"
  }'

# Response (201)
{
  "success": true,
  "message": "Contact form submitted successfully",
  "contact": {
    "id": "1705946400123",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "message": "Great work!",
    "submittedAt": "2026-01-22T10:00:00.123Z"
  }
}
```

### Example: Save Dark Mode Theme
```bash
# Request
curl -X POST http://localhost:5000/api/theme \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionId=existing123" \
  -d '{"darkMode": true}'

# Response (200)
{
  "success": true,
  "message": "Theme preference saved",
  "sessionId": "existing123",
  "darkMode": true
}

# Cookie Set:
Set-Cookie: sessionId=existing123; 
  Path=/; 
  HttpOnly; 
  SameSite=lax; 
  Max-Age=2592000
```

---

## Performance Considerations

### File I/O Timing
- Contact submission: ~5-10ms (JSON write)
- Theme retrieval: ~2-5ms (JSON read)
- Theme save: ~5-10ms (JSON write)

### Database Size Impact
- Typical contact entry: ~300-500 bytes
- Typical theme entry: ~150-200 bytes
- 1000 contacts: ~350-500 KB
- 1000 sessions: ~150-200 KB

### Recommended Production Upgrades
- Use MongoDB for better performance with large datasets
- Implement caching layer (Redis)
- Add database indexing
- Use connection pooling

---

**Last Updated:** January 22, 2026
**Version:** 1.0
