import db from "@/store/idb/index";

export function create(file) {
  return db.transfers.add(file);
}

export function update(id, data) {
  return db.transfers.update(id, data);
}

export function get(id) {
  return db.transfers.where({ id }).first();
}

export function getByTempfilename(tempFilename) {
  return db.transfers.where({ tempFilename }).first();
}

export function remove(id) {
  return db.transfers.where({ id }).delete();
}

export function removeByTempfilename(tempFilename) {
  return db.transfers.where({ tempFilename }).delete();
}

export function removeAllCompletedFiles() {
  return db.transfers.where({ status: "complete" }).delete();
}
