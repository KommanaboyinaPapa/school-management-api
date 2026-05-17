# School Management APIs (Node.js + Express + MySQL)

## Setup

1. Create the MySQL table:

- Run `schema.sql` in your MySQL client.

2. Configure environment variables:

- Copy `.env.example` to `.env` and fill in DB creds.

3. Install dependencies:

- `npm install`

4. Start server:

- `npm start`

Server runs on `http://localhost:3000` by default.

## APIs

### POST `/addSchool`

Payload:

```json
{
  "name": "ABC Public School",
  "address": "MG Road, Pune",
  "latitude": 18.5204,
  "longitude": 73.8567
}
```

Responses:
- `201` created with inserted record
- `400` on validation errors

### GET `/listSchools`

Query params:
- `latitude`
- `longitude`

Example:

`/listSchools?latitude=18.5204&longitude=73.8567`

Response returns `schools` sorted by nearest first (includes `distanceMeters`).

## Hosting (suggested)

- Render / Railway / Fly.io can host the Node server.
- Use a managed MySQL (Railway MySQL, PlanetScale, AWS RDS, etc.).
- Set the environment variables from `.env.example` in the hosting dashboard.
