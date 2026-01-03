export const config = {
  backendUrl:
    process.env.NEXT_PUBLIC_HTTP_BACKEND_URL || "http://localhost:3001",
  websocketUrl:
    process.env.NEXT_PUBLIC_WEBSOCKET_BACKEND_URL || "ws://localhost:3002",
};

// function requireEnv(name: string): string {
//   const value = process.env[name];
//   if (!value) {
//     throw new Error(`Missing environment variable: ${name}`);
//   }
//   return value;
// }

// export const config = {
//   backendUrl: requireEnv("NEXT_PUBLIC_HTTP_BACKEND_URL"),
//   websocketUrl: requireEnv("NEXT_PUBLIC_WEBSOCKET_BACKEND_URL"),
// };
