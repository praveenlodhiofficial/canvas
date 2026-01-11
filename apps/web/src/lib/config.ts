export const config = {
  backendUrl: process.env.HTTP_BACKEND_URL || "http://localhost:3001",
  websocketUrl: process.env.WEBSOCKET_BACKEND_URL || "ws://localhost:3002",
};

// function requireEnv(name: string): string {
//   const value = process.env[name];
//   if (!value) {
//     throw new Error(`Missing environment variable: ${name}`);
//   }
//   return value;
// }

// export const config = {
//   backendUrl: requireEnv("HTTP_BACKEND_URL"),
//   websocketUrl: requireEnv("WEBSOCKET_BACKEND_URL"),
// };
