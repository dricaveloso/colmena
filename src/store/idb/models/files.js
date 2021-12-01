import db from "@/store/idb/index";

export function createFile(file) {
  return db.files.add(file);
}

export function getLastAudioRecordedByUser(userId) {
  return db.files.where({ userId }).reverse().sortBy("createdAt");
}

export function getAllFiles(userId) {
  return db.files.where({ userId }).sortBy("createdAt");
}

export function remove(id, userId) {
  return db.files.where({ id, userId }).delete();
}

export function updateFile(id, data) {
  return db.files.update(id, data);
}
