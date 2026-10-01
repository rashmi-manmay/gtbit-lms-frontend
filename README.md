# GTBIT IT LMS Frontend

This is the editable React source project for the GTBIT IT Leave Management System.

## Main features
- Teacher/staff login and signup
- Apply Leave form
- Leave History with automatic Days calculation
- Leave History updates immediately after a successful submission
- HOD dashboard with pending/all/current leave views
- Approve/reject leave requests
- Name/date/month filters
- Logout and role-based navigation

## Local setup
1. Open Command Prompt.
2. Go to this folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL shown by Vite.

## Production build
Run `npm run build`.
The deployable website will be created in the `dist` folder.

## Backend
The project is already configured for:
https://gtbit-lms-backend.onrender.com

To change the backend later, edit `.env` using:
VITE_API_URL=https://your-backend-url
