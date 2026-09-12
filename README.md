# Job Application Portal

A full-stack job application portal built with React, Node.js, Express.js, PostgreSQL, and Prisma.

## Tech Stack

### Frontend
- React.js
- JavaScript
- Vite
- Tailwind CSS
- Framer Motion (for dynamic animations)
- Lucide React (for icons)

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM

## Project Structure

```text
job-application-portal/
├── frontend/               # React frontend application (Vite)
│   ├── public/             # Static assets
│   ├── src/                
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page views (Jobs, JobDetails, Applications)
│   │   ├── services/       # API communication logic
│   │   └── utils/          # Shared utilities (validation, toast)
│   ├── package.json
│   └── vite.config.js
└── backend/                # Node.js + Express backend
    ├── prisma/             
    │   ├── schema.prisma   # Database schema definitions
    │   └── seed.js         # Initial database seed script
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── dao/            # Data Access Objects (Database interaction)
    │   ├── middleware/     # Express middleware (Error handling, CORS)
    │   ├── routes/         # API route definitions
    │   └── services/       # Core business logic and validation
    ├── .env                # Environment variables
    ├── server.js           # Server entry point
    └── package.json
```

## Features

- **Job Listings**: View a list of available job openings with beautiful, physics-based entrance animations.
- **Job Details**: View comprehensive details about a specific role, including location, work mode, and descriptions.
- **Dynamic Application Form**: Apply to individual jobs by filling out dynamic forms tailored to the specific questions required for each role.
- **Apply to All (Bulk Application)**: Select multiple jobs and apply to all of them at once using an interactive, accordion-style bulk application wizard.
- **Robust Validation**: Real-time client-side and server-side validation for various question types (text, number, textarea, multiple choice, checkboxes, booleans).
- **Application Tracking**: View all your submitted applications on the dedicated "My Applications" dashboard.

## Setup Instructions

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- A PostgreSQL database (e.g., [Neon DB](https://neon.tech/) or a local instance)

### 2. Backend Setup
Navigate to the backend directory, install dependencies, configure your environment, and initialize the database.

```bash
cd backend
npm install

# Create a .env file based on the example
cp .env.example .env

# Edit the .env file and add your PostgreSQL connection string
# DATABASE_URL="postgresql://user:password@host:port/database"
```

Initialize the Prisma schema and seed the database with initial jobs:
```bash
npx prisma db push
npm run seed
```

Start the backend development server:
```bash
npm start
```
*The backend server will run on `http://localhost:5000`.*

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*The frontend application will run on `http://localhost:5173`.*

## API Endpoints

### Jobs
- `GET /api/jobs`: Fetch all available jobs.
- `GET /api/jobs/:id`: Fetch a specific job by ID, including its required questions.

### Applications
- `GET /api/applications`: Fetch all submitted applications for the current user.
- `POST /api/jobs/:id/apply`: Submit an application for a specific job.
- `POST /api/applications/bulk`: Submit applications to multiple jobs simultaneously.
