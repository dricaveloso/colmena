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
} from "@/interfaces/talk";
import talkInstance from "@/services/talk";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const responseFormat = "?format=json";

const version = publicRuntimeConfig.ncTalkVersion || "v3";

export function getUsersConversations(options?: {}): RoomListInterface {
  return useTalkFetch(version)(`/room${responseFormat}`, {}, options);
}

export function getUsersConversationsAxios(): Promise<RoomListInterface> {
  return talkInstance(version).get(`room${responseFormat}`);
}

export function getOpenConversations(): RoomListInterface {
  return useTalkFetch(version)(`/listed-room${responseFormat}`);
}

export function getSingleConversation(token: string): RoomInterface {
  return useTalkFetch(version)(`/room/${token + responseFormat}`);
}

export function getSingleConversationAxios(token: string): Promise<RoomInterface> {
  return talkInstance(version).get(`/room/${token + responseFormat}`);
}

export function getRoomParticipants(token: string, options?: {}): RoomParticipantsInterface {
  return useTalkFetch(version)(`/room/${token}/participants${responseFormat}`, {}, options);
}

export function setReadOnlyConversation(
  token: string,
  status: number,
): Promise<ReadOnlyRoomInterface> {
  return talkInstance(version).put(`room/${token}/read-only${responseFormat}`, {
    status,
  });
}

export function createNewConversation(roomName: string): Promise<RoomCreateInterface> {
  return talkInstance(version).post(`room${responseFormat}`, {
    roomType: 2,
    roomName,
  });
}

export function deleteConversation(token: string): Promise<DeleteConversationInterface> {
  return talkInstance(version).delete(`room/${token}/participants/self${responseFormat}`);
}

export function addDescriptionConversation(
  token: string,
  description: string,
): Promise<ParticipantCreateInterface> {
  return talkInstance(version).put(`room/${token}/description${responseFormat}`, {
    description,
  });
}

export function addParticipantToConversation(
  token: string,
  newParticipant: string,
): Promise<ParticipantCreateInterface> {
  return talkInstance(version).post(`room/${token}/participants${responseFormat}`, {
    newParticipant,
    source: "users",
  });
}
