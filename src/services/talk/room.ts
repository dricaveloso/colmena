/* eslint-disable @typescript-eslint/ban-types */
import useTalkFetch from "@/hooks/useTalkFetch";
import {
  RoomListInterface,
  RoomInterface,
  RoomParticipantsInterface,
  ReadOnlyRoomInterface,
  RoomCreateInterface,
  ParticipantCreateInterface,
  DeleteConversationInterface,
  // CreateNewConversationInterface,
  // AddParticipantConversationInterface,
  // AllowedGuestsConversationInterface,
} from "@/interfaces/talk";
import talkInstance from "@/services/talk";

const responseFormat = "?format=json";

export function getUsersConversations(options?: {}): RoomListInterface {
  return useTalkFetch("v4")(`/room${responseFormat}`, {}, options);
}

export function getOpenConversations(): RoomListInterface {
  return useTalkFetch("v4")(`/listed-room${responseFormat}`);
}

export function getSingleConversation(token: string): RoomInterface {
  return useTalkFetch("v4")(`/room/${token + responseFormat}`);
}

export function getRoomParticipants(token: string, options?: {}): RoomParticipantsInterface {
  return useTalkFetch("v4")(`/room/${token}/participants${responseFormat}`, {}, options);
}

export function setReadOnlyConversation(
  token: string,
  status: number,
): Promise<ReadOnlyRoomInterface> {
  return talkInstance("v4").put(`room/${token}/read-only${responseFormat}`, {
    status,
  });
}

export function createNewConversation(roomName: string): Promise<RoomCreateInterface> {
  return talkInstance("v4").post(`room${responseFormat}`, {
    roomType: 2,
    roomName,
  });
}

export function deleteConversation(token: string): Promise<DeleteConversationInterface> {
  return talkInstance("v4").delete(`room/${token}/participants/self${responseFormat}`);
}

export function addDescriptionConversation(
  token: string,
  description: string,
): Promise<ParticipantCreateInterface> {
  return talkInstance("v4").put(`room/${token}/description${responseFormat}`, {
    description,
  });
}

export function addParticipantToConversation(
  token: string,
  newParticipant: string,
): Promise<ParticipantCreateInterface> {
  return talkInstance("v4").post(`room/${token}/participants${responseFormat}`, {
    newParticipant,
    source: "users",
  });
}
