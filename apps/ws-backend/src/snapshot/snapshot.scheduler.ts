import { config } from "../lib/config";
import { memoryStore } from "../store/memory.store";
import { snapshotRoom } from "./snapshot.service";

setInterval(() => {
  for (const room of memoryStore.values()) {
    snapshotRoom(room);
  }
}, config.snapshotInterval);
