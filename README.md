# Mini Job Queue Dashboard

A full-stack job queue management dashboard for creating and managing background jobs through a React frontend and NestJS REST API. It uses PostgreSQL for persistent job data and enforces job lifecycle rules at the backend level.

## Live Demo

- **Frontend:** https://mini-job-queue-dashboard-chi.vercel.app
- **Backend API:** https://mini-job-queue-api.onrender.com
- **Database:** PostgreSQL using Supabase

---

# Features

### Job Management

- Create a new job
- View jobs
- Filter jobs by status
- Update job status
- Delete jobs
- Display job creation time
- Display counts for every job status

### Status Management

Supported statuses:

- `pending`
- `running`
- `completed`
- `failed`

Supported transitions:

```text
pending → running → completed
     ↘ failed

running → failed
```

A `completed` or `failed` job cannot be moved back to `running`.

The backend is responsible for enforcing these rules, so the rules cannot be bypassed by directly calling the API.

### Pagination

I added pagination as the production-ready improvement.

Example:

```http
GET /jobs?page=1&limit=10
```

The API also supports filtering together with pagination:

```http
GET /jobs?page=1&limit=10&status=pending
```

The maximum page size is currently limited to 10.

---

## Tech Stack

### Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- Redux Persist
- Axios
- React Toastify
- Lucide React

### Backend

- Node.js
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Supabase
- Class Validator
- Class Transformer

### Deployment

- Vercel - Frontend
- Render - Backend
- Supabase - PostgreSQL database

### Development / Testing

- Git & GitHub
- Postman

---

# Architecture

I kept the application intentionally simple and separated responsibilities between layers.

### Backend

```text
Controller
    ↓
DTO Validation
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

### Frontend

```text
React Component
       ↓
jobsService.ts
       ↓
Backend API
       ↓
Response
       ↓
Redux Action
       ↓
jobsSlice.ts
       ↓
Redux Store
       ↓
React Re-render
```

I intentionally keep HTTP/API calls inside the service layer instead of putting API calls directly inside Redux.

I also did not use `createAsyncThunk`, because I wanted the API layer and Redux state-management layer to remain clearly separated for this project.

---

## Project Structure

```text
Mini-Job-Queue-Dashboard/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── jobs.controller.ts
│   │   │
│   │   ├── services/
│   │   │   └── jobs.service.ts
│   │   │
│   │   ├── repositories/
│   │   │   └── jobs.repository.ts
│   │   │
│   │   ├── dto/
│   │   │   ├── create-job.dto.ts
│   │   │   ├── update-job-status.dto.ts
│   │   │   └── get-jobs.dto.ts
│   │   │
│   │   ├── entities/
│   │   │   └── job.entity.ts
│   │   │
│   │   ├── enums/
│   │   │   └── job-status.enum.ts
│   │   │
│   │   ├── app.module.ts
│   │   ├── jobs.module.ts
│   │   └── main.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── jobs/
│   │   │   │   ├── JobTable.tsx
│   │   │   │   ├── JobRow.tsx
│   │   │   │   ├── CreateJobModal.tsx
│   │   │   │   └── StatusBadge.tsx
│   │   │   │
│   │   │   ├── StatusCards.tsx
│   │   │   ├── JobFilters.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── Pagination.tsx
│   │   │
│   │   ├── redux/
│   │   │   ├── jobsSlice.ts
│   │   │   ├── hooks.ts
│   │   │   └── store.ts
│   │   │
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── apiError.ts
│   │   │   └── jobsService.ts
│   │   │
│   │   ├── types/
│   │   │   └── job.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

# API Endpoints

### Create Job

```http
POST /jobs
```

Request:

```json
{
  "title": "Generate monthly report",
  "type": "report"
}
```

The backend creates the job with:

```text
status = pending
```

---

### Get Jobs

```http
GET /jobs
```

With pagination:

```http
GET /jobs?page=1&limit=10
```

With status filtering:

```http
GET /jobs?status=running
```

With both:

```http
GET /jobs?page=1&limit=10&status=running
```

---

### Get Status Counts

```http
GET /jobs/counts
```

Example response:

```json
{
  "pending": 3,
  "running": 2,
  "completed": 1,
  "failed": 1
}
```

---

### Update Job Status

```http
PATCH /jobs/:id/status
```

Request:

```json
{
  "status": "running"
}
```

The backend checks whether the requested transition is valid before updating the database.

---

### Delete Job

```http
DELETE /jobs/:id
```

---

# Validation and Error Handling

I use NestJS validation pipes with:

```text
whitelist: true
forbidNonWhitelisted: true
transform: true
```

The API validates:

- Required job title
- Required job type
- Maximum title length
- Maximum type length
- Valid status values
- Valid UUIDs
- Pagination values
- Status filters

The backend returns appropriate HTTP errors for cases such as:

- Job not found → `404`
- Invalid UUID → `400`
- Invalid status transition → `409`
- Concurrent status conflict → `409`
- Invalid request body → `400`

On the frontend, API error extraction is centralized in `apiError.ts`, and user-facing errors are displayed through error states and toast notifications.

---

## Concurrency Handling

One of the important parts of the assignment was reasoning about two browser tabs attempting to update the same job at almost the same time.

For example:

```text
Tab A sees: pending
Tab B sees: pending

Tab A → running
Tab B → running
```

I enforce the business rule on the backend rather than trusting the React application.

The service first validates the transition.

The repository then performs a conditional database update:

