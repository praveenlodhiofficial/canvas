export function roomAccessWhere(roomId: string, userId: string) {
  return {
    id: roomId,
    OR: [
      { adminId: userId },
      {
        members: {
          some: {
            userId,
          },
        },
      },
    ],
  };
}
