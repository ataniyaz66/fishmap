const spotsRepository = require('../repositories/spots.repository');
const AppError = require('../utils/app-error');

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const spotFields = [
  'name',
  'description',
  'latitude',
  'longitude',
  'water_type',
  'region',
  'visibility'
];

function validateUuid(value, field) {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    throw new AppError(`${field} must be a valid UUID`, 400);
  }
}

function validateString(value, field, required, maxLength) {
  if (value === undefined || value === null) {
    if (required) {
      throw new AppError(`${field} is required`, 400);
    }
    return;
  }

  if (typeof value !== 'string' || (required && value.trim().length === 0)) {
    throw new AppError(`${field} must be a non-empty string`, 400);
  }

  if (value.length > maxLength) {
    throw new AppError(`${field} must be at most ${maxLength} characters`, 400);
  }
}

function validateCoordinate(value, field, min, max, required) {
  if (value === undefined || value === null) {
    if (required) {
      throw new AppError(`${field} is required`, 400);
    }
    return;
  }

  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    String(value).trim() === '' ||
    !Number.isFinite(Number(value)) ||
    Number(value) < min ||
    Number(value) > max
  ) {
    throw new AppError(`${field} must be a number between ${min} and ${max}`, 400);
  }
}

function validateVisibility(value) {
  if (value !== undefined && value !== null) {
    if (!['public', 'friends', 'private'].includes(value)) {
      throw new AppError('visibility must be public, friends, or private', 400);
    }
  }
}

function pickFields(body, allowedFields) {
  return Object.fromEntries(
    allowedFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]])
  );
}

function toModelValues(values) {
  const mapped = { ...values };
  if (Object.prototype.hasOwnProperty.call(mapped, 'water_type')) {
    mapped.waterType = mapped.water_type;
    delete mapped.water_type;
  }
  return mapped;
}

// Calculate distance in kilometers between two coordinates via Haversine formula
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function create(userId, body) {
  validateUuid(userId, 'userId');
  const values = pickFields(body, spotFields);

  validateString(values.name, 'name', true, 120);
  validateCoordinate(values.latitude, 'latitude', -90, 90, true);
  validateCoordinate(values.longitude, 'longitude', -180, 180, true);
  validateString(values.description, 'description', false, 10000);
  validateString(values.water_type, 'water_type', false, 120);
  validateString(values.region, 'region', false, 150);
  validateVisibility(values.visibility);

  return spotsRepository.create({
    ...toModelValues(values),
    userId,
    visibility: values.visibility || 'public'
  });
}

async function list(queryParams = {}, requestingUserId = null) {
  const {
    min_lat,
    max_lat,
    min_lng,
    max_lng,
    lat,
    lng,
    latitude,
    longitude,
    radius,
    radius_km,
    water_type,
    search,
    user_id,
    limit = 50,
    offset = 0
  } = queryParams;

  const effectiveLat = lat !== undefined ? lat : latitude;
  const effectiveLng = lng !== undefined ? lng : longitude;
  const effectiveRadius = radius_km !== undefined ? radius_km : radius;

  let queryMinLat = min_lat;
  let queryMaxLat = max_lat;
  let queryMinLng = min_lng;
  let queryMaxLng = max_lng;

  // Approximate candidate bounding box for radius query
  if (effectiveLat !== undefined && effectiveLng !== undefined && effectiveRadius !== undefined) {
    const centerLat = Number(effectiveLat);
    const centerLng = Number(effectiveLng);
    const rad = Number(effectiveRadius);

    if (Number.isFinite(centerLat) && Number.isFinite(centerLng) && Number.isFinite(rad)) {
      const latDelta = rad / 111.0;
      const lngDelta = rad / (111.0 * Math.cos(centerLat * (Math.PI / 180)));
      queryMinLat = centerLat - latDelta;
      queryMaxLat = centerLat + latDelta;
      queryMinLng = centerLng - lngDelta;
      queryMaxLng = centerLng + lngDelta;
    }
  }

  const result = await spotsRepository.findSpots({
    minLat: queryMinLat,
    maxLat: queryMaxLat,
    minLng: queryMinLng,
    maxLng: queryMaxLng,
    waterType: water_type,
    search,
    userId: user_id,
    requestingUserId,
    limit: Number(limit) || 50,
    offset: Number(offset) || 0
  });

  // If radius query specified, calculate precise distance and filter
  if (effectiveLat !== undefined && effectiveLng !== undefined && effectiveRadius !== undefined) {
    const centerLat = Number(effectiveLat);
    const centerLng = Number(effectiveLng);
    const maxRadius = Number(effectiveRadius);

    const spotsWithDistance = result.rows
      .map((spot) => {
        const spotLat = Number(spot.latitude);
        const spotLng = Number(spot.longitude);
        const distanceKm = calculateDistanceKm(centerLat, centerLng, spotLat, spotLng);
        return {
          ...spot.toJSON ? spot.toJSON() : spot,
          distance_km: Math.round(distanceKm * 100) / 100
        };
      })
      .filter((s) => s.distance_km <= maxRadius)
      .sort((a, b) => a.distance_km - b.distance_km);

    return {
      data: spotsWithDistance,
      total: spotsWithDistance.length
    };
  }

  return {
    data: result.rows,
    total: result.count
  };
}

