# Guided Alignment Room™ Backend

Express + Socket.IO + MongoDB. Firebase Admin for auth. Max 7 users per room.

## Setup

1. Copy `.env.example` to `.env`
2. Set `MONGODB_URI` (default: `mongodb://localhost:27017/guided-alignment-rooms`)
3. Add Firebase Admin credentials:
   - Option A: Download service account JSON from Firebase Console → Project Settings → Service accounts → Generate new private key
   - Save as `service-account.json` in backend root
   - Option B: Set `FIREBASE_SERVICE_ACCOUNT_BASE64` to base64-encoded JSON
4. Seed rooms: `npm run seed`
5. Start: `npm run dev`

## Endpoints

- `GET /health` – Health check
- `POST /auth/sync-user` – Sync Firebase user to MongoDB (Bearer token required)
- `GET /rooms` – List rooms (Bearer token required)

## Socket.IO

Connect with `auth: { token: firebaseIdToken }`.

**Events (client → server):**
- `room:join` – `{ roomId }`
- `room:leave`
- `room:chat` – `{ roomId, content }` (in-room chat; max 7 participants)
- `session:transition` – `{ roomId, nextState }`
- `alignment:share` – `{ roomId, cardId, reflectionText? }`

**Events (server → client):**
- `room:joined` – `{ roomId, roomName, participantCount, state }`
- `room:participant_count` – `{ roomId, count }`
- `room:participant_joined` / `room:participant_left`
- `room:chat_message` – `{ id, participantId, participantName, content, createdAt }`
- `session:state` – `{ roomId, state, currentSpeakerId?, speakerTurnEndsAt? }`
- `alignment:shared`
- `error` – `{ code, message }` (e.g. `ROOM_FULL` when 7 participants)
