const usersRepository = require('../repositories/users.repository');
const AppError = require('../utils/app-error');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_UPDATE_FIELDS = ['displayName', 'bio', 'avatarUrl', 'location', 'isPublic'];

function validateProfileData(data, isUpdate = false) {
  if (!data || typeof data !== 'object' || Array.isArray(body = data)) {
    throw new AppError('Request body must be a JSON object', 400, 'VALIDATION_ERROR');
  }

  const sanitized = {};

  if (data.displayName !== undefined) {
    if (typeof data.displayName !== 'string' || data.displayName.length > 100) {
      throw new AppError('displayName must be a string up to 100 characters', 400, 'VALIDATION_ERROR');
    }
    sanitized.displayName = data.displayName.trim();
  }

  if (data.bio !== undefined) {
    if (data.bio !== null && typeof data.bio !== 'string') {
      throw new AppError('bio must be a string', 400, 'VALIDATION_ERROR');
    }
    sanitized.bio = data.bio ? data.bio.trim() : null;
  }

  if (data.avatarUrl !== undefined) {
    if (data.avatarUrl !== null && typeof data.avatarUrl !== 'string') {
      throw new AppError('avatarUrl must be a string URL', 400, 'VALIDATION_ERROR');
    }
    sanitized.avatarUrl = data.avatarUrl ? data.avatarUrl.trim() : null;
  }

  if (data.location !== undefined) {
    if (data.location !== null && typeof data.location !== 'string') {
      throw new AppError('location must be a string up to 150 characters', 400, 'VALIDATION_ERROR');
    }
    sanitized.location = data.location ? data.location.trim() : null;
  }

  if (data.isPublic !== undefined) {
    if (typeof data.isPublic !== 'boolean') {
      throw new AppError('isPublic must be a boolean', 400, 'VALIDATION_ERROR');
    }
    sanitized.isPublic = data.isPublic;
  }

  if (isUpdate && Object.keys(sanitized).length === 0) {
    throw new AppError('At least one updatable field is required', 400, 'VALIDATION_ERROR');
  }

  return sanitized;
}

async function getOrCreateProfile(authUserId) {
  if (!authUserId) {
    throw new AppError('Authenticated user identity required', 401, 'UNAUTHORIZED');
  }

  let profile = await usersRepository.findByAuthUserId(authUserId);
  if (!profile) {
    // Idempotent auto-initialization
    profile = await usersRepository.create({
      authUserId,
      displayName: null,
      bio: null,
      avatarUrl: null,
      location: null,
      isPublic: true
    });
  }

  return profile;
}

async function getProfileById(profileId, requestingUserId) {
  if (!profileId || !UUID_REGEX.test(profileId)) {
    throw new AppError('User profile not found', 404, 'NOT_FOUND');
  }

  const profile = await usersRepository.findById(profileId);
  if (!profile) {
    throw new AppError('User profile not found', 404, 'NOT_FOUND');
  }

  const isOwner = requestingUserId && profile.authUserId === requestingUserId;

  if (!isOwner && !profile.isPublic) {
    throw new AppError('User profile not found', 404, 'NOT_FOUND');
  }

  if (!isOwner) {
    // Filter sensitive fields for public view
    return {
      id: profile.id,
      authUserId: profile.authUserId,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      location: profile.location,
      createdAt: profile.createdAt
    };
  }

  return profile;
}

async function updateProfile(authUserId, data) {
  const profile = await getOrCreateProfile(authUserId);
  const validated = validateProfileData(data, true);

  return usersRepository.update(profile, validated);
}

async function listPublicProfiles(limit = 20, offset = 0, search = null) {
  return usersRepository.findPublicProfiles(limit, offset, search);
}

module.exports = {
  getOrCreateProfile,
  getProfileById,
  updateProfile,
  listPublicProfiles
};
