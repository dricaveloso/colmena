/* eslint-disable no-param-reassign */
import db from "@/store/idb/index";

export function addSingleMessage(file) {
  return db.chatMessages.add(file);
}

export function updateMessage(chatId, message) {
  return db.chatMessages.update(chatId, { message });
}

export function addAllMessages(file) {
  const aux = file;
  aux.map((item) => {
    item.nextcloudId = item.id;
    delete item.id;
    return item;
  });
  return db.chatMessages.bulkAdd(aux);
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
