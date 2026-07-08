# WeeklyPulse

WeeklyPulse is a full-stack internship assignment starter for managing weekly team reports and viewing a simple dashboard.

## What is included
- React + Vite frontend with Tailwind styling
- Express backend with auth, reports, projects, and dashboard routes
- Role-aware UI for team members and managers
- Production-style structure with reusable UI components and validation

## Run locally
1. Install backend dependencies
   - cd backend
   - npm install
2. Start the backend
   - npm start
3. Install frontend dependencies
   - cd ../frontend
   - npm install
4. Start the frontend
   - npm run dev

## Default credentials
- Manager: ava@weeklypulse.dev / password123
- Team member: noah@weeklypulse.dev / password123

## Notes
- The backend currently uses an in-memory data store for the starter implementation.
- Prisma schema is included and can be connected to PostgreSQL when the database is available.
