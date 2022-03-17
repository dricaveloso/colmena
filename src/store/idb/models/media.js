import db from "@/store/idb/index";

export function create(file) {
  return db.medias.add(file);
}

export function update(id, data) {
  return db.medias.update(id, data);
}

export function remove(id) {
  return db.medias.where({ id }).delete();
}

export function findByName(name) {
  return db.medias.where("name").equals(name).first();
}
