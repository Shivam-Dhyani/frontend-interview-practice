import { openDB } from "idb";

export const dbPromise = openDB("ble-chat", 1, {
  upgrade(db) {
    db.createObjectStore("messages", { keyPath: "id" });
  },
});

export async function saveMessage(msg) {
  const db = await dbPromise;
  await db.put("messages", msg);
}

export async function getMessages() {
  const db = await dbPromise;
  return db.getAll("messages");
}
