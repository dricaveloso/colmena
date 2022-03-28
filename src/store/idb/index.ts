import Dexie from "dexie";

const db = new Dexie("colmenaDatabase");
db.version(19).stores({
  files: `++id, title, arrayBufferBlob, tags, type, size, userId, path, filename, basename, aliasFilename, environment, [userId+basename], [userId+path], nextcloudId, createdAt, updatedAt`,
  filesQuickBlob: "++id, [userId+basename], arrayBufferBlob",
  chatMessages:
    "++id, token, actorType, actorId, actorDisplayName, timestamp, message, messageParameters, systemMessage, messageType, isReplyable, referenceId, nextcloudId",
  medias: "++id, name, image",
  honeycombs: "++id, token, name, image, updatedAt",
  transfers:
    "++id, filename, userId, tempFilename, file, currentChunk, progress, type, chatNotify, status, createdAt, updatedAt",
});

export default db;
