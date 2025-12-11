export type AuthPayload = {
  id: string;
  email: string;
};

export type AuthenticatedRequest = Request & {
  user: AuthPayload;
};
