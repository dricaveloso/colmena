import db from "@/store/idb/index";

export function create(file) {
  return db.medias.add(file);
}

export function findByName(name) {
  return db.medias.where("name").equals(name).first();
}