```sql
UPDATE jobs
SET status = 'running'
WHERE id = ?
AND status = 'pending';
```

The update succeeds only if the job is still in the expected previous state.

If:

```text
affected rows = 1
```

the update succeeded.

If:

```text
affected rows = 0
```

another request has already changed the status, so the API returns a conflict.

This prevents two concurrent requests from both successfully applying the same state transition.

I chose this approach because the assignment does not require a distributed locking system. A conditional database update provides the required consistency while keeping the implementation simple.

---

## Why the Backend Owns the Business Rules

I do not rely only on frontend buttons to prevent invalid transitions.

For example, even if someone bypasses the React application and sends:

```http
PATCH /jobs/:id/status
```

with:

```json
{
  "status": "running"
}
```

the backend still checks the current state and rejects the request if the transition is invalid.

The frontend controls the user experience.

The backend remains authoritative for the actual business rules.

---

## Design Decisions and Trade-offs

### PostgreSQL instead of SQLite

I chose PostgreSQL because the application represents a persistent backend system and the assignment specifically allows PostgreSQL or SQLite.

PostgreSQL also gives me a more production-oriented relational database setup and is suitable for handling concurrent requests.

The trade-off is that PostgreSQL requires more setup than SQLite.

---

### TypeORM

I chose TypeORM because it integrates naturally with NestJS and keeps the entity/repository structure straightforward.

It also allowed me to use PostgreSQL without writing database access logic directly inside controllers or services.

---

### Service + Repository Separation

I separated:

- Controller - HTTP layer
- Service - business logic
- Repository - database operations
- DTO - request validation
- Entity - database model

This keeps each part focused on one responsibility and makes the code easier to reason about.

---

### Redux Toolkit

I use Redux Toolkit for centralized frontend state.

The Redux store contains:

- Jobs
- Status counts
- Pagination state
- Selected filter
- Loading state
- Error state

I chose Redux because the dashboard has multiple components that depend on the same job state, such as status cards, filters, the table, and pagination.

---

### API Calls Outside Redux

I intentionally keep API calls in:

```text
frontend/src/services/jobsService.ts
```

Redux reducers only update application state.

This keeps networking concerns separate from state management.

---

### Redux Persist

I use Redux Persist to preserve relevant frontend state between page refreshes.

I keep the persisted state limited to the jobs slice.

---

### No Authentication

I did not add authentication because authentication was not part of the assignment requirements.

Adding authentication would increase implementation complexity without contributing to the specific API, state-management, validation, and concurrency requirements being evaluated.

---

### No Redis / Workers / WebSockets

Although a real job queue system could use Redis, workers, BullMQ, WebSockets, or a message broker, I intentionally did not introduce them here.

The assignment asks for a small job queue dashboard and specifically says not to build an overly complicated distributed system.

For this scope, PostgreSQL plus backend-enforced state transitions is sufficient.

---

# Production-Ready Improvement

## Pagination

I chose pagination as my small production-ready improvement.

Without pagination, the backend would return every job as the number of jobs grows.

Instead, the API supports:

```http
GET /jobs?page=1&limit=10
```

The response contains pagination metadata:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

This keeps API responses bounded and makes the dashboard more suitable for a growing dataset.

---

## Environment Variables

### Backend

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

For production:

```env
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
FRONTEND_URL=your_frontend_url
```

The actual `.env` file should never be committed to GitHub.

---

### Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:3000
```

For the deployed frontend:

```env
VITE_API_URL=https://mini-job-queue-api.onrender.com
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Deepesh-Gaharwar/Mini-Job-Queue-Dashboard.git
cd Mini-Job-Queue-Dashboard
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create:

```text
.env
```

and configure the PostgreSQL connection.

Then run:

```bash
npm run start:dev
```

The backend runs on:

```text
http://localhost:3000
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
.env
```

with:

```env
VITE_API_URL=http://localhost:3000
```

Then run:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## Production Build

### Backend

```bash
cd backend
npm run build
```

Production start command:

```bash
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
```

The production frontend is generated inside:

```text
frontend/dist
```

---

## Deployment

### Backend

I deployed the NestJS backend using Render.

The backend connects to the PostgreSQL database hosted on Supabase.

Production architecture:

```text
Render
  ↓
NestJS API
  ↓
Supabase PostgreSQL
```

### Frontend

I deployed the React + Vite frontend using Vercel.

The frontend communicates with the deployed Render API:

```text
Vercel
  ↓
React + Vite
  ↓
Render API
  ↓
Supabase PostgreSQL
```

---

## Testing

I tested the API using Postman.

The main scenarios I tested include:

- Creating jobs
- Getting jobs
- Pagination
- Status filtering
- Getting status counts
- `pending → running`
- `running → completed`
- `pending → failed`
- `running → failed`
- Rejecting invalid transitions
- Invalid UUID handling
- Non-existent job handling
- Deleting jobs
- Repeated deletion
- Concurrent status-update requests

I also verified the frontend production build and tested the deployed frontend against the deployed backend.

---

## Future Improvements

If I had more time, I would consider:

- Authentication and authorization
- Background workers for actual job execution
- Redis/BullMQ for queue processing
- WebSocket-based real-time status updates
- Database migrations instead of relying on development schema synchronization
- More detailed job execution information such as retry count, started time, completed time, and error messages
- More advanced pagination controls and search

I intentionally kept these outside the current scope because the assignment focuses on the fundamentals of React, NestJS, API/database design, validation, error handling, and concurrency reasoning.

---