async function getById(id, requestingUserId = null) {
  validateUuid(id, 'id');
  const spot = await spotsRepository.findById(id);
  if (!spot) {
    throw new AppError('Fishing spot not found', 404);
  }

  // Enforce visibility
  if (spot.visibility === 'private' && (!requestingUserId || spot.userId !== requestingUserId)) {
    throw new AppError('Fishing spot not found', 404);
  }

  return spot;
}

async function update(id, userId, body) {
  const spot = await getById(id, userId);

  // Ownership enforcement
  if (spot.userId !== userId) {
    throw new AppError('You are not authorized to modify this fishing spot', 403, 'FORBIDDEN');
  }

  const values = pickFields(body, spotFields);
  if (Object.keys(values).length === 0) {
    throw new AppError('At least one updatable field is required', 400);
  }

  if (values.name !== undefined) validateString(values.name, 'name', true, 120);
  if (values.latitude !== undefined) validateCoordinate(values.latitude, 'latitude', -90, 90, true);
  if (values.longitude !== undefined) validateCoordinate(values.longitude, 'longitude', -180, 180, true);
  if (values.description !== undefined) validateString(values.description, 'description', false, 10000);
  if (values.water_type !== undefined) validateString(values.water_type, 'water_type', false, 120);
  if (values.region !== undefined) validateString(values.region, 'region', false, 150);
  validateVisibility(values.visibility);

  return spotsRepository.update(spot, toModelValues(values));
}

async function remove(id, userId) {
  const spot = await getById(id, userId);

  if (spot.userId !== userId) {
    throw new AppError('You are not authorized to delete this fishing spot', 403, 'FORBIDDEN');
  }

  await spotsRepository.remove(spot);
}

async function toggleFavorite(userId, spotId, isFav) {
  validateUuid(userId, 'userId');
  validateUuid(spotId, 'spotId');
  await getById(spotId, userId);

  if (isFav) {
    await spotsRepository.addFavorite(userId, spotId);
    return { favorited: true };
  } else {
    await spotsRepository.removeFavorite(userId, spotId);
    return { favorited: false };
  }
}

async function listFavorites(userId, limit, offset) {
  validateUuid(userId, 'userId');
  const favs = await spotsRepository.findUserFavorites(userId, limit, offset);
  return favs.map((f) => f.spot).filter(Boolean);
}

async function reportSpot(userId, spotId, body) {
  validateUuid(userId, 'userId');
  validateUuid(spotId, 'spotId');
  await getById(spotId, userId);

  if (!body || !body.reason || typeof body.reason !== 'string') {
    throw new AppError('reason is required to submit a report', 400, 'VALIDATION_ERROR');
  }

  return spotsRepository.createReport({
    userId,
    spotId,
    reason: body.reason.trim(),
    details: body.details ? String(body.details).trim() : null
  });
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  toggleFavorite,
  listFavorites,
  reportSpot
};
