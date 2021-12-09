import Dexie from "dexie";

const db = new Dexie("colmenaDatabase");
db.version(1).stores({
  files: `++id, title, arrayBufferBlob, tags, type, size, userId, path, filename, basename, aliasFilename, environment, nextcloudId, createdAt, updatedAt`,
});

export default db;
