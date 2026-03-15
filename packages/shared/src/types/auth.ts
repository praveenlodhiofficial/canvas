export type AuthPayload = {
  id: string;
  email: string;
  /** Display name (set by WS auth when available). */
  name?: string;
};

export type AuthenticatedRequest = Request & {
  user: AuthPayload;
};

export type WebSocketData = {
  user: AuthPayload;
  room: string;
};
