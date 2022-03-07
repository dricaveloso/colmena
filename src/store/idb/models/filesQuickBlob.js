import db from "@/store/idb/index";

export function createFile(file) {
  return db.filesQuickBlob.add(file);
}

export function findByBasename(userId, basename) {
  return db.filesQuickBlob.where("[userId+basename]").equals([userId, basename]).first();
}

export function updateFile(id, data) {
  return db.files.update(id, data);
}

export function getFile(id) {
  return db.files.where({ id }).first();
}
