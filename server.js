const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const { pool } = require('./src/db');
const { haversineDistanceMeters } = require('./src/distance');

const app = express();
app.use(express.json());

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseFiniteNumber(value) {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

function validateLatitude(latitude) {
  if (!Number.isFinite(latitude)) return false;
  return latitude >= -90 && latitude <= 90;
}

function validateLongitude(longitude) {
  if (!Number.isFinite(longitude)) return false;
  return longitude >= -180 && longitude <= 180;
}

app.post('/addSchool', async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body ?? {};

    if (!isNonEmptyString(name)) {
      return res.status(400).json({ error: 'Invalid name' });
    }
    if (!isNonEmptyString(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    const lat = parseFiniteNumber(latitude);
    const lon = parseFiniteNumber(longitude);

    if (lat === null || !validateLatitude(lat)) {
      return res.status(400).json({ error: 'Invalid latitude' });
    }
    if (lon === null || !validateLongitude(lon)) {
      return res.status(400).json({ error: 'Invalid longitude' });
    }

    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name.trim(), address.trim(), lat, lon]
    );

    return res.status(201).json({
      id: result.insertId,
      name: name.trim(),
      address: address.trim(),
      latitude: lat,
      longitude: lon
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/listSchools', async (req, res) => {
  try {
    const lat = parseFiniteNumber(req.query.latitude);
    const lon = parseFiniteNumber(req.query.longitude);

    if (lat === null || !validateLatitude(lat)) {
      return res.status(400).json({ error: 'Invalid latitude' });
    }
    if (lon === null || !validateLongitude(lon)) {
      return res.status(400).json({ error: 'Invalid longitude' });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, address, latitude, longitude FROM schools'
    );

    const schoolsSorted = rows
      .map((school) => {
        const distanceMeters = haversineDistanceMeters(
          lat,
          lon,
          Number(school.latitude),
          Number(school.longitude)
        );
        return { ...school, distanceMeters };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    return res.json({
      userLocation: { latitude: lat, longitude: lon },
      schools: schoolsSorted
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
