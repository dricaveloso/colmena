import db from "@/store/idb/index";

export function getAllHoneycombs() {
  return db.table("honeycombs").toArray();
}

export function create(honeycomb) {
  return db.honeycombs.add(honeycomb);
}

export function update(id, data) {
  return db.honeycombs.update(id, data);
}

export async function createOrUpdate(token, data) {
  const honeycomb = await findByToken(token);
  if (honeycomb) {
    return update(honeycomb.id, { ...honeycomb, ...data });
  }

  return create({ ...data, token });
}

export function findByToken(token) {
  return db.honeycombs.where("token").equals(token).first();
}
