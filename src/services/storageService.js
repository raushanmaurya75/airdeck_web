
const ROOMS_STORAGE_KEY = 'airdeck_saved_rooms_v1';
const DISPLAYS_STORAGE_KEY = 'airdeck_paired_displays_v1';

export function generatePairingCode() {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ADK-${code}`;
}

export function generateRoomCode() {
  const prefixes = ['AIR', 'CAST', 'DECK', 'SYNC', 'STREAM'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${digits}`;
}

export function getDisplays() {
  try {
    const raw = localStorage.getItem(DISPLAYS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('[StorageService] Error loading displays:', error);
    return [];
  }
}

export function getDisplayById(id) {
  if (!id) return null;
  const displays = getDisplays();
  return displays.find((d) => d.id === id) || null;
}

export function saveDisplay(displayData) {
  try {
    const displays = getDisplays();
    const existingIndex = displays.findIndex((d) => d.id === displayData.id);

    const displayToSave = {
      id: displayData.id || `disp-${Date.now().toString(36)}`,
      name: displayData.name?.trim() || 'Commercial Display',
      location: displayData.location?.trim() || 'Default Zone',
      pairingCode: displayData.pairingCode?.trim().toUpperCase() || generatePairingCode(),
      status: displayData.status || 'online',
      activeMedia: displayData.activeMedia || {
        title: 'Architectural Showreel 4K (Continuous Loop)',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'direct',
      },
      schedule: displayData.schedule || '24/7 Continuous Loop',
      overlayText:
        displayData.overlayText ||
        'AIRDECK BROADCAST NODE • DIRECT HARDWARE ACCELERATION',
      pairedAt: displayData.pairedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      socStorage: displayData.socStorage || '12.4 GB / 32 GB Flash (38%)',
      uptime: displayData.uptime || '14d 08h 22m',
      resolution: displayData.resolution || '3840 x 2160 (4K UHD)',
    };

    if (existingIndex >= 0) {
      displays[existingIndex] = { ...displays[existingIndex], ...displayToSave };
    } else {
      displays.unshift(displayToSave);
    }

    localStorage.setItem(DISPLAYS_STORAGE_KEY, JSON.stringify(displays));
    return displayToSave;
  } catch (error) {
    console.error('[StorageService] Error saving display:', error);
    throw error;
  }
}

export function updateDisplay(id, updates) {
  try {
    const displays = getDisplays();
    const index = displays.findIndex((d) => d.id === id);
    if (index === -1) return null;

    displays[index] = {
      ...displays[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(DISPLAYS_STORAGE_KEY, JSON.stringify(displays));
    return displays[index];
  } catch (error) {
    console.error('[StorageService] Error updating display:', error);
    return null;
  }
}

export function deleteDisplay(id) {
  try {
    const displays = getDisplays();
    const filtered = displays.filter((d) => d.id !== id);
    localStorage.setItem(DISPLAYS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('[StorageService] Error deleting display:', error);
    return false;
  }
}

export function getRooms() {
  try {
    const raw = localStorage.getItem(ROOMS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('[StorageService] Error loading rooms:', error);
    return [];
  }
}

export function getRoomByCode(code) {
  if (!code) return null;
  const rooms = getRooms();
  const normalized = code.trim().toUpperCase();
  return rooms.find((r) => r.code.toUpperCase() === normalized) || null;
}

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
      contentType: roomData.contentType || 'video',
    };

    if (existingIndex >= 0) {
      rooms[existingIndex] = { ...rooms[existingIndex], ...roomToSave };
    } else {
      rooms.unshift(roomToSave);
    }

    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
    return roomToSave;
  } catch (error) {
    console.error('[StorageService] Error saving room:', error);
    throw error;
  }
}

export function deleteRoom(code) {
  try {
    const rooms = getRooms();
    const filtered = rooms.filter(
      (r) => r.code.toUpperCase() !== code.trim().toUpperCase()
    );
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('[StorageService] Error deleting room:', error);
    return false;
  }
}

export function updateRoom(code, updates) {
  try {
    const rooms = getRooms();
    const roomIndex = rooms.findIndex(
      (r) => r.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (roomIndex === -1) return null;

    rooms[roomIndex] = {
      ...rooms[roomIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
    return rooms[roomIndex];
  } catch (error) {
    console.error('[StorageService] Error updating room:', error);
    return null;
  }
}

export function updateRoomVideo(code, videoData) {
  try {
    const rooms = getRooms();
    const roomIndex = rooms.findIndex(
      (r) => r.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (roomIndex === -1) return null;

    rooms[roomIndex].video = videoData;
    rooms[roomIndex].updatedAt = new Date().toISOString();

    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
    return rooms[roomIndex];
  } catch (error) {
    console.error('[StorageService] Error updating room video:', error);
    return null;
  }
}
