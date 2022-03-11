import db from "@/store/idb/index";

export function createFile(file) {
  return db.filesQuickBlob.add(file);
}

export function findByBasename(userId, basename) {
  return db.filesQuickBlob.where("[userId+basename]").equals([userId, basename]).first();
}

export function getFile(id) {
  return db.files.where({ id }).first();
}

export function removeFile(userId, basename) {
  return db.filesQuickBlob.where("[userId+basename]").equals([userId, basename]).delete();
}
