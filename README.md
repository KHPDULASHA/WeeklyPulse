# WeeklyPulse

A full-stack **Weekly Report Management System** that enables team members to submit weekly reports while allowing managers to monitor team progress through analytics and AI-powered insights.

---

## 📌 Overview

WeeklyPulse streamlines weekly reporting by providing a centralized platform where employees can submit structured reports, managers can review team performance, and an AI assistant can summarize reports and answer project-related questions.

---

## ✨ Features

### Authentication

* Secure user registration and login
* JWT-based authentication
* Role-based access control (Manager & Team Member)

### Team Member

* Create weekly reports
* Edit draft reports
* Submit reports
* View report history
* Dashboard with personal report statistics

### Manager

* View team analytics dashboard
* Monitor report submission status
* Manage projects (Create, Update, Delete)
* View team progress charts
* Review submitted reports

### AI Assistant

* Global AI chatbot available throughout the application
* Suggested quick questions
* Weekly report summaries
* Team progress insights
* Workload and blocker analysis
* Backend-only OpenAI integration
* Automatic fallback responses when no API key is configured

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios

## Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL-compatible Database
* JWT Authentication

## AI

* OpenAI Chat Completions API
* Backend-only API integration
* Intelligent fallback summaries

---

# 📂 Project Structure

```text
WeeklyPulse/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/WeeklyPulse.git

cd WeeklyPulse
```

---

## 2. Backend Setup

Navigate to the backend folder.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Create the environment file.

```bash
cp .env.example .env
```

Update the `.env` file with your configuration.

```env
DATABASE_URL=postgresql://user:password@localhost:5432/weeklypulse
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your-openai-api-key
```

Generate the Prisma client.

```bash
npm run prisma:generate
```

Run database migrations.

```bash
npm run prisma:migrate
```

(Optional) Seed sample data.

```bash
npm run prisma:seed
```

Start the backend server.

```bash
npm run dev
```

---

## 3. Frontend Setup

Open a second terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run the development server.

```bash
npm run dev
```

Open your browser.

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

Create a `.env` file inside the `backend` directory.

| Variable       | Description                           |
| -------------- | ------------------------------------- |
| DATABASE_URL   | PostgreSQL database connection string |
| JWT_SECRET     | Secret key for JWT authentication     |
| PORT           | Backend server port                   |
| NODE_ENV       | Development or production environment |
| OPENAI_API_KEY | OpenAI API key (optional)             |

> **Note:** If `OPENAI_API_KEY` is not configured, the AI assistant automatically switches to fallback responses based on stored report data.

---

# 📍 Application Routes

| Route                      | Description           |
| -------------------------- | --------------------- |
| `/auth/login`              | User Login            |
| `/auth/register`           | User Registration     |
| `/member/dashboard`        | Team Member Dashboard |
| `/member/reports/new`      | Create Weekly Report  |
| `/member/reports/:id/edit` | Edit Weekly Report    |
| `/dashboard`               | Manager Dashboard     |
| `/projects`                | Project Management    |

---

# 🧪 Testing

After starting both servers, verify the following functionality:

* User authentication (login and registration)
* Logout from the global navigation
* Create, edit, and submit weekly reports
* Manager analytics dashboard
* Project CRUD operations
* AI chatbot quick questions
* AI-generated report summaries
* Project selection when creating reports

---

# 🤖 AI Assistant

The integrated AI assistant can help users:

* Summarize weekly reports
* Analyze team progress
* Identify blockers
* Review workloads
* Answer project-related questions

If an OpenAI API key is unavailable, the application provides meaningful fallback summaries to ensure uninterrupted functionality.

---

# 🔒 Security

* JWT Authentication
* Protected API routes
* Role-based authorization
* Backend-only OpenAI API integration
* Environment variable configuration for sensitive credentials

---
# 📍 Demo Video
https://drive.google.com/drive/folders/1YHUnM6Nc127oHqXeXP1EdbUOQqRYOoMr?usp=drive_link
---

# 📈 Future Improvements

* Email notifications
* Report export (PDF/Excel)
* Advanced analytics
* Team performance trends
* Real-time notifications
* File attachments
* Admin management dashboard

---

# 📄 License

This project is developed for educational and learning purposes.

---

## 👨‍💻 Author

Developed as a Full-Stack Weekly Report Management System using React, Node.js, Express, Prisma, PostgreSQL, and OpenAI.
