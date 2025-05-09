# MathsOnline School List Form

## Overview
A web form for school list submissions, styled to match the MathsOnline design, with drag-and-drop file upload and email sending functionality.

---

## Folder Structure
- `frontend/` — Contains the HTML/CSS/JS for the form UI.
- `backend/` — Node.js/Express server to handle form submissions and send emails.

---

## Setup Instructions

### 1. Backend
1. Go to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Edit `server.js` and set your email and app password in the Nodemailer config.
4. Start the server:
   ```sh
   npm start
   ```
   The backend will run on port 3000 by default.

### 2. Frontend
1. Open `frontend/index.html` in your browser.
2. The form will POST to `/api/send-email` (adjust the URL if your backend is on a different host/port).

---

## Notes
- The backend uses Gmail by default. For production, use a secure SMTP provider and environment variables for credentials.
- All form submissions (with attachments) are emailed to `lists@mathsonline.com.au`.
- You can deploy the backend to any Node.js-compatible host (Vercel, Heroku, etc). 