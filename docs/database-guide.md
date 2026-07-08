# WeeklyPulse Database Guide

## 1. Prisma schema
The Prisma schema is located at [backend/prisma/schema.prisma](../backend/prisma/schema.prisma).

## 2. Migration commands
Run the following from the backend folder:

```bash
npm install
npx prisma migrate dev --name init
npm run prisma:generate
npm run prisma:seed
```

## 3. Seed data for roles
The seed script at [backend/prisma/seed.js](../backend/prisma/seed.js) inserts:
- team_member
- manager

## 4. Normalization and relationships
- Roles are stored separately so user permissions are not duplicated across rows.
- Users reference a single role through role_id, which keeps the model normalized.
- Weekly reports reference both a user and a project, preventing repeated user/project data in each report.
- This design supports one-to-many relationships cleanly and avoids storing repeated values in multiple tables.
