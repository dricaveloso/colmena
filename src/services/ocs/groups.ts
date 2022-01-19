/* eslint-disable @typescript-eslint/ban-types */
import useOcsFetch from "@/hooks/useOcsFetch";
import { GroupsListInterface, GroupsItemInterface } from "@/interfaces/ocs";

export function listAllGroups(): GroupsListInterface {
  return useOcsFetch("/groups?format=json");
}

export function listUsersByGroup(group: string, options?: {}): GroupsItemInterface {
  return useOcsFetch(`/groups/${group}?format=json`, {}, options);
}

export function getSpecificGroup(group: string): GroupsItemInterface {
  return useOcsFetch(`/groups/${group}?format=json`);
}
