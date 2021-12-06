import db from "@/store/idb/index";

export function createAudio(file) {
  return db.audios.add(file);
}

export function getLastAudioRecordedByUser(userId) {
  return db.audios.where({ userId }).reverse().sortBy("createdAt");
}

export function getAllAudios(userId) {
  return db.audios.where({ userId }).sortBy("createdAt");
}

export function remove(id, userId) {
  return db.audios.where({ id, userId }).delete();
}

export function update(id, data) {
  return db.audios.update(id, data);
}
