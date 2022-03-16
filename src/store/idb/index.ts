import Dexie from "dexie";

const db = new Dexie("colmenaDatabase");
db.version(18).stores({
  files: `++id, title, arrayBufferBlob, tags, type, size, userId, path, filename, basename, aliasFilename, environment, [userId+basename], [userId+path], nextcloudId, createdAt, updatedAt`,
  filesQuickBlob: "++id, [userId+basename], arrayBufferBlob",
  chatMessages:
    "++id, token, actorType, actorId, actorDisplayName, timestamp, message, messageParameters, systemMessage, messageType, isReplyable, referenceId",
  medias: "++id, name, image",
  transfers:
    "++id, filename, userId, tempFilename, file, currentChunk, progress, type, chatNotify, status, createdAt, updatedAt",
});

export default db;
