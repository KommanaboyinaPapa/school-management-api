const pool = require('../config/db');
const { haversineDistanceMeters } = require('../utils/distance');

/**
 * Small helpers for validation.
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseFiniteNumber(value) {
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function isValidLatitude(latitude) {
  return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
}

function isValidLongitude(longitude) {
  return Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

/**
 * POST /addSchool
 * Adds a school to DB after validating the input.
 */
async function addSchool(req, res) {
  try {
    const { name, address, latitude, longitude } = req.body ?? {};

    // Validate strings
    if (!isNonEmptyString(name)) {
      return res.status(400).json({ error: 'Invalid name' });
    }
    if (!isNonEmptyString(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    // Validate numbers
    const lat = parseFiniteNumber(latitude);
    const lon = parseFiniteNumber(longitude);

    if (lat === null || !isValidLatitude(lat)) {
      return res.status(400).json({ error: 'Invalid latitude' });
    }
    if (lon === null || !isValidLongitude(lon)) {
      return res.status(400).json({ error: 'Invalid longitude' });
    }

    // Insert into DB
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
  } catch (error) {
    // Most common failure: MySQL is not running / wrong credentials / table not created.
    return res.status(500).json({
      error: 'Database error',
      message: 'Unable to add school. Check DB connection and schema.'
    });
  }
}

/**
 * GET /listSchools?latitude=..&longitude=..
 * Fetches all schools and sorts by nearest distance from given user coordinates.
 */
async function listSchools(req, res) {
  try {
    const userLatitude = parseFiniteNumber(req.query.latitude);
    const userLongitude = parseFiniteNumber(req.query.longitude);

    if (userLatitude === null || !isValidLatitude(userLatitude)) {
      return res.status(400).json({ error: 'Invalid latitude' });
    }
    if (userLongitude === null || !isValidLongitude(userLongitude)) {
      return res.status(400).json({ error: 'Invalid longitude' });
    }

    const [schools] = await pool.execute(
      'SELECT id, name, address, latitude, longitude FROM schools'
    );

    const sortedSchools = schools
      .map((school) => {
        const distanceMeters = haversineDistanceMeters(
          userLatitude,
          userLongitude,
          Number(school.latitude),
          Number(school.longitude)
        );

        return { ...school, distanceMeters };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    return res.json({
      userLocation: { latitude: userLatitude, longitude: userLongitude },
      schools: sortedSchools
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Database error',
      message: 'Unable to list schools. Check DB connection and schema.'
    });
  }
}

module.exports = {
  addSchool,
  listSchools
};
