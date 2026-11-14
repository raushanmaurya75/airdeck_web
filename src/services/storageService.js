// ============================================================================
// AirDeck - LocalStorage Storage Service
// ============================================================================
// NOTE: This service acts as our storage abstraction layer. Currently it reads
// and writes to browser localStorage. In the future, this can be seamlessly
// swapped with API client calls (REST, GraphQL, or Firebase/Supabase).
//
// TODO: replace with real backend API calls (e.g., fetch('/api/rooms'))
// ============================================================================

const STORAGE_KEY = 'airdeck_saved_rooms_v1';

/**
 * Generate a random 6-8 character uppercase room code.
 * Example formats: "AIR-4921", "CAST-827", "DECK-394"
 */
export function generateRoomCode() {
  const prefixes = ['AIR', 'CAST', 'DECK', 'SYNC', 'STREAM'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const digits = Math.floor(1000 + Math.random() * 9000); // 4 digit number
  return `${prefix}-${digits}`;
}

/**
 * Sample starter room for new users to immediately test the app.
 */
const DEFAULT_SAMPLE_ROOMS = [
  {
    code: 'AIR-4096',
    name: 'Main Conference Studio',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    video: {
      type: 'url',
      url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', // Big Buck Bunny 4K
      title: 'Big Buck Bunny (Official 4K 60fps)',
      thumbnail: 'https://img.youtube.com/vi/aqz-KE-bpKQ/maxresdefault.jpg',
      addedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
    // Future expansion placeholder:
    // TODO: support slides, documents, screen stream
    contentType: 'video',
  },
  {
    code: 'SYNC-7721',
    name: 'Living Room Theater',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    video: null,
    contentType: 'video',
  },
];

/**
 * Retrieve all saved rooms from localStorage.
 * @returns {Array} List of room objects
 */
export function getRooms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with sample room on first load for great out-of-the-box demo experience
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_ROOMS));
      return DEFAULT_SAMPLE_ROOMS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('[StorageService] Error loading rooms from localStorage:', error);
    return [];
  }
}

/**
 * Find a single room by its unique room code.
 * @param {string} code 
 * @returns {Object|null}
 */
export function getRoomByCode(code) {
  if (!code) return null;
  const rooms = getRooms();
  const normalizedCode = code.trim().toUpperCase();
  return rooms.find((r) => r.code.toUpperCase() === normalizedCode) || null;
}

/**
 * Save or update a room in localStorage.
 * @param {Object} roomData { code, name, video, createdAt, ... }
 * @returns {Object} Saved room object
 */
export function saveRoom(roomData) {
  try {
    const rooms = getRooms();
    const existingIndex = rooms.findIndex(
      (r) => r.code.toUpperCase() === roomData.code.trim().toUpperCase()
    );

    const roomToSave = {
      ...roomData,
      code: roomData.code.trim().toUpperCase(),
      createdAt: roomData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentType: roomData.contentType || 'video', // Extensible for PPT/Slides
    };

    if (existingIndex >= 0) {
      rooms[existingIndex] = { ...rooms[existingIndex], ...roomToSave };
    } else {
      rooms.unshift(roomToSave); // place newest first
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    return roomToSave;
  } catch (error) {
    console.error('[StorageService] Error saving room:', error);
    throw error;
  }
}

/**
 * Delete a room by code.
 * @param {string} code 
 * @returns {boolean} Success status
 */
export function deleteRoom(code) {
  try {
    const rooms = getRooms();
    const filtered = rooms.filter(
      (r) => r.code.toUpperCase() !== code.trim().toUpperCase()
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('[StorageService] Error deleting room:', error);
    return false;
  }
}

/**
 * Update just the video payload of a room.
 * @param {string} code 
 * @param {Object|null} videoData 
 * @returns {Object|null} Updated room
 */
export function updateRoomVideo(code, videoData) {
  try {
    const rooms = getRooms();
    const roomIndex = rooms.findIndex(
      (r) => r.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (roomIndex === -1) return null;

    rooms[roomIndex].video = videoData;
    rooms[roomIndex].updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    return rooms[roomIndex];
  } catch (error) {
    console.error('[StorageService] Error updating room video:', error);
    return null;
  }
}

/**
 * Helper to wipe all saved rooms (for testing empty states).
 */
export function clearAllRooms() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
}
