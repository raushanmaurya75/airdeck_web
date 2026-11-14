# AirDeck • Multi-Device Screen & Video Casting UI

AirDeck is a modern, responsive web application for multi-device synchronized screen and video casting. Users can create persistent rooms, share generated access codes, stage video content (YouTube, direct MP4, or local uploads), and cast in real-time to all or selected connected endpoints (Smart TVs, laptops, tablets, and phones).

> **Phase 1 Architecture**: This phase delivers the complete frontend UI, user interactions, local state persistence, and mock data layer. Real-time protocols (WebSockets, WebRTC, and device discovery) are cleanly decoupled and ready to be plugged in.

---

## 🚀 Features

### 1. Main Dashboard (`/`)
- **App Navigation & Brand Bar**: Modern glassmorphic header with AirDeck logo, room creation trigger, and Light/Dark mode toggle.
- **Hero Presentation**: Quick summary of features and direct call-to-action buttons.
- **Saved Rooms Grid**: Displays all persisted rooms retrieved from `localStorage`:
  - Room name and generated room code.
  - Formatted creation date.
  - Video status preview (indicates whether media is currently attached).
  - Quick copy button for the room code.
  - Direct **"Open Room"** navigation button.
  - Room deletion option with confirmation.
- **Search & Filter**: Real-time filtering across room names and codes.
- **Empty State**: Friendly illustration and call-to-action when no rooms exist.

### 2. Create Room Flow
- **Room Setup Modal**: Clean modal prompt for entering a friendly room name.
- **Auto-Generated Room Codes**: Automatically creates 6–8 character uppercase codes (e.g., `AIR-8392`, `CAST-4912`).
- **One-Click Copy & Regenerate**: Easily copy the generated code to clipboard or roll a new code before saving.
- **Instant Persistence**: Saves room metadata (name, code, creation timestamp, media) to `localStorage`.
- **Automatic Redirection**: Navigates immediately to the newly created room (`/room/:code`).

### 3. Active Room Page (`/room/:code`)
- **Room Header**: Displays room name, active session badge, quick-copy room code badge, and back-to-dashboard navigation.
- **Connected Devices Panel**:
  - Displays mock connected devices (10 endpoints: 4K TVs, MacBooks, Workstations, iPhones, Pixels, iPads).
  - Device type icons (TV, Laptop, Tablet, Smartphone).
  - Live connection status indicators (`Online` with green indicator, `Offline`).
  - Filter tabs: View **All** or **Online Only**.
- **Media Player Stage**:
  - **YouTube Support**: Paste any YouTube link (`watch?v=`, `youtu.be/`, `embed/`, or `shorts/`) to render an embedded player.
  - **Direct Video URL**: HTML5 video preview for `.mp4`, `.webm`, or direct media streams.
  - **Local File Upload**: Load local video files directly from disk (`URL.createObjectURL`) for instant preview.
  - **Demo Presets**: One-click demo videos (Big Buck Bunny 4K, Cosmos Laundromat, etc.) for instant testing without hunting for URLs.
  - **Future Media Tabs**: Built-in tab placeholders for Slides / PPT presentations (ready for Phase 2).
  - **Persistent Video**: Automatically saves video attachments to the room in `localStorage`.
- **Granular Cast Controls**:
  - **"Cast on All Devices"**: 1-click broadcast to all currently online devices.
  - **"Cast on Specific Devices"**: Opens a device selection modal with checkboxes, device specs, Select All / Deselect All controls, and a confirm button.
- **Live Casting Status Banner**:
  - Appears dynamically when casting is active.
  - Displays the active count (e.g. *"Casting on 6 devices"*).
  - Live pulsing broadcast indicator and targeted device pills.
  - Prominent **"Stop Casting"** button to return UI to normal state.
- **Visual Streaming Highlights**:
  - Connected devices actively receiving the stream glow with an animated indigo border, pulsing icon, and `"CASTING"` badge.

### 4. UI/UX Polish
- **Dark Theme First** with violet/cyan neon accents and a Light Mode toggle.
- **Responsive Layout**: Designed for mobile phones, tablets, and wide desktop displays.
- **Toast Notifications**: Feedback for room creation, code copying, video attachment, and casting status changes.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser `localStorage` (via modular `storageService.js`)

---

## 📁 Project Structure

```
AirDeck/
├── index.html                   # HTML entry point with favicon & meta tags
├── vite.config.js               # Vite configuration with Tailwind CSS plugin
├── package.json                 # Project dependencies & scripts
├── src/
│   ├── main.jsx                 # React root bootstrap
│   ├── App.jsx                  # Main router & layout providers
│   ├── index.css                # Tailwind CSS v4 styling & theme rules
│   ├── context/
│   │   ├── ThemeContext.jsx     # Dark / Light theme state & toggle
│   │   └── ToastContext.jsx     # Toast notification system
│   ├── services/
│   │   └── storageService.js    # LocalStorage abstraction layer
│   ├── mock/
│   │   └── devices.js           # Mock connected client devices (TVs, laptops, phones)
│   ├── components/
│   │   ├── Navbar.jsx           # App navigation header
│   │   ├── CreateRoomModal.jsx  # Room creation & code generator modal
│   │   ├── DeviceCard.jsx       # Device status card & casting highlight
│   │   ├── CastModal.jsx        # Specific device selection modal
│   │   ├── VideoPlayer.jsx      # Video player stage (YouTube, direct MP4, local upload)
│   │   ├── CastingBanner.jsx    # Live casting status banner
│   │   ├── RoomCard.jsx         # Saved room card for dashboard
│   │   └── Footer.jsx           # Footer component
│   └── pages/
│       ├── Dashboard.jsx        # Main dashboard page (/)
│       └── ActiveRoom.jsx       # Room detail & casting console (/room/:code)
```

---

## 🔌 Architecture & Backend Integration Points

All logic intended for a future backend is cleanly encapsulated and annotated with `// TODO: replace with real backend/socket logic`:

1. **Storage Layer (`src/services/storageService.js`)**:
   - `getRooms()` → Replace with `GET /api/rooms`
   - `getRoomByCode(code)` → Replace with `GET /api/rooms/:code`
   - `saveRoom(room)` → Replace with `POST /api/rooms`
   - `deleteRoom(code)` → Replace with `DELETE /api/rooms/:code`
   - `updateRoomVideo(code, video)` → Replace with `PATCH /api/rooms/:code/video`

2. **Device Discovery & Real-Time Sync (`src/mock/devices.js` & `src/pages/ActiveRoom.jsx`)**:
   - Replace static mock devices with WebSocket / WebRTC signaling (e.g. `socket.on('device:connected')`, `socket.on('device:disconnected')`).
   - Replace simulated cast trigger with WebRTC media broadcast: `socket.emit('cast:start', { roomCode, targetDeviceIds, streamUrl })`.

3. **Content Extensibility**:
   - `VideoPlayer.jsx` includes structure for future formats (such as slides/PPT, PDFs, and screen sharing).

---

## 💻 Getting Started

### Prerequisites
- Node.js `18.0.0` or higher
- npm `9.0.0` or higher

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd AirDeck

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
Open your browser at [http://localhost:5173](http://localhost:5173).

### Building for Production
```bash
# Build optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 📄 License
MIT
