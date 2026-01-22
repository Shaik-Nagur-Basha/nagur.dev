# Testing & Verification Guide

## Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- Node modules installed for both
- Browser with developer tools

## Test Cases

### Test 1: Contact Form Submission (Happy Path)

**Steps:**
1. Open http://localhost:5173 in browser
2. Scroll to Contact section
3. Fill the form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Message: `This is a test message`
4. Click "Send Message"

**Expected Results:**
- Button shows "Sending..." text
- Form inputs become disabled
- Success message appears (green)
- Form fields clear
- Success message disappears after 3 seconds

**Verification:**
```bash
# Check if file was created
cat backend/data/contacts.json
```

Should contain:
```json
[
  {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "This is a test message",
    "submittedAt": "..."
  }
]
```

---

### Test 2: Contact Form - Invalid Email

**Steps:**
1. Open http://localhost:5173
2. Go to Contact section
3. Fill the form:
   - Name: `Jane Smith`
   - Email: `invalid-email` (no @)
   - Message: `Test`
4. Click "Send Message"

**Expected Results:**
- Error message displays in red banner
- Message: "Invalid email format"
- Form is NOT cleared
- No data saved to database

---

### Test 3: Contact Form - Missing Fields

**Steps:**
1. Try submitting with empty Name field
2. Try submitting with empty Email field
3. Try submitting with empty Message field

**Expected Results:**
- HTML5 validation prevents submission
- Browser shows "Please fill in this field" message
- For any field that gets past HTML validation and backend:
  - Error message: "All fields are required"
  - Form not cleared
  - No data saved

---

### Test 4: Dark Mode Persistence

**Steps:**
1. Open http://localhost:5173
2. Check current theme (light or dark)
3. Toggle dark mode using theme switcher
4. Refresh the page (Ctrl+R or Cmd+R)
5. Check if dark mode preference is maintained

**Expected Results:**
- Theme preference persists after refresh
- Setting shows correct mode on reload
- DOM correctly applies dark/light classes

**Verification:**
```bash
# Check themes database
cat backend/data/themes.json
```

Should contain session with darkMode value:
```json
{
  "1234567890000": {
    "darkMode": true,
    "lastUpdated": "2026-01-22T10:15:30.000Z",
    "expiresAt": "2026-02-21T10:15:30.000Z"
  }
}
```

---

### Test 5: Cookie Creation

**Steps:**
1. Open DevTools (F12)
2. Go to Applications tab
3. Expand Cookies
4. Select `http://localhost:5173`
5. Toggle dark mode
6. Check if `sessionId` cookie appears

**Expected Results:**
- Cookie name: `sessionId`
- Cookie value: timestamp string
- Path: `/`
- Domain: `localhost`
- Expires: 30 days from now
- HttpOnly: ✓ (checked)
- Secure: ✗ (unchecked, as we're in development)

---

### Test 6: Multiple Form Submissions

**Steps:**
1. Submit contact form with different data
2. Submit a second time with different information
3. Submit a third time

**Expected Results:**
- Each submission succeeds
- Success message displays each time
- All three entries appear in `backend/data/contacts.json`
- Each has unique ID and timestamp

**Verification:**
```bash
cat backend/data/contacts.json
# Should have 3 entries in the array
```

---

### Test 7: Backend API Direct Testing

#### Test Contact Endpoint with cURL
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Testing via cURL"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "contact": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "message": "Testing via cURL",
    "submittedAt": "..."
  }
}
```

#### Get All Contacts
```bash
curl http://localhost:5000/api/contacts
```

**Expected Response (200):**
Array of all contact submissions

---

### Test 8: Theme API Direct Testing

#### Save Theme Preference
```bash
curl -X POST http://localhost:5000/api/theme \
  -H "Content-Type: application/json" \
  -d '{"darkMode": true}' \
  -b "sessionId=test123" \
  -c cookies.txt
```

#### Retrieve Theme Preference
```bash
curl http://localhost:5000/api/theme \
  -b "sessionId=test123"
