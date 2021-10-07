import db from "@/store/idb/index";
import { RecordingInterface } from "@/interfaces/index";

export function createAudio(file: string) {
  return db.audios.add(file);
}

export function getLastAudioRecordedByUser(
  userId: number | string,
): Promise<Array<RecordingInterface>> {
  return db.audios.where({ userId }).reverse().sortBy("createdAt");
}

export function getAllAudios(userId: number | string): Promise<Array<RecordingInterface>> {
  return db.audios.where({ userId }).sortBy("createdAt");
}
