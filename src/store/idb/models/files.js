import db from "@/store/idb/index";
import { removeCornerSlash } from "@/utils/utils";

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

export function getFile(id) {
  return db.files.where({ id }).first();
}

export function getFilesByPath(userId, path) {
  return db.files.where({ userId, path: removeCornerSlash(path) }).sortBy("createdAt");
}

export function findByFilename(filename) {
  return db.files.where({ filename }).first();
}

export function findByBasename(userId, basename) {
  return db.files.where({ userId, basename }).first();
}
