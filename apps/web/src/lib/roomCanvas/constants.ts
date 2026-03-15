/** Ms after last activity before user is marked idle. */
export const IDLE_AFTER_MS = 60_000;

/** Ms before a remote cursor is removed from the overlay. */
export const CURSOR_TTL_MS = 30_000;

/** Interval for presence idle updates and cursor GC. */
export const PRESENCE_GC_INTERVAL_MS = 10_000;

/** Target fps for broadcasting cursor position over WebSocket. */
export const CURSOR_BROADCAST_FPS = 20;

export const CURSOR_BROADCAST_MIN_INTERVAL_MS = 1000 / CURSOR_BROADCAST_FPS;
