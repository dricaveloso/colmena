import Dexie from "dexie";

const db = new Dexie("colmenaDatabase");
db.version(1).stores({
  files: `++id, title, arrayBufferBlob, tags, audioType, userId, createdAt, updatedAt`,
});

export default db;
