import Dexie from "dexie";

const db = new Dexie("colmenaDb");
db.version(1).stores({
  audios: `++id, title, arrayBufferBlob, tags, audioType, userId, createdAt, updatedAt`,
});

export default db;
