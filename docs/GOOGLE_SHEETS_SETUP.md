# Google Sheets Setup Guide

## Steps to Enable Google Sheets Integration

### 1. Create a Google Sheet
1. Go to https://sheets.google.com
2. Create a new spreadsheet
3. Name it "NagurContacts" (or any name)
4. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
5. Create a header row with these columns:
   - A1: `Name`
   - B1: `Email`
   - C1: `Message`
   - D1: `Submitted At`
   - E1: `Unread`

### 2. Create Service Account
1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Go to "Credentials" → "Create Credentials" → "Service Account"
4. Fill in service account details
5. Click "Create and Continue"
6. Grant "Editor" role
7. Click "Continue" and "Done"

### 3. Create Service Account Key
1. Click on the service account you created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Download the JSON file
6. Open it and copy these values:
   - `project_id` → GOOGLE_PROJECT_ID
   - `private_key_id` → GOOGLE_PRIVATE_KEY_ID
   - `private_key` → GOOGLE_PRIVATE_KEY
   - `client_email` → GOOGLE_CLIENT_EMAIL
   - `client_id` → GOOGLE_CLIENT_ID

### 4. Share Sheet with Service Account
1. Open your Google Sheet
2. Click "Share"
3. Paste the `client_email` from the JSON file
4. Give "Editor" permission
5. Uncheck "Notify people"
6. Click "Share"

### 5. Update .env File
Add these to `backend/.env`:
```
GOOGLE_SHEET_ID=your-sheet-id-from-url
GOOGLE_PROJECT_ID=your-project-id-from-json
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY=your-private-key-with-\n-replaced
GOOGLE_CLIENT_EMAIL=service-account-email@project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
```

**Important:** When copying `private_key`, keep the literal `\n` characters. Don't replace them with actual newlines.

### 6. Test
- Restart the backend: `npm run dev`
- Submit a contact form
- Check your Google Sheet - the data should appear automatically!

## Troubleshooting

**Sheet not updating?**
- Make sure sheet name is "Contacts" (or update range in googleSheets.js)
- Verify all credentials are correct in .env
- Check browser console for errors
- Check server console for error messages

**Authentication error?**
- Double-check the service account email is shared with the sheet
- Verify all credentials copied correctly from JSON file
- Make sure `\n` is literal text in GOOGLE_PRIVATE_KEY, not newlines

**"Cannot find module googleapis"?**
- Run `npm install googleapis` in the backend folder
