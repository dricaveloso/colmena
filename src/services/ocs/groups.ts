import useOcsFetch from "@/hooks/useOcsFetch";
import { GroupsListInterface, GroupsItemInterface } from "@/interfaces/ocs";

export function listAllGroups(): GroupsListInterface {
  return useOcsFetch("/groups?format=json");
}

export function getSpecificGroup(group: string): GroupsItemInterface {
  return useOcsFetch(`/groups/${group}?format=json`);
}
