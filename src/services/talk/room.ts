/* eslint-disable @typescript-eslint/ban-types */
import useTalkFetch from "@/hooks/useTalkFetch";
import {
  RoomListInterface,
  RoomInterface,
  RoomParticipantsInterface,
  ReadOnlyRoomInterface,
  RoomCreateInterface,
  ParticipantCreateInterface,
} from "@/interfaces/talk";
import talkInstance from "@/services/talk";

const responseFormat = "?format=json";

export function getUsersConversations(options?: {}): RoomListInterface {
  return useTalkFetch("v3")(`/room${responseFormat}`, {}, options);
}

export function getOpenConversations(): RoomListInterface {
  return useTalkFetch("v3")(`/listed-room${responseFormat}`);
}

export function getSingleConversation(token: string): RoomInterface {
  return useTalkFetch("v3")(`/room/${token + responseFormat}`);
}

export function getRoomParticipants(token: string, options?: {}): RoomParticipantsInterface {
  return useTalkFetch("v3")(`/room/${token}/participants${responseFormat}`, {}, options);
}

export function setReadOnlyConversation(
  token: string,
  status: number,
): Promise<ReadOnlyRoomInterface> {
  return talkInstance("v3").put(`room/${token}/read-only${responseFormat}`, {
    status,
  });
}

export function createNewConversation(roomName: string): Promise<RoomCreateInterface> {
  return talkInstance("v3").post(`room${responseFormat}`, {
    roomType: 2,
    roomName,
  });
}

export function addDescriptionConversation(
  token: string,
  description: string,
): Promise<ParticipantCreateInterface> {
  return talkInstance("v3").put(`room/${token}/description${responseFormat}`, {
    description,
  });
}

export function addParticipantToConversation(
  token: string,
  newParticipant: string,
): Promise<ParticipantCreateInterface> {
  return talkInstance("v3").post(`room/${token}/participants${responseFormat}`, {
    newParticipant,
    source: "users",
  });
}
