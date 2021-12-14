import Dexie from "dexie";

const db = new Dexie("colmenaDatabase");
db.version(5).stores({
  files: `++id, title, arrayBufferBlob, tags, type, size, userId, path, filename, basename, aliasFilename, environment, [userId+basename], [userId+path], nextcloudId, createdAt, updatedAt`,
  filesQuickBlob: "++id, [userId+basename], arrayBufferBlob",
});

export default db;
