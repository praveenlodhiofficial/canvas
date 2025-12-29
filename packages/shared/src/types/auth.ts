export type AuthPayload = {
  id: string;
  email: string;
};

export type AuthenticatedRequest = Request & {
  user: AuthPayload;
};

export type WebSocketData = {
  user: AuthPayload;
  room: string;
};
