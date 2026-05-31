# it3030-paf-2026-smart-campus

## Smart Campus Operations Hub

A university campus operations management system built for the IT3030 PAF 2026 assignment.
This project combines a Spring Boot backend with a React + Vite frontend to support resource management, bookings, incident ticketing, notifications, and role-based campus services.

## Architecture

- **Backend:** Spring Boot, Spring Data JPA, Spring Security, JWT, OAuth2, MySQL, Cloudinary, email notifications.
- **Frontend:** React, Vite, React Router, Google OAuth, axios, JWT-based auth.
- **Roles:** ADMIN, ACADEMIC_STAFF, USER.

## Key Features

- User authentication via email/password and Google OAuth.
- Role-based access control for admin and protected user routes.
- Resource management with QR code lookup, status updates, and maintenance tracking.
- Booking and schedule management for campus facilities.
- Incident ticket creation with file upload, comments, assignment, and status flow.
- Notifications with unread counts and read/delete actions.
- Profile management and dashboard pages for students, staff, and admins.

## Folder Structure

- `backend/` - Spring Boot application and REST API.
- `frontend/` - React app powered by Vite.
- `frontend/src/api/` - HTTP client modules for backend services.
- `frontend/src/pages/` - UI pages and routes.
- `frontend/src/components/` - reusable React components.

## Prerequisites

- Java 17
- Maven (or use included Maven wrapper)
- Node.js 18+ and npm
- MySQL or compatible database

## Backend Setup

1. Open a terminal in `backend/`.
2. Copy `src/main/resources/application.properties` and update the database and email settings for your local environment.
3. Start the backend server:
   - Windows: `./mvnw.cmd spring-boot:run`
   - macOS/Linux: `./mvnw spring-boot:run`

The backend listens on `http://localhost:8080` by default.

### Recommended backend config values

- `spring.datasource.url` - local MySQL JDBC URL
- `spring.datasource.username` / `spring.datasource.password`
- `jwt.secret` - change to a secure value
- `app.frontend.url` - `http://localhost:5173`

> Do not commit real credentials. Keep secrets in local configuration files.

## Frontend Setup

1. Open a terminal in `frontend/`.
2. Install dependencies:
   - `npm install`
3. Create a `.env` file in `frontend/` with:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
4. Start the frontend app:
   - `npm run dev`

Open the app at `http://localhost:5173`.

## First Admin Setup

After registering or logging in for the first time, run this SQL on the database to promote your account to ADMIN:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## Development Commands

### Backend
- `./mvnw.cmd spring-boot:run` - run backend locally on Windows
- `./mvnw test` - execute backend tests

### Frontend
- `npm install` - install dependencies
- `npm run dev` - start the Vite dev server
- `npm run build` - build the production bundle
- `npm run lint` - run ESLint on the frontend source

## Notes

- The backend uses JWT tokens stored in local storage and attaches them to API requests.
- The frontend automatically redirects to `/login` when a token expires or returns a 401.
- Cloudinary is used for image uploads and may require additional setup for your own account.

