import useTalkFetch from "@/hooks/useTalkFetch";
import {
  RoomListInterface,
  RoomInterface,
  RoomParticipantsInterface,
  ReadOnlyRoomInterface,
  CreateNewConversationInterface,
  AddParticipantConversationInterface,
  AllowedGuestsConversationInterface,
} from "@/interfaces/talk";
import talkInstance from "@/services/talk";

const responseFormat = "?format=json";

export function getUsersConversations(): RoomListInterface {
  return useTalkFetch("v3")(`/room${responseFormat}`);
}

export function getOpenConversations(): RoomListInterface {
  return useTalkFetch("v3")(`/listed-room${responseFormat}`);
}

export function getSingleConversation(token: string): RoomInterface {
  return useTalkFetch("v3")(`/room/${token + responseFormat}`);
}

export function getRoomParticipants(token: string): RoomParticipantsInterface {
  return useTalkFetch("v3")(`/room/${token}/participants${responseFormat}`);
}

export function setReadOnlyConversation(
  token: string,
  status: number,
): Promise<ReadOnlyRoomInterface> {
  return talkInstance("v3").put(`room/${token}/read-only${responseFormat}`, {
    status,
  });
}

export function postCreateConversation(
  roomType: number,
  roomName: string,
): Promise<CreateNewConversationInterface> {
  return talkInstance("v3").post(`/room${responseFormat}`);
}
export function postAllowedGuestsConversation(
  token: string,
  newParticipant: string,
  source: string,
): Promise<AllowedGuestsConversationInterface> {
  return talkInstance("v3").post(`/room/${token}/participants${responseFormat}`);
}
export function postAddParticipantConversation(
  token: string,
  newParticipant: string,
  source: string,
): Promise<AddParticipantConversationInterface> {
  return talkInstance("v3").post(`/room/${token}/participants${responseFormat}`);
}
