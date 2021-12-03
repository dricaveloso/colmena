import Dexie from "dexie";

const db = new Dexie("colmenaDatabase");
db.version(1).stores({
  files: `++id, title, arrayBufferBlob, tags, audioType, userId, pathLocation, environment, nextcloudId, createdAt, updatedAt`,
});

export default db;
