import useOcsFetch from "@/hooks/useOcsFetch";
import { GroupsInfoInterface, GroupsUserInterface } from "@/interfaces/ocs";

export function listAllGroups(): GroupsInfoInterface {
  return useOcsFetch("/groups?format=json");
}
export function listGroupsUser(groupid: string): GroupsUserInterface {
  return useOcsFetch(`/groups/${groupid}`);
}
