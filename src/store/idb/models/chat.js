import db from "@/store/idb/index";

export function addSingleMessage(file) {
  return db.chatMessages.add(file);
}

export function addSingleLocalMessage(file) {
  return db.chatLocalMessages.add(file);
}

export function getAllLocalMessages(token) {
  return db.chatLocalMessages.where("token").equals(token).toArray();
}

export function deleteAllLocalMessages(token) {
  return db.chatLocalMessages.where("token").equals(token).delete();
}

export function addAllMessages(file) {
  return db.chatMessages.bulkAdd(file);
}

export function deleteAllMessages(token) {
  return db.chatMessages.where("token").equals(token).delete();
}

export function getAllMessages(token) {
  return db.chatMessages.where("token").equals(token).toArray();
}

export function getMessageByRefIDAndToken(token, referenceId) {
  return db.chatMessages
    .where({ referenceId })
    .and((item) => item.token === token)
    .first();
}

export function getMessageByIDAndToken(token, id) {
  return db.chatMessages
    .where({ id })
    .and((item) => item.token === token)
    .first();
}

export function getMessagesByTokenAndBetweenIDs(token, beginID, endID) {
  return db.chatMessages
    .where("id")
    .between(beginID, endID, true, true)
    .and((item) => item.token === token)
    .toArray();
}
