import { google } from "googleapis";

// Create or get authorization
const getAuth = () => {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
};

// Add contact to Google Sheet
export const addContactToSheet = async (contactData) => {
  try {
    if (
      !process.env.GOOGLE_SHEET_ID ||
      !process.env.GOOGLE_CLIENT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY
    ) {
      console.warn("⚠ Google Sheets not configured. Skipping sheet update.");
      return null;
    }

    const auth = getAuth();

    // Format submission date
    const submittedAt = new Date(contactData.submittedAt).toLocaleString(
      "en-US",
      {
        timeZone: "UTC",
      },
    );

    // Append row to sheet
    const sheets = google.sheets("v4");
    const response = await sheets.spreadsheets.values.append({
      auth: getAuth(),
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            contactData.name,
            contactData.email,
            contactData.message,
            submittedAt,
          ],
        ],
      },
    });

    console.log("✓ Contact added to Google Sheet");
    return response.data;
  } catch (error) {
    console.error("✗ Error adding contact to Google Sheet:", error.message);
    // Don't throw - let MongoDB save succeed even if Sheets fails
    return null;
  }
};
