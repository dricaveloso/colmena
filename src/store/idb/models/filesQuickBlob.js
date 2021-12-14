import db from "@/store/idb/index";

export function createFile(file) {
  return db.filesQuickBlob.add(file);
}

export function findByBasename(userId, basename) {
  return db.filesQuickBlob.where({ userId, basename }).first();
}
