# Todo Web Application

A full-stack Todo application with a Laravel API backend and a Next.js frontend. Users can register, log in, and manage their own list of todos (create, read, update, delete, and toggle completion).

## Tech Stack

**Backend**
- Laravel 12 (PHP 8.2+)
- Laravel Sanctum (token-based API authentication)
- PostgreSQL

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Axios

## Project Structure

```
Todo-Web-Application/
├── backend/     # Laravel API (auth, todos)
└── frontend/    # Next.js UI (login, register, dashboard)
```

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ and npm

## Getting Started

### Backend (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The API will be available at `http://localhost:8000`.

This project uses PostgreSQL. Update `.env` with your database credentials before running migrations:

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=todo_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Make sure the `todo_db` database exists in PostgreSQL before running `php artisan migrate`.

### Frontend (Next.js)

```bash
cd frontend
npm install
```

Create a `.env.local` file (or confirm the existing one) with the API URL:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Then start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Authentication

Authentication uses Laravel Sanctum's token-based (bearer token) flow:

1. On register/login, the backend returns a `token`.
2. The frontend stores this token in `localStorage`.
3. Subsequent API requests attach it as `Authorization: Bearer <token>` (see `frontend/services/api.ts`).

## API Endpoints

Base URL: `http://localhost:8000/api`

| Method | Endpoint         | Description                     | Auth required |
|--------|------------------|----------------------------------|----------------|
| POST   | `/register`      | Register a new user             | No             |
| POST   | `/login`         | Log in and receive a token      | No             |
| POST   | `/logout`        | Revoke the current token        | Yes            |
| GET    | `/user`          | Get the authenticated user      | Yes            |
| GET    | `/todos`         | List the current user's todos   | Yes            |
| POST   | `/todos`         | Create a todo                   | Yes            |
| GET    | `/todos/{id}`    | Get a single todo               | Yes            |
| PUT    | `/todos/{id}`    | Update a todo                   | Yes            |
| PATCH  | `/todos/{todo}`  | Toggle a todo's completed state | Yes            |
| DELETE | `/todos/{id}`    | Delete a todo                   | Yes            |

Each user can only view, update, or delete their own todos.

### Todo fields

| Field         | Type    | Notes                          |
|---------------|---------|---------------------------------|
| `title`       | string  | Required, max 255 characters   |
| `description` | string  | Optional                       |
| `completed`   | boolean | Defaults to `false`            |

## Frontend Pages

| Route         | Description                  |
|---------------|-------------------------------|
| `/`           | Landing page                  |
| `/register`   | User registration             |
| `/login`      | User login                    |
| `/dashboard`  | Authenticated todo dashboard  |

## Running Tests

```bash
cd backend
php artisan test
```

## Linting

```bash
cd frontend
npm run lint
```
