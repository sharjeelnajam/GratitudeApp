export {
  connectSocket,
  getSocket,
  joinRoom,
  leaveRoom,
  disconnectSocket,
  transitionSession,
  submitAlignmentShare,
  sendChatMessage,
} from './socketService';
export type {
  SessionState,
  RoomJoinedPayload,
  RoomEventHandlers,
  ChatMessagePayload,
} from './socketService';

export { fetchRooms, getRoomIdByType } from './roomApi';
export type { RoomListItem } from './roomApi';