```

---

### Test 9: Error Handling - Backend Offline

**Steps:**
1. Stop the backend server (Ctrl+C)
2. Try toggling dark mode in frontend
3. Refresh the page

**Expected Results:**
- Error logged to console
- Theme still works (localStorage fallback)
- No page errors

**Steps for Contact Form:**
1. Backend stopped
2. Try submitting contact form
3. Error message appears: "Failed to submit the form. Please try again."

---

### Test 10: Session Expiration

**Manual Test (waiting 30 days):**
- Create a theme session
- Wait 30 days
- Try accessing the app with that sessionId
- New preference will be generated

**Automated Check:**
```bash
# Look for expiresAt dates in themes.json
cat backend/data/themes.json | grep expiresAt
```

Verify dates are 30 days in the future.

---

### Test 11: Stress Test - Multiple Submissions

**Steps:**
1. Submit contact form 10 times rapidly
2. Toggle dark mode 5 times rapidly
3. Check database files

**Expected Results:**
- All submissions saved
- No data loss
- Database files still valid JSON

---

## Browser Console Checks

### Check for Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Submit contact form
4. Look for any red error messages
   - Expected: Only axios errors if backend is down
   - Unexpected: Syntax errors, React errors

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Submit contact form
4. Should see:
   - `POST /api/contact` - Status: 201
   - Request Headers include: `Content-Type: application/json`
   - Response contains success message

### Check Theme Requests
1. Go to Network tab
2. Toggle dark mode
3. Should see:
   - `POST /api/theme` - Status: 200
   - Response contains darkMode value

---

## Performance Tests

### Load Testing
```bash
# Simulate 100 rapid form submissions
for i in {1..100}; do
  curl -X POST http://localhost:5000/api/contact \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"User$i\", \"email\": \"user$i@example.com\", \"message\": \"Message $i\"}" &
done
wait
```

**Check:** Database still valid, no duplicates lost

---

## File System Checks

### Verify Database Files
```bash
# Check contacts database
ls -la backend/data/contacts.json
file backend/data/contacts.json
jq '.' backend/data/contacts.json  # Pretty print if jq installed

# Check themes database
ls -la backend/data/themes.json
jq '.' backend/data/themes.json
```

### Check File Permissions
```bash
# Ensure files are readable/writable
chmod 644 backend/data/*.json
```

---

## Cleanup

### Reset Databases for Fresh Testing
```bash
# Delete old data
rm -rf backend/data/

# Restart backend to recreate empty files
# or manually create:
echo '[]' > backend/data/contacts.json
echo '{}' > backend/data/themes.json
```

### Clear Cookies
1. Open DevTools
2. Application → Cookies → localhost
3. Right-click sessionId → Delete

---

## Success Criteria

- [x] Contact form submits without errors
- [x] Data saves to `backend/data/contacts.json`
- [x] Email validation works
- [x] Error messages display correctly
- [x] Success message shows for 3 seconds
- [x] Dark mode preference persists across refreshes
- [x] SessionId cookie created with 30-day expiry
- [x] Theme data saves to `backend/data/themes.json`
- [x] Multiple submissions work correctly
- [x] Fallback to localStorage when backend unavailable
- [x] No console errors (except expected CORS if not configured)
- [x] Database files remain valid JSON

---

## Common Issues & Solutions

### Issue: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:5000/...' from origin 
'http://localhost:5173' has been blocked
```

**Solution:** 
- Verify backend is running
- Check CORS configuration in `backend/index.js`
- Restart backend server

### Issue: 404 Not Found
```
POST http://localhost:5000/api/contact 404 (Not Found)
```

**Solution:**
- Verify backend is running
- Check endpoint is exactly `/api/contact` (case-sensitive)
- Check backend code for typos

### Issue: Form Won't Submit
```
TypeError: Cannot read property 'status' of undefined
```

**Solution:**
- Backend server not running
- Network request failing silently
- Check browser console for actual error

### Issue: Dark Mode Not Persisting
- Clear browser cache
- Clear cookies
- Restart both frontend and backend
- Check `backend/data/themes.json` exists and is writable

---

**Last Updated:** January 22, 2026
