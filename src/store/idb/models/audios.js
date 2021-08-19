import db from "@/store/idb/index";

export function createAudio(file) {
  return db.audios.add(file);
}

export function getLastAudioRecordedByUser(userId) {
  return db.audios.where({ userId }).reverse().sortBy("createdAt");
}
