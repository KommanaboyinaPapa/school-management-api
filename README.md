# School Management API

Beginner-friendly School Management backend built with Node.js, Express.js, and MySQL.

## Features

- Add a school to MySQL (`POST /addSchool`)
- List all schools sorted by nearest distance to a user location (`GET /listSchools`)
- Distance calculated using the Haversine Formula
- Clean MVC structure (routes → controllers → config/utils)

## Tech Stack

- Node.js
- Express.js
- MySQL2
- dotenv
- cors
- body-parser
- nodemon

## Folder Structure

```
school-management-api/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── schoolController.js
│
├── routes/
│   └── schoolRoutes.js
│
├── utils/
│   └── distance.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── schema.sql
```

## Database Setup (MySQL)

### 1) Create database + table

Run the SQL in `schema.sql`:

```sql
CREATE DATABASE IF NOT EXISTS schooldb;
USE schooldb;

CREATE TABLE IF NOT EXISTS schools (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  PRIMARY KEY (id)
);
```

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=schooldb
```

## Installation & Run

```bash
npm install
npm run dev
```

Server runs on:

- `http://localhost:5000`

Health check:

- `GET http://localhost:5000/health` (also returns DB connectivity status)

## API Documentation

### 1) Add School

**Endpoint:** `POST /addSchool`

**Body (JSON):**

```json
{
  "name": "ABC School",
  "address": "Hyderabad",
  "latitude": 17.385,
  "longitude": 78.4867
}
```

**Success Response (201):**

```json
{
  "id": 1,
  "name": "ABC School",
  "address": "Hyderabad",
  "latitude": 17.385,
  "longitude": 78.4867
}
```

**Validation Error (400):**

```json
{ "error": "Invalid latitude" }
```

### 2) List Schools (Sorted by Proximity)

**Endpoint:** `GET /listSchools?latitude=17.385&longitude=78.4867`

**Success Response (200):**

```json
{
  "userLocation": { "latitude": 17.385, "longitude": 78.4867 },
  "schools": [
    {
      "id": 1,
      "name": "ABC School",
      "address": "Hyderabad",
      "latitude": 17.385,
      "longitude": 78.4867,
      "distanceMeters": 0
    }
  ]
}
```

## Postman Testing

- Import `postman_collection.json` into Postman.
- Set the collection variable `baseUrl` to `http://localhost:5000`.

## GitHub Push Commands

```bash
git init
git add .
git commit -m "Initial commit"

git remote add origin YOUR_GITHUB_REPOSITORY_LINK
git branch -M main
git push -u origin main
```

## Deploy to Render (Web Service)

1. Create a new Render **Web Service** from your GitHub repo.
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Add environment variables from `.env.example` in Render dashboard.
5. Attach a managed MySQL DB (or use any external MySQL) and update env vars accordingly.

## Notes

- If MySQL is not running or credentials are wrong, `/addSchool` and `/listSchools` will return a DB error.
- `/health` will still work even without MySQL.
